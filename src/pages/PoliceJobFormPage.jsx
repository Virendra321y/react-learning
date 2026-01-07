import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import PromotionStep from '../components/Admin/PromotionStep';
import JobFormDetailsStep from '../components/Admin/JobFormDetailsStep';
import { useAuth } from '../hooks/useAuth';

const PoliceJobFormPage = () => {
    const [step, setStep] = useState(1);

    // Safely get auth context - it might not be available in isolated mode
    let user = null;
    try {
        const authHook = useAuth();
        user = authHook?.user;
    } catch (error) {
        // Auth context not available - user is not logged in
        console.log('Auth context not available');
    }

    const navigate = useNavigate();

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    // Check if user is admin - only show back button for authenticated admin users
    const isAdmin = user && user.role === 'ADMIN';

    const handleBackToDashboard = () => {
        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-8 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Admin-only Back Button */}
                {isAdmin && (
                    <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBackToDashboard}
                        className="mb-6 inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-200"
                    >
                        <FiArrowLeft className="text-lg" />
                        Back to Dashboard
                    </motion.button>
                )}
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <PromotionStep onNext={nextStep} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <JobFormDetailsStep onBack={prevStep} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PoliceJobFormPage;
