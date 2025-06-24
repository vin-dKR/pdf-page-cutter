import React, { useRef } from 'react';
import { useRenameJpgStore } from '@/store-hooks/renameJpgStore';

const ImageUploader: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const setImages = useRenameJpgStore(state => state.setImages);

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            alert('Please upload image files.');
            return;
        }
        
        setImages(imageFiles);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className='relative z-10 mx-auto mb-6 w-11/12 cursor-pointer rounded-lg border-2 border-dashed border-gray-500 p-8 text-center sm:w-5/6 md:w-3xl lg:w-5xl xl:w-7xl'
            onClick={() => inputRef.current?.click()}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleInputChange}
            />
            <p>Drag and drop images here, or click to select a file</p>
        </div>
    );
};

export default ImageUploader; 