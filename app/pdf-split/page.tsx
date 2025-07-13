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
        <div className="min-h-screen mx-auto sm:p-4 w-full md:w-2xl lg:w-5xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4">PDF Split</h1>
            <div className="mb-4 sm:mb-6">
                <PDFUploader />
            </div>

            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
                <div className="w-full lg:w-2/3">
                    <PDFPreviewer />
                </div>
                <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    <SplitList />
                    <ExportPanel />
                </div>
            </div>
        </div>
    );
};

export default Page;
