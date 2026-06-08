import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable pagination component
 * @param {number} currentPage - Current active page
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback when page changes
 * @param {boolean} hasNext - Whether there's a next page
 * @param {boolean} hasPrev - Whether there's a previous page
 * @param {number} totalItems - Total number of items (optional)
 */
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNext, 
  hasPrev,
  totalItems 
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center" style={{ gap: '16px', marginTop: '40px' }}>
      {totalItems && (
        <p className="text-sm text-gray-600">
          Showing page {currentPage} of {totalPages} ({totalItems} total items)
        </p>
      )}
      
      <div className="flex items-center" style={{ gap: '8px' }}>
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-medium transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ width: '40px', height: '40px' }}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="text-gray-400" style={{ padding: '0 4px' }}>
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`rounded-lg border-2 font-medium transition-all
                ${page === currentPage 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }
              `}
              style={{ width: '40px', height: '40px' }}
            >
              {page}
            </button>
          )
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-medium transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ width: '40px', height: '40px' }}
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
