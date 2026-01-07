import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PoliceJobFormPage from './pages/PoliceJobFormPage';
import { Toaster } from 'react-hot-toast';

/**
 * Isolated Police Job Form Application
 * This component is completely separate from the main app
 * and only allows access to the exact URL: /admin/police-job-form
 */
const PoliceJobFormApp = () => {
    const [show404, setShow404] = React.useState(false);

    useEffect(() => {
        // Monitor URL changes
        const checkUrl = () => {
            if (window.location.pathname !== '/admin/police-job-form') {
                setShow404(true);
            } else {
                setShow404(false);
            }
        };

        // Check on mount
        checkUrl();

        // Listen for URL changes (popstate for back/forward, pushstate/replacestate for programmatic)
        window.addEventListener('popstate', checkUrl);

        // Override history methods to prevent navigation
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        window.history.pushState = function (...args) {
            originalPushState.apply(window.history, args);
            checkUrl();
        };

        window.history.replaceState = function (...args) {
            originalReplaceState.apply(window.history, args);
            checkUrl();
        };

        return () => {
            window.removeEventListener('popstate', checkUrl);
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
        };
    }, []);

    if (show404) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-9xl font-extrabold text-white mb-4">404</h1>
                    <h2 className="text-3xl font-bold text-slate-300 mb-4">Page Not Found</h2>
                    <p className="text-slate-400 mb-8 max-w-md">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <a
                        href="/admin/police-job-form"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-orange-600 to-green-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all"
                    >
                        Go to Application Form
                    </a>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <PoliceJobFormPage />
            <Toaster position="top-right" />
        </Router>
    );
};

export default PoliceJobFormApp;
