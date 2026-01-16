import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import PromotionStep from '../components/Admin/PromotionStep';
import JobFormDetailsStep from '../components/Admin/JobFormDetailsStep';
import VerificationStep from '../components/Admin/VerificationStep';
import PaymentStep from '../components/Admin/PaymentStep';
import SuccessStep from '../components/Admin/SuccessStep';
import { useAuth } from '../hooks/useAuth';

const PoliceJobFormPage = () => {
    // 1: Promotion, 2: Details, 3: Verification, 4: Payment, 5: Success
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [paymentId, setPaymentId] = useState(null);

    // Safely get auth context
    let user = null;
    try {
        const authHook = useAuth();
        user = authHook?.user;
    } catch (error) {
        console.log('Auth context not available');
    }

    const navigate = useNavigate();

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);
    const handleBackToDashboard = () => navigate('/admin');

    const handleDetailsSubmit = (data) => {
        setFormData(data);
        handleNext(); // Move to Verification
    };

    const handlePaymentSuccess = async (pId) => {
        setPaymentId(pId);

        try {
            // Submit the full application
            const res = await fetch('http://localhost:8080/api/application/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentId: pId,
                    formData: formData
                })
            });

            const data = await res.json();
            if (data.status === 'success') {
                handleNext(); // Move to Success
            } else {
                console.error("Submission failed: ", data.message);
                // Optionally handle error - maybe show a toast or stay on payment page with warning
                // For now, we proceed to show success but log the error or maybe alerting the user would be better
            }
        } catch (error) {
            console.error("Error submitting application:", error);
        }
    };

    const isAdmin = user && user.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden pt-8 pb-12">
            {/* Animated/Blur Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>
            </div>

            <div className="w-full relative z-10">
                {/* Admin-only Back Button */}
                {isAdmin && step === 1 && (
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
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <PromotionStep onNext={handleNext} />
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="max-w-4xl mx-auto px-4">
                                <JobFormDetailsStep onBack={handleBack} onNext={handleDetailsSubmit} initialData={formData} />
                            </div>
                        </motion.div>
                    )}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="px-4">
                                <VerificationStep formData={formData} onEdit={handleBack} onNext={handleNext} />
                            </div>
                        </motion.div>
                    )}
                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="px-4">
                                <PaymentStep
                                    amount={1}
                                    onSuccess={handlePaymentSuccess}
                                    onFailed={() => { }}
                                />
                                <div className="text-center mt-4">
                                    <button onClick={handleBack} className="text-slate-400 hover:text-white underline text-sm">
                                        Back to Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {step === 5 && (
                        <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            <div className="px-4">
                                <SuccessStep paymentId={paymentId} />
                                <div className="text-center mt-8">
                                    <button
                                        onClick={() => { setStep(1); setFormData({}); setPaymentId(null); }}
                                        className="text-slate-400 hover:text-white underline"
                                    >
                                        Start New Application
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PoliceJobFormPage;
