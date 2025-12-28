import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

/**
 * PostSearch Component
 * Search bar for filtering posts
 */
const PostSearch = ({ value, onChange, onClear, placeholder = 'Search posts...' }) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-slate-400" size={20} />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-12 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {value && (
                <button
                    onClick={onClear}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <FiX size={20} />
                </button>
            )}
        </div>
    );
};

export default PostSearch;
