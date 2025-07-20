import React, { useRef, useState, useEffect, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import ResizeHandles from './ResizeHandles';
import { type PDFElement, type TextElement } from '@/store-hooks/pdfEditorStore';

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
  const textValue = isText ? (el as TextElement).text : '';
  const [text, setText] = useState(textValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingElementId === el.id && textareaRef.current) {
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [editingElementId, el.id]);

  useEffect(() => {
    setText(isText ? (el as TextElement).text : '');
  }, [isText, el]);

  const handleDoubleClick = useCallback(() => {
    if (isText) setEditingElementId(el.id);
  }, [isText, el.id, setEditingElementId]);

  const handleBlur = useCallback(() => {
    if (isText && text !== textValue) {
      updateElement(el.id, { text } as Partial<TextElement>);
    }
    setEditingElementId(null);
  }, [isText, el.id, text, textValue, updateElement, setEditingElementId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  }, [handleBlur]);

  if (isText && editingElementId === el.id) {
    const textEl = el as TextElement;
    return (
      <div
        className={`absolute ${selectedElementId === el.id ? 'ring-2 ring-blue-900' : ''}`}
        style={{
          left: textEl.x * zoom,
          top: textEl.y * zoom,
          width: textEl.w * zoom,
          height: textEl.h * zoom,
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
            fontSize: textEl.fontSize * zoom,
            color: textEl.color,
            fontFamily: textEl.fontFamily,
            fontWeight: textEl.bold ? 'bold' : 'normal',
            fontStyle: textEl.italic ? 'italic' : 'normal',
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            padding: 0,
            margin: 0,
            lineHeight: 'inherit',
            textAlign: 'left',
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
      {isText && (
        <span
          style={{
            fontSize: (el as TextElement).fontSize * zoom,
            color: (el as TextElement).color,
            fontFamily: (el as TextElement).fontFamily,
            fontWeight: (el as TextElement).bold ? 'bold' : 'normal',
            fontStyle: (el as TextElement).italic ? 'italic' : 'normal',
            pointerEvents: 'none',
          }}
        >
          {(el as TextElement).text}
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