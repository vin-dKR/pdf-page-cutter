import React, { useRef } from 'react';
import { usePDFDataStore } from '@/store-hooks/pdfDataStore';

const PDFUploader: React.FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const setPdfData = usePDFDataStore(state => state.setPdfData);

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                // Clone the ArrayBuffer to avoid detachment
                const buffer = e.target.result as ArrayBuffer;
                const clone = buffer.slice(0);
                setPdfData(clone);
            }
        };
        reader.readAsArrayBuffer(file);
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
            style={{
                border: '2px dashed #888',
                borderRadius: 8,
                padding: 32,
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: 24,
            }}
            className='relative z-10 mx-4'
            onClick={() => inputRef.current?.click()}
        >
            {/* <div className='absolute w-full h-full bg-black/40 top-1 left-0 rounded-md z-0' /> */}
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={handleInputChange}
            />
            <p>Drag and drop a PDF here, or click to select a file</p>
        </div>
    );
};

export default PDFUploader; 