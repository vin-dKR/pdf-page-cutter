"use client"
import { usePDFDataStore } from "@/store-hooks/pdfDataStore";
import React, { useEffect, useState } from "react";

const PdfViewer = () => {
    const pdfData = usePDFDataStore((state) => state.pdfData)
    const [url, setUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!pdfData) {
            setUrl(null)
            return
        }

        try {
            const blob = new Blob([pdfData], { type: "application/pdf" })
            const url = URL.createObjectURL(blob)
            setUrl(url)

            return () => {
                URL.revokeObjectURL(url)
                setUrl(null)
            }
        } catch (error) {
            console.error("Failed to process PDF data:", error);
            setUrl(null);
        }
    }, [pdfData])

    if (!pdfData || !url) {
        return (
            <div className="flex items-center justify-center h-64 sm:h-80 lg:h-96 bg-white/10 rounded-lg border border-white/10">
                <div className="text-white text-center">
                    <p className="text-lg font-medium mb-2">No PDF loaded</p>
                    <p className="text-sm">Upload a PDF to view it here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-100 lg:h-[800px] max-h-[800px] bg-white rounded-lg shadow-lg overflow-hidden">

            {/* Native PDF Viewer */}
            <div className="flex-1 w-full bg-gray-100">
                <iframe
                    src={url}
                    title="PDF Viewer"
                    className="w-full h-full border-none"
                    style={{ minHeight: "100%" }}
                />
            </div>
        </div>
    )
}

export default PdfViewer
