"use client"
import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import PDFPage from './PDFPage';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { usePDFDataStore } from '@/store-hooks/pdfDataStore';

if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;
}

// This component renders a single, memoized page and will not re-render
// unless the PDF itself changes.
const MemoizedPage = React.memo(({ pageNumber }: { pageNumber: number }) => {
    const [pageError, setPageError] = useState<string | null>(null);

    if (pageError) {
        return <div style={{ width: '100%', maxWidth: '600px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', color: '#666' }}>
            Failed to load page {pageNumber}
        </div>;
    }

    return (
        <Page
            pageNumber={pageNumber}
            width={Math.min(window.innerWidth * 0.8, 600)}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            onLoadError={(error) => setPageError(error.message)}
            loading={
                <div style={{ width: '100%', maxWidth: '600px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8' }}>
                    Loading page {pageNumber}...
                </div>
            }
            className="border-white/5 rounded-lg"

        />
    );
});
MemoizedPage.displayName = 'MemoizedPage';

const PDFPreviewer = () => {
    const pdfData = usePDFDataStore(state => state.pdfData);
    const [numPages, setNumPages] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

    if (!pdfData) {
        return (
            <div className="w-full flex items-center justify-center h-64 sm:h-80 lg:h-96 bg-white/10 rounded-lg border border-white/10">
                <div className="text-white text-center">
                    <p className="text-lg font-medium mb-2">No PDF loaded</p>
                    <p className="text-sm">Upload a PDF to view it here</p>
                </div>
            </div>
        )
    }

    // Minimal custom scrollbar CSS
    const scrollbarStyle = `
      .pdf-scrollbar::-webkit-scrollbar {
        width: 8px;
        background: transparent;
      }
      .pdf-scrollbar::-webkit-scrollbar-thumb {
        background: #bbb;
        border-radius: 4px;
      }
      .pdf-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #bbb #fff;
      }
    `;

    return (
        <div className="flex flex-col h-[600px] md:h-[700px] lg:h-[800px] w-full">
            <style>{scrollbarStyle}</style>
            {/* Top Bar */}
            <div className="w-full bg-[#fafbfc] border-b border-gray-200 px-4 md:px-6 py-2 md:py-3 flex items-center justify-between sticky top-0">
                <span className="font-medium text-[#333] text-sm md:text-base">PDF Document</span>
            </div>
            {/* PDF Pages Scrollable */}
            <div
                ref={containerRef}
                className="pdf-scrollbar flex-1 overflow-y-auto overflow-x-hidden w-full p-2 md:p-4 lg:p-6 bg-gray-100"
            >
                <Document
                    file={pdfData ? pdfData.slice(0) : undefined}
                    onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}
                    onLoadError={() => setError('Failed to load PDF.')}
                    loading={<div className="text-center">Loading PDF...</div>}
                    error={<div className="text-center text-red-500">{error || 'Failed to load PDF.'}</div>}
                >
                    {Array.from({ length: numPages }, (_, i) => (
                        <div
                            key={i}
                            data-page={i + 1}
                            ref={el => { pageRefs.current[i] = el; }}
                            className="relative bg-white p-2 md:p-4 lg:p-6 mb-4 md:mb-6 lg:mb-8 shadow-md w-fit mx-auto"
                        >
                            <MemoizedPage pageNumber={i + 1} />
                            <PDFPage pageNumber={i + 1} />
                        </div>
                    ))}
                </Document>
            </div>
        </div>
    );
};

export default PDFPreviewer; 
