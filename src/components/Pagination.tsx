import React from "react";
import "../styles/pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  loading = false
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const windowSize = 5;
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
    let end = Math.min(totalPages, start + windowSize - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < windowSize) {
      start = Math.max(1, end - windowSize + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return { pages, start, end };
  };

  const { pages, start, end } = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (loading || page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="pagination-container">
      <div className="pagination-wrapper">
        {/* First page button */}
        <button
          className={`pagination-btn pagination-nav ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1 || loading}
          title="Trang đầu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/>
          </svg>
        </button>

        {/* Previous page button */}
        <button
          className={`pagination-btn pagination-nav ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          title="Trang trước"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>

        {/* Show dots if there are pages before visible range */}
        {start > 1 && (
          <>
            <button
              className="pagination-btn pagination-number"
              onClick={() => handlePageClick(1)}
              disabled={loading}
            >
              1
            </button>
            {start > 2 && <span className="pagination-dots">...</span>}
          </>
        )}

        {/* Page numbers */}
        {pages.map(page => (
          <button
            key={page}
            className={`pagination-btn pagination-number ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageClick(page)}
            disabled={loading}
            title={`Trang ${page}`}
          >
            {page}
          </button>
        ))}

        {/* Show dots if there are pages after visible range */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="pagination-dots">...</span>}
            <button
              className="pagination-btn pagination-number"
              onClick={() => handlePageClick(totalPages)}
              disabled={loading}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next page button */}
        <button
          className={`pagination-btn pagination-nav ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          title="Trang sau"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>

        {/* Last page button */}
        <button
          className={`pagination-btn pagination-nav ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages || loading}
          title="Trang cuối"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>
          </svg>
        </button>
      </div>

      {/* Page info */}
      <div className="pagination-info">
        <span className="pagination-text">
          Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
        </span>
        <span className="pagination-divider">•</span>
        <span className="pagination-text">
          Tổng <strong>{totalItems.toLocaleString()}</strong> mục
        </span>
      </div>
    </div>
  );
};

export default Pagination;