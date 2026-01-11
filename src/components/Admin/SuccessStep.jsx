import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiDownload } from 'react-icons/fi';

const SuccessStep = ({ paymentId }) => {
    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-lg w-full text-center relative overflow-hidden"
            >
                {/* Background confetti effect placeholder */}
                <div className="absolute inset-0 bg-green-50/50 -z-10"></div>

                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="bg-green-500 text-white p-4 rounded-full shadow-lg"
                    >
                        <FiCheck size={40} />
                    </motion.div>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Application Submitted!</h2>
                <p className="text-slate-500 mb-8">
                    Your application for UP Police Recruitment 2026 has been successfully submitted and fee paid.
                </p>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 text-left">
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-500 text-sm">Payment ID</span>
                        <span className="font-mono font-bold text-slate-800 text-sm">{paymentId}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-500 text-sm">Status</span>
                        <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-0.5 rounded">PAID</span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                    <FiDownload /> Download Acknowledgment
                </motion.button>

                <p className="mt-6 text-xs text-slate-400">
                    A confirmation email has been sent to your registered email address.
                </p>
            </motion.div>
        </div>
    );
};

export default SuccessStep;
