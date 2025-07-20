import React, { useRef, useState, useEffect, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import ResizeHandles from './ResizeHandles';
import { type PDFElement } from '@/store-hooks/pdfEditorStore';

interface TextOverlayProps {
  el: PDFElement;
  zoom: number;
  selectedElementId: string | null;
  editingElementId: string | null;
  setEditingElementId: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<PDFElement>) => void;
  onMouseDown: (e: React.MouseEvent, el: PDFElement) => void;
}

const TextOverlay: React.FC<TextOverlayProps> = ({
  el,
  zoom,
  selectedElementId,
  editingElementId,
  setEditingElementId,
  updateElement,
  onMouseDown,
}) => {
  const isText = el.type === 'text';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textValue = isText ? (el as any).text || '' : '';
  const [text, setText] = useState(textValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingElementId === el.id && textareaRef.current) {
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [editingElementId, el.id]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setText(isText ? (el as any).text || '' : '');
  }, [isText, el]);

  const handleDoubleClick = useCallback(() => {
    if (isText) setEditingElementId(el.id);
  }, [isText, el.id, setEditingElementId]);

  const handleBlur = useCallback(() => {
    if (isText && text !== textValue) {
      updateElement(el.id, { text });
    }
    setEditingElementId(null);
  }, [isText, el.id, text, textValue, updateElement, setEditingElementId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  }, [handleBlur]);

  // Resize logic is handled by ResizeHandles

  if (isText && editingElementId === el.id) {
    return (
      <div
        className={`absolute ${selectedElementId === el.id ? 'ring-2 ring-blue-900' : ''}`}
        style={{
          left: el.x * zoom,
          top: el.y * zoom,
          width: el.w * zoom,
          height: el.h * zoom,
          zIndex: 15,
          userSelect: 'text',
          pointerEvents: 'auto',
        }}
      >
        <TextareaAutosize
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setEditingElementId(null);
            } else {
              handleKeyDown(e);
            }
          }}
          autoFocus
          rows={1}
          className="w-full h-full resize-none bg-transparent border-none outline-none p-0 m-0 focus:ring-0 focus:outline-none text-inherit font-inherit leading-inherit"
          style={{
            fontSize: (el as any).fontSize * zoom,
            color: (el as any).color,
            fontFamily: (el as any).fontFamily,
            fontWeight: (el as any).bold ? 'bold' : 'normal',
            fontStyle: (el as any).italic ? 'italic' : 'normal',
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            padding: 0,
            margin: 0,
            lineHeight: 'inherit',
            textAlign: (el as any).align || 'left',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`absolute cursor-move select-none pointer-events-auto ${selectedElementId === el.id ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: el.x * zoom,
        top: el.y * zoom,
        width: el.w * zoom,
        height: el.h * zoom,
        zIndex: 15,
        userSelect: 'none',
      }}
      onMouseDown={e => onMouseDown(e, el)}
      onDoubleClick={handleDoubleClick}
    >
      {el.type === 'text' && (
        <span
          style={{
            fontSize: (el as any).fontSize * zoom,
            color: (el as any).color,
            fontFamily: (el as any).fontFamily,
            fontWeight: (el as any).bold ? 'bold' : 'normal',
            fontStyle: (el as any).italic ? 'italic' : 'normal',
            pointerEvents: 'none',
          }}
        >
          {(el as any).text}
        </span>
      )}
      {/* Render resize handles if selected and not editing */}
      {isText && selectedElementId === el.id && !editingElementId && (
        <ResizeHandles
          el={el}
          zoom={zoom}
          updateElement={updateElement}
        />
      )}
    </div>
  );
};

export default TextOverlay; 