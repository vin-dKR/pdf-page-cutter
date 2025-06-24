"use client"
import React from 'react';
import PDFUploader from '@/components/pdf-splitter/PDFUploader';
import SplitList from '@/components/pdf-splitter/SplitList';
import ExportPanel from '@/components/pdf-splitter/ExportPanel';
import dynamic from 'next/dynamic';

// Dynamically import PDFPreviewer to avoid SSR issues with pdf.js
const PDFPreviewer = dynamic(() => import('@/components/pdf-splitter/PDFPreviewer'), { ssr: false });

const Page = () => {
    
    return (
        <div className="min-h-screen w-full md:min-w-3xl lg:min-w-5xl xl:min-wi7xl w-full text-white overflow-x-auto">
            <div className="max-w-7xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-center mb-8">PDF Split</h1>
                <PDFUploader />
            </div>
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 py-8">
                <div className="flex-1 border-white/5 rounded-lg flex justify-center">
                    <PDFPreviewer />
                </div>
                <div className="flex-1 flex flex-col gap-6">
                    <SplitList />
                    <ExportPanel />
                </div>
            </div>
        </div>
    );
};

export default Page;