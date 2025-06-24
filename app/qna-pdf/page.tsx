"use client"

import QnAPDFUploader from '@/components/qna-pdf/PdfUploader';
import { useQnADataStore } from "@/store-hooks/qnaPdfStore";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import ExportPanel from "@/components/qna-pdf/ExportPanel";

const PDFPreviewer = dynamic(() => import('@/components/qna-pdf/PDFPreviewer'), { ssr: false });

const Page = () => {

    const { pdfData, reset } = useQnADataStore();

    useEffect(() => {
        return () => {
            reset();
        }
    }, [reset]);

    return (
        <div className="min-h-screen w-full text-white">
            <div className="max-w-7xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-center mb-8">QnA PDF Selector</h1>
                <QnAPDFUploader />
            </div>
            {pdfData && (
                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 py-8">
                    <div className="flex-1 border-white/5 rounded-lg flex justify-center">
                        <PDFPreviewer />
                    </div>
                    <div className="lg:w-1/4">
                        <ExportPanel />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Page