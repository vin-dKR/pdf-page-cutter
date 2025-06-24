'use client'
import { useRenameJpgStore } from '@/store-hooks/renameJpgStore';
import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Image from 'next/image';

const ImageRenamer: React.FC = () => {
    const images = useRenameJpgStore(state => state.images);
    const resetImages = useRenameJpgStore(state => state.resetImages);
    const [baseName, setBaseName] = useState('');
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        const newImagePreviews = images.map(file => URL.createObjectURL(file));
        setImagePreviews(newImagePreviews);

        return () => {
            newImagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [images]);

    const handleRenameAndDownload = async () => {
        if (images.length === 0 || !baseName) {
            alert('Please upload images and provide a base name.');
            return;
        }

        const zip = new JSZip();
        images.forEach((image, index) => {
            const extension = image.name.split('.').pop() || 'jpg';
            const newName = `${baseName}-${String(index + 1).padStart(3, '0')}.${extension}`;
            zip.file(newName, image);
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `${baseName}.zip`);
    };

    if (images.length === 0) {
        return null;
    }

    return (
        <div className="p-4 flex flex-col items-center">
            <div className="flex flex-col items-center mb-12 w-92">
                <input
                    type="text"
                    placeholder="Enter base name"
                    value={baseName}
                    onChange={(e) => setBaseName(e.target.value)}
                    className="p-2 border border-white/10 rounded-md mb-4 bg-black/60 text-black text-white w-full"
                />
                <div className='flex justify-between w-full'>
                    <button onClick={handleRenameAndDownload} className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer border border-white/20">
                        Rename & Download
                    </button>
                    <button onClick={resetImages} className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer border border-white/20">
                        Clear Images
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:w-5/6 md:w-3xl lg:w-5xl xl:w-7xl">
                {images.map((image, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <Image src={imagePreviews[index]} alt={image.name} className="w-32 h-32 object-cover rounded-md" />
                        <p className="text-sm mt-2 text-center">{image.name}</p>
                        <p className="text-sm font-bold text-center bg-gray-200/20 px-4 rounded ">{baseName ? `${baseName}-${String(index + 1).padStart(3, '0')}.${image.name.split('.').pop() || 'jpg'}`: ''}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageRenamer; 