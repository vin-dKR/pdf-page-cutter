import { useQnADataStore } from "@/store-hooks/qnaPdfStore"
import React, { useRef } from "react";

const QnAPDFUploader = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const setPdfData = useQnADataStore(state => state.setPdfData)

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0]

        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file.")
            return;
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result) {
                const buffer = e.target.result as ArrayBuffer
                const clone = buffer.slice(0)
                setPdfData(clone)
            }
        };
        reader.readAsArrayBuffer(file);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }


    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className='relative z-10 mx-auto mb-6 w-11/12 cursor-pointer rounded-lg border-2 border-dashed border-gray-500 p-8 text-center sm:w-5/6 md:w-3/4 lg:w-2/3 xl:max-w-7xl'
            onClick={() => inputRef.current?.click()}
        >
            {/* <div className='absolute w-full h-full bg-black/40 top-1 left-0 rounded-md z-0' /> */}
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={handleInputChange}
            />
            <p>Drag and drop a PDF here, or click to select a file</p>
        </div>
    )
}

export default QnAPDFUploader