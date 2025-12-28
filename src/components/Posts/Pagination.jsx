import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Pagination Component
 * Reusable pagination controls
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    const maxPagesToShow = 5;

    // Calculate page range to display
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <FiChevronLeft size={18} />
                <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
                {startPage > 0 && (
                    <>
                        <button
                            onClick={() => onPageChange(0)}
                            className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
                        >
                            1
                        </button>
                        {startPage > 1 && (
                            <span className="px-2 text-slate-400">...</span>
                        )}
                    </>
                )}

                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-lg transition-all font-medium ${currentPage === page
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        {page + 1}
                    </button>
                ))}

                {endPage < totalPages - 1 && (
                    <>
                        {endPage < totalPages - 2 && (
                            <span className="px-2 text-slate-400">...</span>
                        )}
                        <button
                            onClick={() => onPageChange(totalPages - 1)}
                            className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>

            {/* Next button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <span className="hidden sm:inline">Next</span>
                <FiChevronRight size={18} />
            </button>
        </div>
    );
};

export default Pagination;
