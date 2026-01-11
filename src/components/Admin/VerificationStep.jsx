import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiCheckCircle } from 'react-icons/fi';

const VerificationStep = ({ formData, onEdit, onNext }) => {

    const DetailRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-slate-100 last:border-0">
            <span className="text-slate-500 font-medium text-sm sm:text-base">{label}</span>
            <span className="text-slate-800 font-semibold text-sm sm:text-base text-right">{value || 'N/A'}</span>
        </div>
    );

    const Section = ({ title, children }) => (
        <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">{title}</h3>
            {children}
        </div>
    );

    return (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-w-4xl mx-auto">
            <div className="bg-indigo-900 px-8 py-6 text-white flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Review Application</h1>
                    <p className="text-indigo-200 text-sm">Please verify your details before payment</p>
                </div>
                <div className="bg-white/10 p-2 rounded-lg">
                    <FiCheckCircle size={24} />
                </div>
            </div>

            <div className="p-8">
                <Section title="Personal Information">
                    <DetailRow label="Full Name" value={formData?.fullName} />
                    <DetailRow label="Date of Birth" value={formData?.dob} />
                    <DetailRow label="Gender" value={formData?.gender} />
                    <DetailRow label="Nationality" value={formData?.nationality} />
                    <DetailRow label="Mobile" value={formData?.mobile} />
                    <DetailRow label="Email" value={formData?.email} />
                </Section>

                <Section title="Address & ID">
                    <DetailRow label="Address" value={formData?.address} />
                    <DetailRow label="ID Proof" value={`${formData?.idType} - ${formData?.idNumber}`} />
                </Section>

                <Section title="Qualifications & Physical">
                    <DetailRow label="Qualification" value={formData?.qualification} />
                    <DetailRow label="Institution" value={formData?.institution} />
                    <DetailRow label="Height" value={`${formData?.height} cm`} />
                    <DetailRow label="Weight" value={`${formData?.weight} kg`} />
                    {formData?.chest && <DetailRow label="Chest" value={`${formData?.chest} cm`} />}
                </Section>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                        onClick={onEdit}
                        className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                        <FiEdit /> Edit Details
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onNext}
                        className="flex-[2] py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        Proceed to Payment (₹50) <FiCheckCircle />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default VerificationStep;
