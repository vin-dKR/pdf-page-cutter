"use client"
import { usePDFDataStore } from "@/store-hooks/pdfDataStore";
import React, { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;
}

const MemoizedPage = React.memo(({ pageNum }: { pageNum: number }) => {
    const [pageError, setPageError] = useState<string | null>(null)

    if (!pageNum) return <div>Failed to Load page: {pageNum}</div>
    return (
        <Page
            pageNumber={pageNum}
            width={600}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            onLoadError={(err) => setPageError(err.message)}
            loading={<div>Loading in Page memo...</div>}
        />
    )
})
MemoizedPage.displayName = 'MemoizedPage'




const PdfViewer = () => {
    const pdfData = usePDFDataStore((state) => state.pdfData)
    const [pageNum, setPageNum] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)
    const pageRef = useRef<(HTMLDivElement | null)[]>([])


    if (!pdfData) return <div className="text-red-500 text-center">No Pdf loaded</div>

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
        <div className="flex flex-col h-[800px] w-100% ">
            <style>{scrollbarStyle}</style>
            {/* Top Bar*/}
            <div className="w-100% bg-[#fafbfc] flex items-center ">
                <span className="text-[#333]">PDF Docs</span>
            </div>


            <div>
                <Document
                    file={pdfData ? pdfData.slice(0) : undefined}
                    onLoadSuccess={({ numPages }: { numPages: number }) => setPageNum(numPages)}
                    onLoadError={() => setError("Error while Loading the PDF")}
                    loading={<div className="text-center">Loading PDF..</div>}
                    error={<div className="text-center">{error}</div>}
                >
                    {Array.from({ length: pageNum }, (_, i) => (
                        <div
                            key={i}
                            ref={el => { pageRef.current[i] = el; }}
                            className="relative bg-white p-4 mb-8 shadow-md w-fit"
                        >
                            <MemoizedPage pageNum={pageNum} />

                        </div>
                    ))}
                </Document>
            </div>
        </div>
    )
}

export default PdfViewer
