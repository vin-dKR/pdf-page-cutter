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
        return <div className="text-red-500 text-center">No PDF loaded</div>;
    }

    return (
        <div className="flex flex-col w-[600px] h-[800px] max-h-[800px]">

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
