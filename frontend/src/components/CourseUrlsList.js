import React from 'react';

function CourseUrlsList({ courseUrls }) {
  return (
    <div>
      <h3>Course URLs</h3>
      <ul className="list-group">
        {courseUrls.map((url, index) => (
          <li key={index} className="list-group-item">
            {url}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseUrlsList;
