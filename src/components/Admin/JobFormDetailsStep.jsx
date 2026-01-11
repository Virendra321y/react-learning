import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiUser, FiBook, FiActivity, FiBriefcase, FiUpload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const schema = z.object({
    fullName: z.string().min(3, 'Full name is required'),
    dob: z.string().min(1, 'Date of birth is required'),
    gender: z.string().min(1, 'Gender is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    address: z.string().min(10, 'Address is too short'),
    mobile: z.string().regex(/^[0-9]{10}$/, 'Invalid mobile number'),
    email: z.string().email('Invalid email address'),
    idType: z.string().min(1, 'ID type is required'),
    idNumber: z.string().min(5, 'ID number is required'),
    qualification: z.string().min(1, 'Qualification is required'),
    height: z.string().min(1, 'Height is required'),
    weight: z.string().min(1, 'Weight is required'),
    photoUrl: z.string().optional(),
    signatureUrl: z.string().optional(),
});

const JobFormDetailsStep = ({ onBack, onNext, initialData }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: initialData || {}
    });

    const handleFileUpload = async (event, fieldName) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            toast.loading('Uploading...', { id: 'upload' });
            const response = await fetch('http://localhost:8080/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();

            setValue(fieldName, data.url); // Set the URL in the form
            toast.success('Uploaded!', { id: 'upload' });
        } catch (error) {
            console.error(error);
            toast.error('Upload failed', { id: 'upload' });
        }
    };

    const onSubmit = (data) => {
        console.log('Form Details Next:', data);
        onNext(data);
    };

    const SectionTitle = ({ icon, title }) => (
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                {icon}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
    );

    const InputField = ({ label, name, type = 'text', options = null }) => (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
            {options ? (
                <select
                    {...register(name)}
                    className={`w-full px-4 py-2.5 bg-slate-50 border ${errors[name] ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
                >
                    <option value="">Select {label}</option>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : (
                <input
                    type={type}
                    {...register(name)}
                    className={`w-full px-4 py-2.5 bg-slate-50 border ${errors[name] ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                />
            )}
            {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name].message}</p>}
        </div>
    );

    return (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 px-8 py-6 text-white flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">New Recruitment Drive</h1>
                    <p className="text-slate-400 text-sm">Fill in the candidate details meticulously</p>
                </div>
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <FiArrowLeft size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-12">
                {/* Section I */}
                <section>
                    <SectionTitle icon={<FiUser />} title="I. Personal and Contact Information" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        <InputField label="Full Name" name="fullName" />
                        <InputField label="Date of Birth" name="dob" type="date" />
                        <InputField label="Gender" name="gender" options={['Male', 'Female', 'Other']} />
                        <InputField label="Nationality" name="nationality" options={['Indian', 'Other']} />
                        <InputField label="Email Address" name="email" type="email" />
                        <InputField label="Mobile Number" name="mobile" />
                        <div className="md:col-span-2">
                            <InputField label="Permanent Address" name="address" />
                        </div>
                        <InputField label="ID Proof Type" name="idType" options={['Aadhaar Card', 'Passport', 'Driving License', 'Voter ID']} />
                        <InputField label="ID Number" name="idNumber" />
                    </div>
                </section>

                {/* Section II */}
                <section>
                    <SectionTitle icon={<FiBook />} title="II. Educational Qualifications" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Highest Level" name="qualification" options={['10th Pass', '12th Pass', 'Graduate', 'Post Graduate']} />
                        <InputField label="University/Board" name="institution" />
                    </div>
                </section>

                {/* Section III */}
                <section>
                    <SectionTitle icon={<FiActivity />} title="III. Physical Standards" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputField label="Height (cm)" name="height" />
                        <InputField label="Weight (kg)" name="weight" />
                        <InputField label="Chest (cm - for male)" name="chest" />
                    </div>
                </section>

                {/* Section IV & V combined for brevity */}
                <section>
                    <SectionTitle icon={<FiBriefcase />} title="IV. Background & Documents" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-4">
                            <label className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors relative">
                                <FiUpload className="text-indigo-600" size={24} />
                                <div>
                                    <p className="font-bold text-slate-800">Upload Photo</p>
                                    <p className="text-xs text-slate-400">Passport size (max 2MB)</p>
                                </div>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => handleFileUpload(e, 'photoUrl')}
                                />
                                {/* Hidden input to register with hook form */}
                                <input type="hidden" {...register('photoUrl')} />
                            </label>

                            <label className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors relative">
                                <FiUpload className="text-indigo-600" size={24} />
                                <div>
                                    <p className="font-bold text-slate-800">Upload Signature</p>
                                    <p className="text-xs text-slate-400">Clear scan (max 1MB)</p>
                                </div>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => handleFileUpload(e, 'signatureUrl')}
                                />
                                <input type="hidden" {...register('signatureUrl')} />
                            </label>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-800 mb-3">Consent & Declaration</h4>
                            <label className="flex gap-3 cursor-pointer group">
                                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" required />
                                <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                                    I hereby declare that all information provided is true to the best of my knowledge. I consent to a full background investigation.
                                </span>
                            </label>
                        </div>
                    </div>
                </section>

                <div className="pt-6">
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                    >
                        <FiSave size={20} />
                        Review Application
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default JobFormDetailsStep;
