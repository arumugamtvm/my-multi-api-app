import React from 'react';

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        <li className="page-item">
          <button className="page-link" onClick={handlePrevious}>Previous</button>
        </li>
        <li className="page-item">
          <button className="page-link" onClick={handleNext}>Next</button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
