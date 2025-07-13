import React, { useRef, useState } from 'react';
import { usePDFDataStore } from '@/store-hooks/pdfDataStore';

const PDFUploader = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const pdfData = usePDFDataStore(state => state.pdfData);
    const setPdfData = usePDFDataStore(state => state.setPdfData);
    const [fileName, setFileName] = useState<string>('');

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            return;
        }
        setFileName(file.name);
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

    const handleClear = () => {
        setPdfData(null);
        setFileName('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleChange = () => {
        inputRef.current?.click();
    };

    // If PDF is loaded, show compact file info
    if (pdfData && fileName) {
        return (
            <div className="flex items-center justify-between p-2 bg-white/10 rounded-lg border border-white/20">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-white font-medium text-sm">{fileName}</p>
                        <p className="text-white/60 text-xs">PDF loaded</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={handleChange}
                        className="px-2 py-0.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium"
                    >
                        Change
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium"
                    >
                        Clear
                    </button>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    onChange={handleInputChange}
                />
            </div>
        );
    }

    // Show drag and drop container when no file is loaded
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
            className='relative z-10'
            onClick={() => inputRef.current?.click()}
        >
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