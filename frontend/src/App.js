// src/App.js
import React, { useState } from 'react';
import { useCourseUrls } from './context/CourseUrlContext'; // Ensure this path is correct
import CourseFetcher from './components/CourseFetcher';
import CourseTable from './components/CourseTable';
import CourseUrlsList from './components/CourseUrlsList';
import Pagination from './components/Pagination';
import ProgressBar from './components/ProgressBar';
import Tabs from './components/Tabs';
import './styles.css';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('urls');
  const [selectedUrls, setSelectedUrls] = useState(new Set());
  const [progress, setProgress] = useState({ current_page: 0, total_pages: 0 });
  const [pageSize, setPageSize] = useState(10);
  
  // Ensure useCourseUrls is called after the provider wraps App
  const { courseUrls, setCourseUrls } = useCourseUrls();

  const handleSelectUrl = (url) => {
    const updatedSelection = new Set(selectedUrls);
    if (updatedSelection.has(url)) {
      updatedSelection.delete(url);
    } else {
      updatedSelection.add(url);
    }
    setSelectedUrls(updatedSelection);
  };

  const handleSelectAll = (selectAll) => {
    if (selectAll) {
      setSelectedUrls(new Set(courseUrls.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(course => course.url)));
    } else {
      setSelectedUrls(new Set());
    }
  };

  const handleExtractWebsites = async () => {
    if (selectedUrls.size === 0) {
      alert('Please select at least one course URL.');
      return;
    }

    const urlArray = Array.from(selectedUrls);
    if (urlArray.length === 1) {
      console.log(`Extracting website for: ${urlArray[0]}`);
    } else {
      console.log(`Extracting websites for: ${urlArray.join(', ')}`);
    }

    setSelectedUrls(new Set());
  };

  const displayedCourses = courseUrls.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Udemy Course Fetcher</h1>
      <CourseFetcher
        setTotalPages={setTotalPages}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
        setProgress={setProgress}
      />
      <ProgressBar loading={loading} progress={progress} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'urls' && <CourseUrlsList courseUrls={displayedCourses} />}
      {activeTab === 'list' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-primary" onClick={handleExtractWebsites}>
              Extract Website
            </button>
            <div>
              <input
                type="checkbox"
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={selectedUrls.size === displayedCourses.length}
              />
              <label>Select All</label>
            </div>
          </div>
          <CourseTable
            courseUrls={displayedCourses}
            selectedUrls={selectedUrls}
            onSelectUrl={handleSelectUrl}
            onSelectAll={handleSelectAll}
          />
        </>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalPages / pageSize)}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default App;
