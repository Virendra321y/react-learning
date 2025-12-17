import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-bold text-blue-100 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Page Not Found</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
