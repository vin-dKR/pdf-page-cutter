"use client"
import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import PDFPage from './PDFPage';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { usePDFDataStore } from '@/store-hooks/pdfDataStore';

if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
}

// This component renders a single, memoized page and will not re-render
// unless the PDF itself changes.
const MemoizedPage = React.memo(({ pageNumber }: { pageNumber: number }) => {
    const [pageError, setPageError] = useState<string | null>(null);

    if (pageError) {
        return <div style={{ width: 600, height: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', color: '#666' }}>
            Failed to load page {pageNumber}
        </div>;
    }

    return (
        <Page
            pageNumber={pageNumber}
            width={600}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            onLoadError={(error) => setPageError(error.message)}
            loading={
                <div style={{ width: 600, height: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8' }}>
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
    // const [currentPage, setCurrentPage] = useState<number>(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);


    console.log(pageRefs.current, "----------------------------")


    // Track which page is in view using IntersectionObserver
    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (!containerRef.current || numPages === 0) return;
    //         const containerTop = containerRef.current.getBoundingClientRect().top;
    //         let closestPage = 1;
    //         let minDistance = Infinity;
    //         for (let i = 0; i < numPages; i++) {
    //             const ref = pageRefs.current[i];
    //             if (ref) {
    //                 const rect = ref.getBoundingClientRect();
    //                 const distance = Math.abs(rect.top - containerTop);
    //                 if (distance < minDistance) {
    //                     minDistance = distance;
    //                     closestPage = i + 1;
    //                 }
    //             }
    //         }
    //         setCurrentPage(closestPage);
    //     };
    //     const container = containerRef.current;
    //     if (container) {
    //         container.addEventListener('scroll', handleScroll);
    //     }
    //     // Initial call
    //     handleScroll();
    //     return () => {
    //         if (container) {
    //             container.removeEventListener('scroll', handleScroll);
    //         }
    //     };
    // }, [numPages]);

    if (!pdfData) {
        return <div style={{ color: '#888', textAlign: 'center' }}>No PDF loaded.</div>;
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
        <div style={{ display: 'flex', flexDirection: 'column', height: 800, maxHeight: 800, width: '100%' }}>
            <style>{scrollbarStyle}</style>
            {/* Top Bar */}
            <div style={{
                width: '100%',
                background: '#fafbfc',
                borderBottom: '1px solid #eee',
                padding: '10px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}>
                <span style={{ fontWeight: 500, color: '#333' }}>PDF Document</span>
                {/* <span style={{ color: '#666' }}>Page {currentPage} of {numPages}</span> */}

            </div>
            {/* PDF Pages Scrollable */}
            <div
                ref={containerRef}
                className="pdf-scrollbar"
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    width: '100%',
                    padding: '20px 0',
                    background: '#f0f0f0',
                }}
            >
                <Document
                    file={pdfData ? pdfData.slice(0) : undefined}
                    onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}
                    onLoadError={() => setError('Failed to load PDF.')}
                    loading={<div style={{ textAlign: 'center' }}>Loading PDF...</div>}
                    error={<div style={{ color: 'red', textAlign: 'center' }}>{error || 'Failed to load PDF.'}</div>}
                >
                    {Array.from({ length: numPages }, (_, i) => (
                        <div
                            key={i}
                            data-page={i + 1}
                            ref={el => { pageRefs.current[i] = el; }}
                            style={{
                                position: 'relative',
                                background: 'white',
                                padding: '16px',
                                marginBottom: '32px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                width: 'fit-content',
                                margin: '0 auto 32px auto'
                            }}
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