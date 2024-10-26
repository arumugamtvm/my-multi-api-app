// ProgressBar.js
import React from 'react';

const ProgressBar = ({ loading, progress }) => {
  return (
    loading && (
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${(progress.current_page / progress.total_pages) * 100}%` }}>
          Loading... {progress.current_page} of {progress.total_pages}
        </div>
      </div>
    )
  );
};

export default ProgressBar;
