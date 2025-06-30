import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { type SplitPoint } from './PDFPage';
import { useSplitPointsStore } from '@/store-hooks/splitPointsStore';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

interface SplitPreviewProps {
    pdfData: ArrayBuffer | null;
}

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const COLORS = ['#ffb3ba80', '#baffc980', '#bae1ff80', '#ffffba80', '#ffdfba80', '#baffba80'];

const SplitPreview: React.FC<SplitPreviewProps> = ({ pdfData }) => {
    const splitPoints = useSplitPointsStore(state => state.splitPoints);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageDims, setPageDims] = useState<{ [page: number]: { width: number; height: number } }>({});

    if (!pdfData || pdfData.byteLength === 0) {
        return null;
    }

    // Helper to get split segments (returns array of {start, end, orientation})
    function getSegments(splits: SplitPoint[], orientation: 'horizontal' | 'vertical') {
        const points = splits
            .filter(s => s.orientation === orientation)
            .map(s => s.position)
            .sort((a, b) => a - b);
        const segments = [];
        let last = 0;
        for (const p of points) {
            segments.push({ start: last, end: p });
            last = p;
        }
        segments.push({ start: last, end: 1 });
        return segments;
    }

    return (
        <div style={{ margin: '32px 0' }}>
            <h3>Split Preview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, alignItems: 'center' }}>
                <Document
                    file={pdfData ? new Blob([pdfData], { type: 'application/pdf' }) : undefined}
                    onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}
                    loading={<div>Loading preview...</div>}
                >
                    {Array.from({ length: numPages }, (_, i) => {
                        const pageNum = i + 1;
                        const splits = splitPoints[pageNum] || [];
                        const hSegments = getSegments(splits, 'horizontal');
                        // For now, only show horizontal splits visually
                        return (
                            <div key={pageNum} style={{ position: 'relative', width: 600, marginBottom: 16 }}>
                                <Page
                                    pageNumber={pageNum}
                                    width={600}
                                    onLoadSuccess={({ width, height }: { width: number; height: number }) => {
                                        setPageDims(dims => ({ ...dims, [pageNum]: { width, height } }));
                                    }}
                                />
                                {/* Overlay colored boxes for each segment */}
                                {pageDims[pageNum] && hSegments.map((seg, idx) => {
                                    const top = seg.start * pageDims[pageNum].height;
                                    const height = (seg.end - seg.start) * pageDims[pageNum].height;
                                    return (
                                        <div
                                            key={idx}
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top,
                                                width: '100%',
                                                height,
                                                background: COLORS[idx % COLORS.length],
                                                pointerEvents: 'none',
                                                border: '1px solid #8882',
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </Document>
            </div>
        </div>
    );
};

export default SplitPreview; 