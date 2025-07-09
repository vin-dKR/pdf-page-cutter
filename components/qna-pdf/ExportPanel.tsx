'use client';
import React from 'react';
import { useQnADataStore } from '@/store-hooks/qnaPdfStore';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const ExportPanel: React.FC = () => {
    const { pdfData, selectedPages, clearSelections, name, setName } = useQnADataStore();

    const handleExport = async (exportSelected: boolean) => {
        if (!pdfData || selectedPages.size === 0 && exportSelected) {
            alert('Please select pages to export.');
            return;
        }

        try {
            const originalPdf = await PDFDocument.load(pdfData);
            const newPdf = await PDFDocument.create();
            const totalPages = originalPdf.getPageCount();

            const pagesToCopyIndices = [];
            for (let i = 0; i < totalPages; i++) {
                const pageNumber = i + 1;
                const isSelected = selectedPages.has(pageNumber);

                if ((exportSelected && isSelected) || (!exportSelected && !isSelected)) {
                    pagesToCopyIndices.push(i);
                }
            }

            if (pagesToCopyIndices.length === 0) {
                alert(`There are no ${exportSelected ? 'selected' : 'non-selected'} pages to export.`);
                return;
            }

            const copiedPages = await newPdf.copyPages(originalPdf, pagesToCopyIndices);
            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            return pdfBytes

        } catch (error) {
            console.error(`Failed to export ${exportSelected ? 'selected' : 'non-selected'} pages:`, error);
            alert('An error occurred while exporting the PDF.');
        }
    };

    const downloadZip = async () => {
        if (!pdfData || selectedPages.size === 0) {
            return
        }

        try {
            const zip = new JSZip()

            const selected = await handleExport(true)
            if (selected) {
                zip.file(`${name}-questions.pdf`, selected)
            }

            const unSelected = await handleExport(false)
            if (unSelected) {
                zip.file(`${name}-answer.pdf`, unSelected)
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' })
            saveAs(zipBlob, `${name}.zip`)
        } catch (e) {
            console.log("error in export panel", e)
            alert("err occured")
        }


    }

    if (!pdfData) {
        return null;
    }

    return (
        <div className="flex flex-col items-center gap-4 p-4 bg-white/20 rounded-lg border border-white/10">
            <h3 className="text-xl font-bold">Export Options</h3>

            <input
                type='text'
                placeholder='file-name'
                className='border border-white/20 w-full rounded-sm p-2'
                onChange={(e) => setName(e.target.value)}
            />

            <div className='w-50 flex flex-col gap-2'>

                <button onClick={downloadZip} className="px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 w-full border border-white/20 cursor-pointer">
                    Export'em
                </button>

                <button onClick={clearSelections} className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 disabled:bg-gray-500 w-full border border-white/20 cursor-pointer" disabled={selectedPages.size === 0}>
                    Clear Selections
                </button>
            </div>
        </div>
    );
};

export default ExportPanel; 
