import React from 'react';
import PoliceJobFormPage from './pages/PoliceJobFormPage';
import { Toaster } from 'react-hot-toast';

/**
 * Isolated Police Job Form Application
 * This component renders the police job form page
 * Access is controlled by AdminProtectedRoute in App.jsx
 */
const PoliceJobFormApp = () => {
    return (
        <>
            <PoliceJobFormPage />
            <Toaster position="top-right" />
        </>
    );
};

export default PoliceJobFormApp;

