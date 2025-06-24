'use client';
import React from 'react';
import { useQnADataStore } from '@/store-hooks/qnaPdfStore';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

const ExportPanel: React.FC = () => {
    const { pdfData, selectedPages, clearSelections } = useQnADataStore();

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
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            saveAs(blob, `${exportSelected ? 'selected' : 'non-selected'}-pages.pdf`);

        } catch (error) {
            console.error(`Failed to export ${exportSelected ? 'selected' : 'non-selected'} pages:`, error);
            alert('An error occurred while exporting the PDF.');
        }
    };
    
    if (!pdfData) {
        return null;
    }

    return (
        <div className="flex flex-col items-center gap-4 p-4 bg-gray-800/20 rounded-lg">
            <h3 className="text-lg font-semibold">Export Options</h3>
            <div className='flex gap-4'>
                <button onClick={() => handleExport(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-500" disabled={selectedPages.size === 0}>
                    Export Selected
                </button>
                <button onClick={() => handleExport(false)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Export Non-Selected
                </button>
            </div>
            <button onClick={clearSelections} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-500" disabled={selectedPages.size === 0}>
                Clear Selections
            </button>
        </div>
    );
};

export default ExportPanel; 