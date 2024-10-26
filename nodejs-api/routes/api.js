const express = require('express');
const axios = require('axios');
const router = express.Router();
const winston = require('winston');

// Configure the logger (assumed to be the same instance from app.js)
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console(),
    ],
});

// Function to log API requests in a tabular format
function logApiRequest(url, method, payload) {
    const logMessage = `| URL                             | Method | Payload                          |\n` +
        `|----------------------------------|--------|----------------------------------|\n` +
        `| ${url}                           | ${method} | ${JSON.stringify(payload)}      |`;
    logger.info(logMessage);
}

// Function to log errors in a tabular format
function logError(message, url, method, payload) {
    const errorMessage = `| Error Message                   | URL                             | Method | Payload                          |\n` +
        `|----------------------------------|----------------------------------|--------|----------------------------------|\n` +
        `| ${message}                      | ${url}                           | ${method} | ${JSON.stringify(payload)}      |`;
    logger.error(errorMessage);
}

// Endpoint to fetch HTML content from the Python API
async function fetchCourseHTMLFromPython(url) {
    try {
        const response = await axios.post('http://127.0.0.1:5000/api/extract_website', { url });
        return response.data.html_content;
    } catch (error) {
        logError(error.message, url, 'POST', { url });
        return '<html></html>'; // Return empty HTML content on error
    }
}

// Progress tracking for Udemy courses and website extraction
let progressData = {
    udemy: {
        total_pages: 0,
        current_page: 0,
        course_urls: []
    },
    website_extraction: {
        total_urls: 0,
        current_url: 0,
        results: []
    }
};

// Endpoint to get all Udemy course URLs
router.post('/get_all_udemy_course_list', async (req, res) => {
    const { cookie } = req.body;
    const pythonApiUrl = "http://127.0.0.1:5000/api/get_all_udemy_course_list"; 

    if (!cookie) {
        return res.status(400).json({ error: 'No cookie provided' });
    }

    const cleanedCookie = cookie.replace(/[\n\t]/g, '').replace(/\s+/g, '').trim();

    try {
        const pythonApiResponse = await axios.post(pythonApiUrl, { cookie: cleanedCookie });

        if (pythonApiResponse.data.error) {
            return res.status(500).json({ message: 'Error from Python API', details: pythonApiResponse.data.error });
        }

        progressData.udemy.total_pages = pythonApiResponse.data.total_pages;
        progressData.udemy.current_page = 0;
        progressData.udemy.course_urls = pythonApiResponse.data.course_urls;
        
        return res.json({
            message: pythonApiResponse.data.message,
            courseUrls: pythonApiResponse.data.course_urls
        });

    } catch (error) {
        logError(error.message, pythonApiUrl, 'POST', { cookie: cleanedCookie });
        return res.status(500).json({ message: 'Error calling Python API', details: error.message });
    }
});

// Endpoint to get progress
router.get('/progress', async (req, res) => {
    try {
        const progressResponse = await axios.get('http://127.0.0.1:5000/api/progress');
        res.json(progressResponse.data);
    } catch (error) {
        logError(error.message, 'http://127.0.0.1:5000/api/progress', 'GET', {});
        res.status(500).json({ message: 'Error fetching progress', details: error.message });
    }
});

// Endpoint to process course URLs
router.post('/process-courses', async (req, res) => {
    const { courseUrls } = req.body;

    if (!Array.isArray(courseUrls) || courseUrls.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty course URLs' });
    }

    try {
        const courseDetailsPromises = courseUrls.map(async (url) => {
            const htmlContent = await fetchCourseHTMLFromPython(url);
            return {
                url,
                status: 'Processed successfully',
            };
        });

        const processedCourses = await Promise.all(courseDetailsPromises);

        res.json({ processedCourses });
    } catch (error) {
        logError(error.message, 'Course Processing', 'POST', { courseUrls });
        return res.status(500).json({ message: 'Error processing courses', details: error.message });
    }
});

module.exports = router;
