import React from 'react';

function CourseTable({ courseUrls }) {
  return (
    <div className="mt-5">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Instructor</th>
            <th>Category</th>
            <th>Duration</th>
            <th>URL</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {courseUrls.map((url, index) => (
            <tr key={index}>
              <td>{url.title}</td>
              <td>{url.instructor}</td>
              <td>{url.category}</td>
              <td>{url.duration}</td>
              <td>
                <a href={url.url} target="_blank" rel="noopener noreferrer">View Course</a>
              </td>
              <td>{url.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseTable;
