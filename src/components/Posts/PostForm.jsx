import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import MediaUpload from './MediaUpload';
import ImageFilters from './ImageFilters';

// Validation schema
const postSchema = z.object({
    title: z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(255, 'Title must not exceed 255 characters'),
    content: z.string()
        .min(10, 'Content must be at least 10 characters'),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], {
        required_error: 'Please select a status',
    }),
});

/**
 * PostForm Component
 * Reusable form for creating and editing posts with media upload
 */
const PostForm = ({ initialData, onSubmit, submitLabel = 'Submit', loading = false }) => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(postSchema),
        defaultValues: initialData || {
            title: '',
            content: '',
            status: 'DRAFT',
        },
    });

    const handleFormSubmit = (data) => {
        // Include media files in submission
        onSubmit({
            ...data,
            media: mediaFiles
        });
    };

    const handleFiltersChange = (filters) => {
        if (selectedImageIndex !== null) {
            const updatedFiles = [...mediaFiles];
            updatedFiles[selectedImageIndex].filters = filters;
            setMediaFiles(updatedFiles);
        }
    };

    const openFilterModal = (index) => {
        setSelectedImageIndex(index);
        setFilterModalOpen(true);
    };

    return (
        <>
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-6"
            >
                {/* Title Input */}
                <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('title')}
                        type="text"
                        id="title"
                        placeholder="Enter post title..."
                        className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-500' : 'border-slate-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                    )}
                </div>

                {/* Content Textarea */}
                <div>
                    <label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-2">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register('content')}
                        id="content"
                        rows="10"
                        placeholder="Write your post content..."
                        className={`w-full px-4 py-3 rounded-lg border ${errors.content ? 'border-red-500' : 'border-slate-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none`}
                    />
                    {errors.content && (
                        <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
                    )}
                </div>

                {/* Media Upload */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Media (Images & Videos)
                    </label>
                    <MediaUpload
                        onFilesChange={setMediaFiles}
                        maxFiles={5}
                        maxSize={10485760} // 10MB
                    />
                    {mediaFiles.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {mediaFiles.map((fileObj, index) => (
                                <div key={index} className="relative group">
                                    {fileObj.type === 'image' && (
                                        <button
                                            type="button"
                                            onClick={() => openFilterModal(index)}
                                            className="absolute top-2 left-2 z-10 px-3 py-1 rounded-md bg-blue-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                                        >
                                            Edit Filters
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Status Select */}
                <div>
                    <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-2">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register('status')}
                        id="status"
                        className={`w-full px-4 py-3 rounded-lg border ${errors.status ? 'border-red-500' : 'border-slate-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : submitLabel}
                    </button>
                    {mediaFiles.length > 0 && (
                        <span className="text-sm text-slate-600">
                            {mediaFiles.length} {mediaFiles.length === 1 ? 'file' : 'files'} attached
                        </span>
                    )}
                </div>
            </motion.form>

            {/* Image Filters Modal */}
            <AnimatePresence>
                {filterModalOpen && selectedImageIndex !== null && mediaFiles[selectedImageIndex]?.type === 'image' && (
                    <ImageFilters
                        image={mediaFiles[selectedImageIndex].preview}
                        filters={mediaFiles[selectedImageIndex].filters}
                        onFiltersChange={handleFiltersChange}
                        onClose={() => {
                            setFilterModalOpen(false);
                            setSelectedImageIndex(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default PostForm;
