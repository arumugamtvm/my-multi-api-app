import React from 'react';

function ProgressBar({ loading }) {
  return (
    loading && (
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '100%' }}>Loading...</div>
      </div>
    )
  );
}

export default ProgressBar;
