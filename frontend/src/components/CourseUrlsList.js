// src/components/CourseUrlsList.js
import React from 'react';
import { useCourseUrls } from '../context/CourseUrlContext'; // Import the hook

function CourseUrlsList() {
  const { courseUrls } = useCourseUrls(); // Use the hook

  return (
    <div className="course-urls-list">
      <h2>Course URLs</h2>
      <ul>
        {courseUrls.length > 0 ? (
          courseUrls.map((url, index) => (
            <li key={index}>
              <a href={`https://www.udemy.com${url}`} target="_blank" rel="noopener noreferrer">{url}</a>
            </li>
          ))
        ) : (
          <li>No course URLs available</li>
        )}
      </ul>
    </div>
  );
}

export default CourseUrlsList;
