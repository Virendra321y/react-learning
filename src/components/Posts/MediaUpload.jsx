import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX, FiImage, FiVideo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MediaUpload Component
 * Drag-and-drop file upload for images and videos
 */
const MediaUpload = ({ onFilesChange, maxFiles = 5, maxSize = 10485760 }) => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        setError('');

        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.errors[0]?.code === 'file-too-large') {
                setError(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`);
            } else if (rejection.errors[0]?.code === 'file-invalid-type') {
                setError('Invalid file type. Only images and videos are allowed.');
            } else {
                setError('File upload failed. Please try again.');
            }
            return;
        }

        if (files.length + acceptedFiles.length > maxFiles) {
            setError(`Maximum ${maxFiles} files allowed`);
            return;
        }

        const newFiles = acceptedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            type: file.type.startsWith('image/') ? 'image' : 'video',
            filters: {
                grayscale: 0,
                sepia: 0,
                brightness: 100,
                contrast: 100,
                blur: 0,
                saturate: 100,
                hueRotate: 0,
            }
        }));

        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    }, [files, maxFiles, maxSize, onFilesChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
            'video/*': ['.mp4', '.webm', '.mov']
        },
        maxSize,
        multiple: true
    });

    const removeFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    const updateFilters = (index, filters) => {
        const updatedFiles = [...files];
        updatedFiles[index].filters = filters;
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    return (
        <div className="space-y-4">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                    }`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                        <FiUpload className="text-white" size={32} />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-slate-700">
                            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            or click to browse (max {maxFiles} files, {maxSize / 1024 / 1024}MB each)
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                            Supports: Images (PNG, JPG, GIF) & Videos (MP4, WEBM)
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                    {error}
                </motion.div>
            )}

            {/* File Previews */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                        {files.map((fileObj, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative group"
                            >
                                <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                    {fileObj.type === 'image' ? (
                                        <img
                                            src={fileObj.preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            style={{
                                                filter: `
                                                    grayscale(${fileObj.filters.grayscale}%)
                                                    sepia(${fileObj.filters.sepia}%)
                                                    brightness(${fileObj.filters.brightness}%)
                                                    contrast(${fileObj.filters.contrast}%)
                                                    blur(${fileObj.filters.blur}px)
                                                    saturate(${fileObj.filters.saturate}%)
                                                    hue-rotate(${fileObj.filters.hueRotate}deg)
                                                `
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FiVideo size={48} className="text-slate-400" />
                                        </div>
                                    )}
                                </div>

                                {/* File Info */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                    <div className="flex items-center gap-1 text-white text-xs">
                                        {fileObj.type === 'image' ? <FiImage size={12} /> : <FiVideo size={12} />}
                                        <span className="truncate">{fileObj.file.name}</span>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <FiX size={16} />
                                </button>

                                {/* Filter Button (Images Only) */}
                                {fileObj.type === 'image' && (
                                    <button
                                        onClick={() => {
                                            // This will be handled by ImageFilters component
                                        }}
                                        className="absolute top-2 left-2 px-2 py-1 rounded-md bg-blue-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                                    >
                                        Filters
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MediaUpload;
