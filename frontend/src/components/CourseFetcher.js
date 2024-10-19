import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCourseUrls } from '../context/CourseUrlContext'; // Import the hook

function CourseFetcher({ setTotalPages, setCurrentPage, setLoading, setProgress }) {
  const [cookie, setCookie] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const intervalIdRef = useRef(null); // Use ref to store interval ID

  const { setCourseUrls } = useCourseUrls(); // Use the hook

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/get_all_udemy_course_list', { cookie });
      setTotalPages(response.data.total_pages); 
      setCurrentPage(1);
      checkProgress();
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
    setLoading(false);
  };

  const checkProgress = () => {
    // Clear any existing interval to prevent multiple intervals from running
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);

    const id = setInterval(async () => {
      try {
        const progressResponse = await axios.get('http://localhost:3000/api/progress');
        const progressData = progressResponse.data.udemy;

        if (progressData) {
          const newCourseUrls = Array.isArray(progressData.course_urls) ? progressData.course_urls : [];
          setCourseUrls(prevUrls => Array.from(new Set([...prevUrls, ...newCourseUrls])));

          setProgress({
            total_pages: progressData.total_pages,
            current_page: progressData.current_page,
          });

          // Stop checking if the fetching is complete
          if (progressData.current_page >= progressData.total_pages) {
            clearInterval(id);
            intervalIdRef.current = null; // Clear the stored interval ID
          }
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        clearInterval(id);
      }
    }, 5000); // Check progress every 5 seconds

    intervalIdRef.current = id; // Store the interval ID
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  return (
    <div className="mb-4">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="cookie" className="form-label">Cookie</label>
          <textarea
            className="form-control"
            id="cookie"
            rows="3"
            value={cookie}
            onChange={(e) => setCookie(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="page-size" className="form-label">Page Size</label>
          <select
            className="form-select"
            id="page-size"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="75">75</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      <button className="btn btn-primary" onClick={fetchCourses}>Fetch Courses</button>
    </div>
  );
}

export default CourseFetcher;
