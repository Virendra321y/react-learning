import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';

const ImageCropper = ({ image, onCropComplete, aspectRatio = 1 }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
        onCropComplete(croppedArea, croppedAreaPixels);
    }, [onCropComplete]);

    return (
        <div className="space-y-4">
            <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio}
                    onCropChange={onCropChange}
                    onCropComplete={handleCropComplete}
                    onZoomChange={onZoomChange}
                />
            </div>

            <div className="flex items-center gap-4 px-2">
                <FiZoomOut className="text-slate-400" />
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <FiZoomIn className="text-slate-400" />
            </div>
        </div>
    );
};

export default ImageCropper;
