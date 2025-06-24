'use client';
import React, { useEffect, useRef } from 'react';
import { useQnADataStore } from '@/store-hooks/qnaPdfStore';
import * as pdfjsLib from 'pdfjs-dist';

// Required for pdf.js to work
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

const PDFPreviewer: React.FC = () => {
    const { pdfData, selectedPages, togglePageSelection } = useQnADataStore();
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
    const renderTasks = useRef<any[]>([]);

    useEffect(() => {
        const renderPdf = async () => {
            if (!pdfData) return;
            try {
                const loadingTask = pdfjsLib.getDocument({ data: pdfData.slice(0) });
                const pdf = await loadingTask.promise;
                const numPages = pdf.numPages;
                canvasRefs.current = canvasRefs.current.slice(0, numPages);

                for (let i = 1; i <= numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 0.5 });
                    const canvas = canvasRefs.current[i - 1];
                    if (canvas) {
                        const context = canvas.getContext('2d');
                        if (context) {
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            const renderContext = {
                                canvasContext: context,
                                viewport: viewport,
                            };
                            const task = page.render(renderContext);
                            renderTasks.current.push(task);
                            await task.promise;
                        }
                    }
                }
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortException') {
                    // This is expected when a render is cancelled, so we can ignore it.
                    return;
                }
                console.error('Failed to render PDF:', error);
                alert('Failed to load or render the PDF. It may be corrupted or in an unsupported format.');
            }
        };

        renderPdf();

        return () => {
            renderTasks.current.forEach(task => task.cancel());
            renderTasks.current = [];
        }

    }, [pdfData]);

    if (!pdfData) {
        return null;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {Array.from({ length: canvasRefs.current.length || (pdfData ? 10 : 0) /* Initial length guess */ }, (_, i) => (
                <div
                    key={i}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden ${selectedPages.has(i + 1) ? 'border-blue-500' : 'border-transparent'}`}
                    onClick={() => togglePageSelection(i + 1)}
                >
                    <canvas ref={el => { canvasRefs.current[i] = el }}></canvas>
                </div>
            ))}
        </div>
    );
};

export default PDFPreviewer; 