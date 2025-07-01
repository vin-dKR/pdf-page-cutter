"use client"
import { usePDFDataStore } from "@/store-hooks/pdfDataStore";
import React, { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;
}

const MemoizedPage = React.memo(({ pageNum }: { pageNum: number }) => {
    const [pageError, setPageError] = useState<string | null>(null)

    if (pageError) {
        return <div style={{ width: 600, height: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', color: '#666' }}>
            Failed to load page {pageNum}
        </div>;
    }

    return (
        <Page
            pageNumber={pageNum}
            width={600}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            onLoadError={(err) => setPageError(err.message)}
            loading={
                <div style={{ width: 600, height: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8' }}>
                    Loading page {pageNum}...
                </div>
            }
            className="border-white/5 rounded-lg"
        />
    )
})
MemoizedPage.displayName = 'MemoizedPage'

const PdfViewer = () => {
    const pdfData = usePDFDataStore((state) => state.pdfData)
    const [numPages, setNumPages] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    if (!pdfData) return <div className="text-red-500 text-center">No PDF loaded</div>

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
        <div className="flex flex-col h-[800px] max-h-[800px]">
            <style>{scrollbarStyle}</style>
            {/* Top Bar */}
            <div className="w-full bg-[#fafbfc] border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
                <span className="font-medium text-[#333]">PDF Document</span>
            </div>

            {/* PDF Pages Scrollable Container */}
            <div
                ref={containerRef}
                className="pdf-scrollbar flex-1 overflow-y-auto overflow-x-hidden w-full p-5 bg-gray-100"
            >
                <Document
                    file={pdfData ? pdfData.slice(0) : undefined}
                    onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}
                    onLoadError={() => setError("Error while Loading the PDF")}
                    loading={<div className="text-center">Loading PDF...</div>}
                    error={<div className="text-center text-red-500">{error}</div>}
                >
                    {Array.from({ length: numPages }, (_, i) => (
                        <div
                            key={i}
                            className="relative bg-white p-4 mb-8 shadow-md w-fit mx-auto"
                        >
                            <MemoizedPage pageNum={i + 1} />
                        </div>
                    ))}
                </Document>
            </div>
        </div>
    )
}

export default PdfViewer
