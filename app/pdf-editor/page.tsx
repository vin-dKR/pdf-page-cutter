"use client"
import PDFEditorUploader from '@/components/pdf-editor/PDFEditorUploader';
import PDFEditorPreviewer from '@/components/pdf-editor/PDFEditorPreviewer';
import PDFEditorControls from '@/components/pdf-editor/PDFEditorControls';

const Page = () => {
    return (
        <div className="min-h-screen mx-auto sm:p-4 w-full md:w-2xl lg:w-5xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4">PDF Editor</h1>
            <div className="mb-4 sm:mb-6">
                <PDFEditorUploader />
            </div>
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6">
                <div className="w-full lg:w-2/3">
                    <PDFEditorPreviewer />
                </div>
                <div className="w-full lg:w-1/3">
                    <PDFEditorControls />
                </div>
            </div>
        </div>
    )
}

export default Page; 