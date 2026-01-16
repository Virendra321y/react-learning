import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiUser, FiBook, FiActivity, FiBriefcase, FiUpload, FiCheckCircle } from 'react-icons/fi';
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
    chest: z.string().optional(),
    photoUrl: z.string().optional(),
    signatureUrl: z.string().optional(),
    marksheetUrl: z.string().optional(),
    categoryCertUrl: z.string().optional(),
});

const JobFormDetailsStep = ({ onBack, onNext, initialData }) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: initialData || {}
    });

    // Watch fields to update UI state
    const photoUrl = watch('photoUrl');
    const signatureUrl = watch('signatureUrl');
    const marksheetUrl = watch('marksheetUrl');
    const categoryCertUrl = watch('categoryCertUrl');

    const handleFileUpload = async (event, fieldName) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            toast.loading('Uploading... (अपलोड हो रहा है...)', { id: 'upload' });

            // Simulating upload delay for better UX feel
            await new Promise(r => setTimeout(r, 800));

            const response = await fetch('http://localhost:8080/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();

            setValue(fieldName, data.url); // Set the URL in the form
            toast.success('Uploaded Successfully! (सफलतापूर्वक अपलोड किया गया)', { id: 'upload' });
        } catch (error) {
            console.error(error);
            // Fallback for demo/visual purposes if backend fails
            // In a real app we would show error, but here to demonstrate the UI:
            // setValue(fieldName, 'https://via.placeholder.com/150');
            // toast.success('Demo Upload (Mock)', { id: 'upload' });

            toast.error('Upload failed (अपलोड विफल)', { id: 'upload' });
        }
    };

    const onSubmit = (data) => {
        console.log('Form Details Next:', data);
        onNext(data);
    };

    const SectionTitle = ({ icon, title, hindiTitle }) => (
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                {icon}
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                {hindiTitle && <p className="text-sm text-indigo-600 font-hindi font-medium">{hindiTitle}</p>}
            </div>
        </div>
    );

    const InputField = ({ label, hindiLabel, name, type = 'text', options = null }) => (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {label} {hindiLabel && <span className="text-slate-500 font-normal font-hindi">({hindiLabel})</span>}
            </label>
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

    const UploadField = ({ label, hindiLabel, name, value }) => {
        const isUploaded = !!value;
        return (
            <label className={`flex items-center gap-4 p-4 border-2 ${isUploaded ? 'border-green-500 bg-green-50' : 'border-dashed border-slate-200 hover:bg-slate-50'} rounded-2xl cursor-pointer transition-all relative group`}>
                <div className={`p-3 rounded-full ${isUploaded ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-indigo-600'}`}>
                    {isUploaded ? <FiCheckCircle size={24} /> : <FiUpload size={24} />}
                </div>
                <div className="flex-1">
                    <p className={`font-bold ${isUploaded ? 'text-green-800' : 'text-slate-800'}`}>
                        {label} {isUploaded && <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full ml-2">Uploaded</span>}
                    </p>
                    <p className="text-xs text-slate-500 font-hindi">{hindiLabel}</p>
                    <p className="text-xs text-slate-400 mt-1">{isUploaded ? 'Click to change file' : 'Max 2MB (PDF/JPG)'}</p>
                </div>
                <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, name)}
                />
                <input type="hidden" {...register(name)} />
            </label>
        );
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 px-8 py-6 text-white flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        New UP Police Recruitment Drive
                        <span className="text-sm font-normal text-slate-400 border-l border-slate-600 pl-2 ml-2 font-hindi">नई यूपी पुलिस भर्ती अभियान</span>
                    </h1>
                    <p className="text-slate-400 text-sm">Fill in the candidate details meticulously (उम्मीदवार का विवरण सावधानीपूर्वक भरें)</p>
                </div>
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                    <FiArrowLeft size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-12">
                {/* Section I */}
                <section>
                    <SectionTitle icon={<FiUser />} title="I. Personal Information" hindiTitle="व्यक्तिगत जानकारी" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        <InputField label="Full Name" hindiLabel="पूरा नाम" name="fullName" />
                        <InputField label="Date of Birth" hindiLabel="जन्म तिथि" name="dob" type="date" />
                        <InputField label="Gender" hindiLabel="लिंग" name="gender" options={['Male', 'Female', 'Other']} />
                        <InputField label="Nationality" hindiLabel="राष्ट्रीयता" name="nationality" options={['Indian', 'Other']} />
                        <InputField label="Email Address" hindiLabel="ईमेल पता" name="email" type="email" />
                        <InputField label="Mobile Number" hindiLabel="मोबाइल नंबर" name="mobile" />
                        <div className="md:col-span-2">
                            <InputField label="Permanent Address" hindiLabel="स्थायी पता" name="address" />
                        </div>
                        <InputField label="ID Proof Type" hindiLabel="पहचान पत्र प्रकार" name="idType" options={['Aadhaar Card', 'Passport', 'Driving License', 'Voter ID']} />
                        <InputField label="ID Number" hindiLabel="पहचान पत्र संख्या" name="idNumber" />
                    </div>
                </section>

                {/* Section II */}
                <section>
                    <SectionTitle icon={<FiBook />} title="II. Educational Qualifications" hindiTitle="शैक्षिक योग्यता" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Highest Level" hindiLabel="उच्चतम स्तर" name="qualification" options={['10th Pass', '12th Pass', 'Graduate', 'Post Graduate']} />
                        <InputField label="University/Board" hindiLabel="विश्वविद्यालय/बोर्ड" name="institution" />
                    </div>
                </section>

                {/* Section III */}
                <section>
                    <SectionTitle icon={<FiActivity />} title="III. Physical Standards" hindiTitle="शारीरिक मानक" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputField label="Height (cm)" hindiLabel="ऊंचाई" name="height" />
                        <InputField label="Weight (kg)" hindiLabel="वजन" name="weight" />
                        <InputField label="Chest (cm)" hindiLabel="छाती" name="chest" />
                    </div>
                </section>

                {/* Section IV: Documents */}
                <section>
                    <SectionTitle icon={<FiBriefcase />} title="IV. Background & Documents" hindiTitle="दस्तावेज़ और पृष्ठभूमि" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UploadField
                            label="Upload Photo"
                            hindiLabel="फोटो अपलोड करें"
                            name="photoUrl"
                            value={photoUrl}
                        />
                        <UploadField
                            label="Upload Signature"
                            hindiLabel="हस्ताक्षर अपलोड करें"
                            name="signatureUrl"
                            value={signatureUrl}
                        />
                        <UploadField
                            label="Upload Marksheet"
                            hindiLabel="अंकसूची अपलोड करें (10वीं/12वीं)"
                            name="marksheetUrl"
                            value={marksheetUrl}
                        />
                        <UploadField
                            label="Category Certificate"
                            hindiLabel="जाति प्रमाण पत्र अपलोड करें"
                            name="categoryCertUrl"
                            value={categoryCertUrl}
                        />
                    </div>

                    <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            Consent & Declaration
                            <span className="text-xs text-slate-500 font-normal font-hindi">(सहमति और घोषणा)</span>
                        </h4>
                        <label className="flex gap-3 cursor-pointer group">
                            <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" required />
                            <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                                I hereby declare that all information provided is true to the best of my knowledge. I consent to a full background investigation.
                                <br />
                                <span className="text-slate-500 font-hindi text-xs mt-1 block">
                                    मैं एतद्द्वारा घोषणा करता हूं कि प्रदान की गई सभी जानकारी मेरे सर्वोत्तम ज्ञान के अनुसार सत्य है।
                                </span>
                            </span>
                        </label>
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
                        <span className="font-hindi font-normal text-indigo-200">| आवेदन की समीक्षा करें</span>
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default JobFormDetailsStep;
