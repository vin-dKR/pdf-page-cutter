'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useQnADataStore } from '@/store-hooks/qnaPdfStore';
import { pdfjs } from 'react-pdf';

type PDFDocumentProxy = Awaited<ReturnType<typeof pdfjs.getDocument>['promise']>;

if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;
}

const PDFPreviewer: React.FC = () => {
    const { pdfData, selectedPages, togglePageSelection } = useQnADataStore();
    const [numPages, setNumPages] = useState<number>(0);
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
    const pdfDoc = useRef<PDFDocumentProxy | null>(null);

    // First effect: Load PDF and set the number of pages
    useEffect(() => {
        const loadPdf = async () => {
            if (!pdfData) {
                setNumPages(0);
                pdfDoc.current = null;
                return;
            }
            try {
                const loadingTask = pdfjs.getDocument({ data: pdfData.slice(0) });
                const pdf = await loadingTask.promise;
                pdfDoc.current = pdf;
                setNumPages(pdf.numPages);
            } catch (error) {
                console.error('Failed to load PDF:', error);
                alert('Failed to load the PDF. It may be corrupted or in an unsupported format.');
            }
        };
        loadPdf();
    }, [pdfData]);

    // Second effect: Render pages when numPages is known and canvases are ready
    useEffect(() => {
        const renderPages = async () => {
            if (!pdfDoc.current || numPages === 0) return;

            // Ensure canvasRefs array is the correct size
            canvasRefs.current = canvasRefs.current.slice(0, numPages);

            for (let i = 1; i <= numPages; i++) {
                const canvas = canvasRefs.current[i - 1];
                if (!canvas) continue;

                try {
                    const page = await pdfDoc.current.getPage(i);
                    const viewport = page.getViewport({ scale: 0.5 });
                    const context = canvas.getContext('2d');
                    if (context) {
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };
                        await page.render(renderContext).promise;
                    }
                } catch (error) {
                     console.error(`Failed to render page ${i}:`, error);
                }
            }
        };

        renderPages();
    }, [numPages]); // Reruns when numPages changes

    if (!pdfData) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            {Array.from({ length: numPages }, (_, i) => (
                <div
                    key={i}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden ${selectedPages.has(i + 1) ? 'border-blue-500' : 'border-transparent'}`}
                    onClick={() => togglePageSelection(i + 1)}
                >
                    <canvas ref={el => { canvasRefs.current[i] = el; }}></canvas>
                </div>
            ))}
        </div>
    );
};

export default PDFPreviewer; 