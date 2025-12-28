import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

/**
 * ImageFilters Component
 * Apply CSS filters to images
 */
const ImageFilters = ({ image, filters, onFiltersChange, onClose }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const filterPresets = [
        { name: 'Normal', filters: { grayscale: 0, sepia: 0, brightness: 100, contrast: 100, blur: 0, saturate: 100, hueRotate: 0 } },
        { name: 'Grayscale', filters: { grayscale: 100, sepia: 0, brightness: 100, contrast: 100, blur: 0, saturate: 100, hueRotate: 0 } },
        { name: 'Sepia', filters: { grayscale: 0, sepia: 100, brightness: 100, contrast: 100, blur: 0, saturate: 100, hueRotate: 0 } },
        { name: 'Vintage', filters: { grayscale: 20, sepia: 50, brightness: 110, contrast: 90, blur: 0, saturate: 80, hueRotate: 10 } },
        { name: 'Cool', filters: { grayscale: 0, sepia: 0, brightness: 105, contrast: 105, blur: 0, saturate: 110, hueRotate: 180 } },
        { name: 'Warm', filters: { grayscale: 0, sepia: 30, brightness: 110, contrast: 95, blur: 0, saturate: 120, hueRotate: 20 } },
        { name: 'High Contrast', filters: { grayscale: 0, sepia: 0, brightness: 105, contrast: 150, blur: 0, saturate: 120, hueRotate: 0 } },
        { name: 'Soft', filters: { grayscale: 0, sepia: 0, brightness: 110, contrast: 85, blur: 1, saturate: 90, hueRotate: 0 } },
    ];

    const handleFilterChange = (filterName, value) => {
        const updated = { ...localFilters, [filterName]: value };
        setLocalFilters(updated);
    };

    const applyPreset = (preset) => {
        setLocalFilters(preset.filters);
    };

    const handleApply = () => {
        onFiltersChange(localFilters);
        onClose();
    };

    const getFilterStyle = (filters) => ({
        filter: `
            grayscale(${filters.grayscale}%)
            sepia(${filters.sepia}%)
            brightness(${filters.brightness}%)
            contrast(${filters.contrast}%)
            blur(${filters.blur}px)
            saturate(${filters.saturate}%)
            hue-rotate(${filters.hueRotate}deg)
        `
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-800">Apply Filters</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Image Preview */}
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700 mb-3">Preview</h4>
                            <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    style={getFilterStyle(localFilters)}
                                />
                            </div>
                        </div>

                        {/* Filter Controls */}
                        <div className="space-y-6">
                            {/* Presets */}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 mb-3">Presets</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {filterPresets.map((preset) => (
                                        <button
                                            key={preset.name}
                                            onClick={() => applyPreset(preset)}
                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Manual Controls */}
                            <div>
                                <h4 className="text-sm font-semibold text-slate-700 mb-3">Custom Adjustments</h4>
                                <div className="space-y-4">
                                    {/* Grayscale */}
                                    <div>
                                        <label className="flex items-center justify-between text-sm text-slate-600 mb-1">
                                            <span>Grayscale</span>
                                            <span className="font-mono">{localFilters.grayscale}%</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={localFilters.grayscale}
                                            onChange={(e) => handleFilterChange('grayscale', parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Sepia */}
                                    <div>
                                        <label className="flex items-center justify-between text-sm text-slate-600 mb-1">
                                            <span>Sepia</span>
                                            <span className="font-mono">{localFilters.sepia}%</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={localFilters.sepia}
                                            onChange={(e) => handleFilterChange('sepia', parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Brightness */}
                                    <div>
                                        <label className="flex items-center justify-between text-sm text-slate-600 mb-1">
                                            <span>Brightness</span>
                                            <span className="font-mono">{localFilters.brightness}%</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="50"
                                            max="150"
                                            value={localFilters.brightness}
                                            onChange={(e) => handleFilterChange('brightness', parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Contrast */}
                                    <div>
                                        <label className="flex items-center justify-between text-sm text-slate-600 mb-1">
                                            <span>Contrast</span>
                                            <span className="font-mono">{localFilters.contrast}%</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="50"
                                            max="150"
                                            value={localFilters.contrast}
                                            onChange={(e) => handleFilterChange('contrast', parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Saturate */}
                                    <div>
                                        <label className="flex items-center justify-between text-sm text-slate-600 mb-1">
                                            <span>Saturation</span>
                                            <span className="font-mono">{localFilters.saturate}%</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            value={localFilters.saturate}
                                            onChange={(e) => handleFilterChange('saturate', parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Blur */}
                                    <div>
                                        <label className="flex items-center justify-between text-sm text-slate-600 mb-1">
                                            <span>Blur</span>
                                            <span className="font-mono">{localFilters.blur}px</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            value={localFilters.blur}
                                            onChange={(e) => handleFilterChange('blur', parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Hue Rotate */}
                                    <div>
                                        <label className="flex items-center justify-between text-sm text-slate-600 mb-1">
                                            <span>Hue</span>
                                            <span className="font-mono">{localFilters.hueRotate}°</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="360"
                                            value={localFilters.hueRotate}
                                            onChange={(e) => handleFilterChange('hueRotate', parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                        Apply Filters
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ImageFilters;
