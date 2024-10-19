from flask import Flask, request, jsonify
import requests
import math
import threading

app = Flask(__name__)

# Shared data structures for storing progress
progress_data = {
    "udemy": {
        "total_pages": 0,
        "current_page": 0,
        "course_urls": []
    },
    "website_extraction": {
        "total_urls": 0,
        "current_url": 0,
        "results": []
    }
}

def fetch_course_urls(cookie):
    global progress_data
    base_url = "https://www.udemy.com/api-2.0/users/me/subscribed-courses/"
    
    params = {
        "ordering": "title",
        "fields[course]": "archive_time,buyable_object_type,completion_ratio,enrollment_time,favorite_time,features,image_240x135,image_480x270,is_practice_test_course,is_private,is_published,last_accessed_time,num_collections,published_title,title,tracking_id,url,visible_instructors",
        "fields[user]": "@min,job_title",
        "is_archived": "false",
        "page_size": 100
    }

    headers = {
        'authority': 'www.udemy.com',
        'method': 'GET',
        'accept': 'application/json, text/plain, */*',
        'cookie': cookie
    }

    try:
        response = requests.get(base_url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            total_count = data['count']
            page_size = params['page_size']
            
            progress_data["udemy"]["total_pages"] = math.ceil(total_count / page_size)
            print(f"Total Pages: {progress_data['udemy']['total_pages']}")

            for page in range(1, progress_data["udemy"]["total_pages"] + 1):
                params["page"] = page
                print(f"Fetching page {page}...")
                response = requests.get(base_url, headers=headers, params=params)

                if response.status_code == 200:
                    print(f"Successfully fetched page {page}.")
                    data = response.json()

                    for course in data.get('results', []):
                        course_url = course.get('url')
                        if course_url:
                            progress_data["udemy"]["course_urls"].append(course_url)

                    progress_data["udemy"]["current_page"] = page  # Update current page after fetching
                else:
                    print(f"Error fetching page {page}: {response.status_code} - {response.text}")

            with open('udemy_course_urls.txt', 'w', encoding='utf-8') as file:
                for url in progress_data["udemy"]["course_urls"]:
                    file.write(url + '\n')

            return {'message': 'Course URLs fetched successfully', 'course_urls': progress_data["udemy"]["course_urls"]}

        else:
            return {'error': f'Initial request failed: {response.status_code} - {response.text}'}

    except Exception as e:
        return {'error': str(e)}

def extract_multiple_websites(urls):
    global progress_data
    progress_data["website_extraction"]["total_urls"] = len(urls)

    for idx, url in enumerate(urls):
        try:
            response = requests.get(url)
            if response.status_code == 200:
                progress_data["website_extraction"]["results"].append({'url': url, 'html_content': response.text})
            else:
                progress_data["website_extraction"]["results"].append({'url': url, 'error': f'Failed to fetch, Status code: {response.status_code}'})
        except Exception as e:
            progress_data["website_extraction"]["results"].append({'url': url, 'error': str(e)})
        
        progress_data["website_extraction"]["current_url"] = idx + 1  # Update current URL after fetching

@app.route('/api/extract_website', methods=['POST'])
def extract_website():
    data = request.json
    url = data.get('url')

    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    try:
        response = requests.get(url)
        if response.status_code == 200:
            return jsonify({'html_content': response.text})
        else:
            return jsonify({'url': url, 'error': f'Failed to fetch, Status code: {response.status_code}'})
    except Exception as e:
        return jsonify({'url': url, 'error': str(e)})

@app.route('/api/extract_websites', methods=['POST'])
def extract_websites():
    data = request.json
    urls = data.get('urls', [])

    if not urls:
        return jsonify({'error': 'No URLs provided'}), 400

    # Start extracting in a separate thread
    threading.Thread(target=extract_multiple_websites, args=(urls,)).start()

    return jsonify({'message': 'Extracting websites, please check progress at /api/progress'})

@app.route('/api/get_all_udemy_course_list', methods=['POST'])
def get_all_udemy_course_list():
    data = request.json
    cookie = data.get('cookie')

    if not cookie:
        return jsonify({'error': 'No cookie provided'}), 400

    # Start fetching in a separate thread
    threading.Thread(target=fetch_course_urls, args=(cookie,)).start()

    return jsonify({'message': 'Fetching courses, please check progress at /api/progress'})

@app.route('/api/progress', methods=['GET'])
def get_progress():
    return jsonify(progress_data)

if __name__ == '__main__':
    app.run(debug=True)
