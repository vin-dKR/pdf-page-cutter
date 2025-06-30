"use client"
import PdfUploader from "@/components/chatpter-splitter/PdfUploader"

const Page = () => {
    return (
        <div className="h-screen mx-auto p-4">
            <h1 className="text-3xl font-bold text-center my-8">Image Renamer</h1>
            <PdfUploader />
        </div>

    )
}

export default Page
