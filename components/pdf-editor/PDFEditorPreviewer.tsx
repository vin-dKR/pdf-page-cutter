'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { usePDFEditorStore, type PDFElement, type ShapeElement, type ImageElement } from '@/store-hooks/pdfEditorStore';
import PDFEditorToolbar from './PDFEditorToolbar';
import { Document, Page, pdfjs } from 'react-pdf';
import TextOverlay from './TextOverlay';
import Image from 'next/image';

if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

// Completely isolated PDF component that never re-renders
const StablePDFRenderer = React.memo(({ 
    pdfData, 
    onLoadSuccess, 
    onLoadError 
}: { 
    pdfData: Uint8Array | undefined; 
    onLoadSuccess: (data: { numPages: number }) => void; 
    onLoadError: (error: Error) => void; 
}) => {
    const [numPages, setNumPages] = useState(0);

    const [pageWidth] = useState(600);

    const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        onLoadSuccess({ numPages });
    }, [onLoadSuccess]);

    const handleDocumentLoadError = useCallback((error: Error) => {
        console.error('PDF load error:', error);
        onLoadError(error);
    }, [onLoadError]);

    return (
        <Document
            file={pdfData ? new File([pdfData], 'document.pdf', { type: 'application/pdf' }) : undefined}
            onLoadSuccess={handleDocumentLoadSuccess}
            onLoadError={handleDocumentLoadError}
            loading={<div className="text-center p-4">Loading PDF...</div>}
            error={<div className="text-center p-4 text-red-600">Error loading PDF</div>}
        >
            {Array.from({ length: numPages }, (_, i) => (
                <div key={`stable-page-${i}`} className="relative mb-8" style={{ width: pageWidth, height: 700 }}>
                    <div className="relative">
                        <Page
                            pageNumber={i + 1}
                            width={pageWidth}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            loading={<div className="text-center p-2">Loading page {i + 1}...</div>}
                            error={<div className="text-center p-2 text-red-600">Error loading page {i + 1}</div>}
                        />
                    </div>
                </div>
            ))}
        </Document>
    );
}, () => true); // Never re-render this component
StablePDFRenderer.displayName = 'StablePDFRenderer';

const PDFEditorPreviewer = () => {
    const pdfData = usePDFEditorStore(state => state.pdfData);
    const elements = usePDFEditorStore(state => state.elements);
    const selectedElementId = usePDFEditorStore(state => state.selectedElementId);
    const selectElement = usePDFEditorStore(state => state.selectElement);
    const updateElement = usePDFEditorStore(state => state.updateElement);
    const [numPages, setNumPages] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    // Text editing state
    const [editingElementId, setEditingElementId] = useState<string | null>(null);

    const pageWidth = 600 * zoom;
    const pageHeight = 700 * zoom;

    // Reset error when PDF data changes
    useEffect(() => {
        setPdfError(null);
    }, [pdfData]);

    // Stable drag handlers
    const handleMouseDown = useCallback((e: React.MouseEvent, el: PDFElement) => {
        e.stopPropagation();
        e.preventDefault();
        selectElement(el.id);
        setDraggingId(el.id);
        const rect = containerRef.current?.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - (rect?.left || 0) - el.x * zoom,
            y: e.clientY - (rect?.top || 0) - el.y * zoom,
        });
    }, [selectElement, zoom]);
    
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!draggingId) return;
        e.stopPropagation();
        e.preventDefault();
        const rect = containerRef.current?.getBoundingClientRect();
        const x = (e.clientX - (rect?.left || 0) - dragOffset.x) / zoom;
        const y = (e.clientY - (rect?.top || 0) - dragOffset.y) / zoom;
        updateElement(draggingId, { x, y });
    }, [draggingId, dragOffset, zoom, updateElement]);
    
    const handleMouseUp = useCallback(() => {
        setDraggingId(null);
    }, []);

    const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPdfError(null);
    }, []);

    const handleDocumentLoadError = useCallback((error: Error) => {
        console.error('PDF load error:', error);
        setPdfError('Failed to load PDF. Please try again.');
    }, []);

    // Memoize overlay pages to prevent re-renders
    const overlayPages = useMemo(() => {
        return Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="relative mb-8" style={{ width: pageWidth, height: pageHeight }}>
                <div className="relative">
                    {/* Overlay container - positioned above PDF */}
                    <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{ zIndex: 10 }}
                    >
                        {/* Render overlays for this page */}
                        {elements.filter(el => el.page === i + 1).map(el => (
                            el.type === 'text' ? (
                                <TextOverlay
                                    key={el.id}
                                    el={el}
                                    zoom={zoom}
                                    selectedElementId={selectedElementId}
                                    editingElementId={editingElementId}
                                    setEditingElementId={setEditingElementId}
                                    updateElement={updateElement}
                                    onMouseDown={handleMouseDown}
                                />
                            ) : el.type === 'shape' ? (
                                <div
                                    key={el.id}
                                    className={`absolute cursor-move select-none pointer-events-auto ${selectedElementId === el.id ? 'ring-2 ring-blue-500' : ''}`}
                                    style={{
                                        left: el.x * zoom,
                                        top: el.y * zoom,
                                        width: el.w * zoom,
                                        height: el.h * zoom,
                                        zIndex: 15,
                                        userSelect: 'none',
                                    }}
                                    onMouseDown={e => handleMouseDown(e, el)}
                                >
                                    <svg width={(el as ShapeElement).w * zoom} height={(el as ShapeElement).h * zoom} style={{ pointerEvents: 'none' }}>
                                        {(el as ShapeElement).shape === 'rect' && (
                                            <rect width={(el as ShapeElement).w * zoom} height={(el as ShapeElement).h * zoom} fill={(el as ShapeElement).fill} stroke={(el as ShapeElement).stroke} strokeWidth={(el as ShapeElement).strokeWidth} />
                                        )}
                                        {(el as ShapeElement).shape === 'ellipse' && (
                                            <ellipse cx={((el as ShapeElement).w * zoom) / 2} cy={((el as ShapeElement).h * zoom) / 2} rx={((el as ShapeElement).w * zoom) / 2} ry={((el as ShapeElement).h * zoom) / 2} fill={(el as ShapeElement).fill} stroke={(el as ShapeElement).stroke} strokeWidth={(el as ShapeElement).strokeWidth} />
                                        )}
                                        {(el as ShapeElement).shape === 'line' && (
                                            <line x1={0} y1={((el as ShapeElement).h * zoom) / 2} x2={(el as ShapeElement).w * zoom} y2={((el as ShapeElement).h * zoom) / 2} stroke={(el as ShapeElement).stroke} strokeWidth={(el as ShapeElement).strokeWidth} />
                                        )}
                                    </svg>
                                </div>
                            ) : el.type === 'image' ? (
                                <div
                                    key={el.id}
                                    className={`absolute cursor-move select-none pointer-events-auto ${selectedElementId === el.id ? 'ring-2 ring-blue-500' : ''}`}
                                    style={{
                                        left: el.x * zoom,
                                        top: el.y * zoom,
                                        width: el.w * zoom,
                                        height: el.h * zoom,
                                        zIndex: 15,
                                        userSelect: 'none',
                                    }}
                                    onMouseDown={e => handleMouseDown(e, el)}
                                >
                                    <Image
                                        src={(el as ImageElement).imageDataUrl}
                                        alt="overlay"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
                                    />
                                </div>
                            ) : null
                        ))}
                    </div>
                </div>
            </div>
        ));
    }, [numPages, pageWidth, pageHeight, elements, zoom, selectedElementId, handleMouseDown, editingElementId, setEditingElementId, updateElement]);

    if (!pdfData) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg text-gray-400">
                Upload a PDF to start editing.
            </div>
        );
    }

    if (pdfError) {
        return (
            <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg text-red-600">
                {pdfError}
            </div>
        );
    }

    return (
        <div>
            <PDFEditorToolbar zoom={zoom} setZoom={setZoom} />
            <div
                ref={containerRef}
                className="relative mx-auto bg-gray-200 rounded-lg shadow-lg overflow-y-auto"
                style={{ maxHeight: 700 * zoom, width: pageWidth }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* PDF Layer - Completely isolated and never re-renders */}
                <div className="relative">
                    <StablePDFRenderer
                        pdfData={pdfData? new Uint8Array(pdfData) : undefined}
                        onLoadSuccess={handleDocumentLoadSuccess}
                        onLoadError={handleDocumentLoadError}
                    />
                </div>
                
                {/* Overlay Layer - Completely separate from PDF */}
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
                    {overlayPages}
                </div>
            </div>
        </div>
    );
};

export default PDFEditorPreviewer; 