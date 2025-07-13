"use client"
import PdfPageSelector from "@/components/chatpter-splitter/PdfPageSelector"
import PdfUploader from "@/components/chatpter-splitter/PdfUploader"
import PdfViewer from "@/components/chatpter-splitter/PdfViewer"
import { usePDFDataStore } from "@/store-hooks/pdfDataStore"
import { useEffect } from "react"

const Page = () => {
    const setPdfData = usePDFDataStore(state => state.setPdfData)

    useEffect(() => {
        // Cleanup function to clear PDF data when component unmounts
        return () => {
            setPdfData(null)
        }
    }, [setPdfData])

    return (
        <div className="min-h-screen mx-auto sm:p-4 w-full md:w-2xl lg:w-5xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4">Chapter Splitter</h1>
            <div className="mb-4 sm:mb-6">
                <PdfUploader />
            </div>

            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
                <div className="w-full lg:w-2/3">
                    <PdfViewer />
                </div>
                <div className="w-full lg:w-1/3">
                    <PdfPageSelector />
                </div>
            </div>
        </div>
    )
}

export default Page
