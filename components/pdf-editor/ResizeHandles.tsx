import React, { useState, useEffect } from 'react';
import { type PDFElement } from '@/store-hooks/pdfEditorStore';

interface ResizeHandlesProps {
  el: PDFElement;
  zoom: number;
  updateElement: (id: string, updates: Partial<PDFElement>) => void;
  minWidth?: number;
  minHeight?: number;
}

const handleSize = 12;
const handles = [
  { key: 'nw', style: { left: -handleSize/2, top: -handleSize/2, cursor: 'nwse-resize' } },
  { key: 'ne', style: { right: -handleSize/2, top: -handleSize/2, cursor: 'nesw-resize' } },
  { key: 'sw', style: { left: -handleSize/2, bottom: -handleSize/2, cursor: 'nesw-resize' } },
  { key: 'se', style: { right: -handleSize/2, bottom: -handleSize/2, cursor: 'nwse-resize' } },
];

type ResizingState = {
  corner: string;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
  startX0: number;
  startY0: number;
  originalFontSize?: number;
  originalH?: number;
};

const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  el, zoom, updateElement, minWidth = 20, minHeight = 20
}) => {
  const [resizing, setResizing] = useState<null | ResizingState>(null);

  // Unified event handlers for mouse and touch
  const startResize = (corner: string, clientX: number, clientY: number) => {
    setResizing({
      corner,
      startX: clientX,
      startY: clientY,
      startW: el.w,
      startH: el.h,
      startX0: el.x,
      startY0: el.y,
      originalFontSize: (el as any).fontSize || 16,
      originalH: el.h,
    });
  };

  const handleMouseDown = (corner: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    startResize(corner, e.clientX, e.clientY);
  };

  const handleTouchStart = (corner: string, e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const touch = e.touches[0];
    startResize(corner, touch.clientX, touch.clientY);
  };

  useEffect(() => {
    if (!resizing) return;

    const move = (clientX: number, clientY: number) => {
      const dx = (clientX - resizing.startX) / zoom;
      const dy = (clientY - resizing.startY) / zoom;
      let newW = resizing.startW, newH = resizing.startH, newX = resizing.startX0, newY = resizing.startY0;

      if (resizing.corner === 'se') {
        newW = Math.max(minWidth, resizing.startW + dx);
        newH = Math.max(minHeight, resizing.startH + dy);
      } else if (resizing.corner === 'nw') {
        newW = Math.max(minWidth, resizing.startW - dx);
        newH = Math.max(minHeight, resizing.startH - dy);
        newX = resizing.startX0 + dx;
        newY = resizing.startY0 + dy;
      } else if (resizing.corner === 'ne') {
        newW = Math.max(minWidth, resizing.startW + dx);
        newH = Math.max(minHeight, resizing.startH - dy);
        newY = resizing.startY0 + dy;
      } else if (resizing.corner === 'sw') {
        newW = Math.max(minWidth, resizing.startW - dx);
        newH = Math.max(minHeight, resizing.startH + dy);
        newX = resizing.startX0 + dx;
      }

      let updates: Partial<PDFElement> = { w: newW, h: newH, x: newX, y: newY };
      if (el.type === 'text' && resizing.originalH && resizing.originalFontSize && resizing.originalH > 0) {
        const newFontSize = Math.max(8, (newH / resizing.originalH) * resizing.originalFontSize);
        (updates as any).fontSize = newFontSize;
      }
      updateElement(el.id, updates);
    };

    const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        move(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const stop = () => setResizing(null);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', stop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stop);
    };
  }, [resizing, zoom, updateElement, el.id, minWidth, minHeight, el.type]);

  return (
    <>
      {handles.map(h => (
        <div
          key={h.key}
          style={{
            position: 'absolute',
            width: handleSize,
            height: handleSize,
            background: '#fff',
            border: '2px solid #2563eb',
            borderRadius: '50%',
            ...h.style,
            zIndex: 30,
            touchAction: 'none',
          }}
          onMouseDown={e => handleMouseDown(h.key, e)}
          onTouchStart={e => handleTouchStart(h.key, e)}
        />
      ))}
    </>
  );
};

export default ResizeHandles; 