// Tabs.js
import React from 'react';

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="nav nav-tabs">
      <button className={`nav-link ${activeTab === 'urls' ? 'active' : ''}`} onClick={() => setActiveTab('urls')}>
        Course URLs
      </button>
      <button className={`nav-link ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
        Course List
      </button>
    </div>
  );
};

export default Tabs;
