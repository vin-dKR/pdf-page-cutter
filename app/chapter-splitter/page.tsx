"use client"
import PdfPageSelector from "@/components/chatpter-splitter/PdfPageSelector"
import PdfUploader from "@/components/chatpter-splitter/PdfUploader"
import PdfViewer from "@/components/chatpter-splitter/PdfViewer"

const Page = () => {
    return (
        <div className="h-screen mx-auto p-4">
            <h1 className="text-3xl font-bold text-center my-8">Chapter Splitter</h1>
            <PdfUploader />

            <div className="max-w-7xl flex flex-row space-between gap-4">
                <PdfViewer />

                <div>
                    <PdfPageSelector />
                </div>
            </div>
        </div>

    )
}

export default Page
