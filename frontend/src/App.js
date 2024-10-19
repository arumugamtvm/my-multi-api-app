import React, { useState } from 'react';
import CourseFetcher from './components/CourseFetcher';
import CourseTable from './components/CourseTable';
import CourseUrlsList from './components/CourseUrlsList';
import Pagination from './components/Pagination';
import ProgressBar from './components/ProgressBar';
import './styles.css';

function App() {
  const [courseUrls, setCourseUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Udemy Course Fetcher</h1>
      <CourseFetcher
        setCourseUrls={setCourseUrls}
        setTotalPages={setTotalPages}
        setCurrentPage={setCurrentPage}
        setLoading={setLoading}
      />
      <ProgressBar loading={loading} />
      <CourseUrlsList courseUrls={courseUrls} />
      <CourseTable courseUrls={courseUrls} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default App;
