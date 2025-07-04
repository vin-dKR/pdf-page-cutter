import React, { useState } from 'react';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { useSplitPointsStore } from '@/store-hooks/splitPointsStore';
import { usePDFDataStore } from '@/store-hooks/pdfDataStore';
import { Button } from '@headlessui/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


const ExportPanel = () => {
    const pdfData = usePDFDataStore(state => state.pdfData);
    const splitPoints = useSplitPointsStore(state => state.splitPoints);
    const [mergedUrl, setMergedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExport = async () => {
        if (!pdfData || pdfData.byteLength === 0) {
            setError('No valid PDF data to export.');
            return;
        }
        setLoading(true);
        setError(null);
        setMergedUrl(null);
        try {
            const origPdf = await PDFDocument.load(pdfData.slice(0));
            const mergedPdf = await PDFDocument.create();
            for (let pageNum = 0; pageNum < origPdf.getPageCount(); pageNum++) {
                // Always process pages in original order
                const page = origPdf.getPage(pageNum);
                const { width, height } = page.getSize();

                // Always process splits in top-to-bottom order
                const splits = (splitPoints[pageNum + 1] || [])
                    .filter(s => s.orientation === 'horizontal')
                    .map(s => s.position)
                    .sort((a, b) => a - b);
                const boundaries = [0, ...splits, 1];
                for (let i = 0; i < boundaries.length - 1; i++) {
                    const yStart = height * (1 - boundaries[i]);
                    const yEnd = height * (1 - boundaries[i + 1]);
                    if (yStart <= yEnd) continue;
                    const cropHeight = yStart - yEnd;

                    // Create a temporary document to prepare the page slice
                    const tempDoc = await PDFDocument.create();
                    const [copiedPage] = await tempDoc.copyPages(origPdf, [pageNum]);

                    // Resize the page to the slice dimensions and move content to fit
                    copiedPage.setMediaBox(0, 0, width, cropHeight);
                    copiedPage.translateContent(0, -yEnd);
                    tempDoc.addPage(copiedPage);

                    // Embed the page slice from the temporary document
                    const [embeddedSlice] = await mergedPdf.embedPdf(await tempDoc.save());

                    // Add a new A4 page and draw the slice at the top
                    const a4Page = mergedPdf.addPage(PageSizes.A4);
                    const { height: a4Height } = a4Page.getSize();
                    a4Page.drawPage(embeddedSlice, {
                        x: 0,
                        y: a4Height - embeddedSlice.height,
                        width: embeddedSlice.width,
                        height: embeddedSlice.height,
                    });
                }
            }
            const mergedBytes = await mergedPdf.save();
            const url = URL.createObjectURL(new Blob([mergedBytes], { type: 'application/pdf' }));
            setMergedUrl(url);

        } catch (e) {
            setError(`Failed to export merged PDF: ${e instanceof Error ? e.message : String(e)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 p-4 border border-white/10 rounded-lg bg-white/10 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Export Split PDFs</h3>
            <Button disabled={!pdfData || loading} onClick={handleExport}  className="inline-flex items-center gap-2 rounded-sm bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-white/30 data-open:bg-gray-700 border border-white/20 cursor-pointer">
                {loading ? 'Exporting...' : 'Export Merged PDF'}
            </Button>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {mergedUrl && (
                <div className="mt-4">
                    <h4 className="font-medium mb-2">Download Merged PDF:</h4>
                    <a
                        href={mergedUrl}
                        download="merged.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        merged.pdf
                    </a>
                </div>
            )}
        </div>
    );
};

export default ExportPanel; 