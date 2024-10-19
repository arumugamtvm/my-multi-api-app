import React, { useState } from 'react';
import axios from 'axios';

function CourseFetcher({ setCourseUrls, setTotalPages, setCurrentPage, setLoading }) {
  const [cookie, setCookie] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/get_all_udemy_course_list', { cookie });
      setCourseUrls(response.data.courseUrls);
      setTotalPages(response.data.total_pages);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
    setLoading(false);
  };

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
