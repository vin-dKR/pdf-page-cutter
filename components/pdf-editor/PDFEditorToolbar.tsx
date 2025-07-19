import React, { useRef } from 'react';
import { usePDFEditorStore } from '@/store-hooks/pdfEditorStore';
import { v4 as uuidv4 } from 'uuid';

const PDFEditorToolbar = ({ zoom, setZoom }: { zoom: number; setZoom: (z: number) => void }) => {
    const addElement = usePDFEditorStore(state => state.addElement);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 2));
    const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.2));

    const handleAddText = () => {
        addElement({
            id: uuidv4(),
            type: 'text',
            page: 1,
            x: 100,
            y: 100,
            w: 150,
            h: 40,
            text: 'New Text',
            fontSize: 20,
            color: '#222',
            fontFamily: 'Arial',
            bold: false,
            italic: false,
        });
    };

    const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            addElement({
                id: uuidv4(),
                type: 'image',
                page: 1,
                x: 100,
                y: 200,
                w: 120,
                h: 120,
                imageDataUrl: ev.target?.result as string,
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex items-center gap-3 mb-4 p-2 bg-white/10 rounded-lg border border-white/20">
            <button onClick={handleZoomOut} className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-800">-</button>
            <span className="text-white text-sm">Zoom: {(zoom * 100).toFixed(0)}%</span>
            <button onClick={handleZoomIn} className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-800">+</button>
            <div className="w-px h-6 bg-white/20 mx-2" />
            <button onClick={handleAddText} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Add Text</button>
            <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Add Image</button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAddImage}
            />
        </div>
    );
};

export default PDFEditorToolbar; 