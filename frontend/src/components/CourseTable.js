import React from 'react';

const CourseTable = ({ courseUrls, selectedUrls, onSelectUrl, onSelectAll }) => {
  const handleSelectAll = (event) => {
    onSelectAll(event.target.checked);
  };

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              onChange={handleSelectAll} // Handle select all
              checked={selectedUrls.size === courseUrls.length}
            />
          </th>
          <th>Course Title</th>
          <th>Instructor</th>
          <th>Category</th>
          <th>Duration</th>
          <th>URL</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {courseUrls.map((course) => (
          <tr key={course.url}>
            <td>
              <input
                type="checkbox"
                checked={selectedUrls.has(course.url)}
                onChange={() => onSelectUrl(course.url)}
              />
            </td>
            <td>{course.title || 'N/A'}</td>
            <td>{course.instructor || 'N/A'}</td>
            <td>{course.category || 'N/A'}</td>
            <td>{course.duration || 'N/A'}</td>
            <td>
              <a href={course.url || '#'} target="_blank" rel="noopener noreferrer">View Course</a>
            </td>
            <td>
              <span className="status-icon">
                {course.statusIcon} {/* Assuming statusIcon is part of course data */}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CourseTable;
