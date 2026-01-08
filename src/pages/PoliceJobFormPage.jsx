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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden pt-8 pb-12">
            {/* Animated/Blur Background Elements for 'Shadowy Color' effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>
            </div>


            <div className="w-full relative z-10">
                {/* Admin-only Back Button - Floating absolute for full screen look */}
                {isAdmin && (
                    <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleBackToDashboard}
                        className="absolute top-4 left-4 z-50 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-slate-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all border border-slate-200"
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
