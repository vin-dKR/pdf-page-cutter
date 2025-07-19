import { create } from 'zustand';

export type PDFElementType = 'text' | 'shape' | 'image';

export interface PDFElementBase {
  id: string;
  type: PDFElementType;
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number;
}

export interface TextElement extends PDFElementBase {
  type: 'text';
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  bold?: boolean;
  italic?: boolean;
}

export interface ShapeElement extends PDFElementBase {
  type: 'shape';
  shape: 'rect' | 'ellipse' | 'line';
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface ImageElement extends PDFElementBase {
  type: 'image';
  imageDataUrl: string;
}

export type PDFElement = TextElement | ShapeElement | ImageElement;

interface PDFEditorState {
  pdfData: ArrayBuffer | null;
  setPdfData: (data: ArrayBuffer | null) => void;
  elements: PDFElement[];
  addElement: (el: PDFElement) => void;
  updateElement: (id: string, el: Partial<PDFElement>) => void;
  removeElement: (id: string) => void;
  clearElements: () => void;
  selectedElementId: string | null;
  selectElement: (id: string | null) => void;
  moveElementLayer: (id: string, direction: 'up' | 'down') => void;
}

export const usePDFEditorStore = create<PDFEditorState>((set) => ({
  pdfData: null,
  setPdfData: (data) => set({ pdfData: data }),
  elements: [],
  addElement: (el) => set((state) => ({ elements: [...state.elements, el] })),
  updateElement: (id, el) => set((state) => ({
    elements: state.elements.map(e =>
      e.id === id
        ? { ...e, ...el, type: e.type } as PDFElement // preserve type, ensure result is PDFElement
        : e
    ) as PDFElement[]
  })),
  removeElement: (id) => set((state) => ({ elements: state.elements.filter(e => e.id !== id) })),
  clearElements: () => set({ elements: [] }),
  selectedElementId: null,
  selectElement: (id) => set({ selectedElementId: id }),
  moveElementLayer: (id, direction) => set((state) => {
    const idx = state.elements.findIndex(e => e.id === id);
    if (idx === -1) return {};
    let elements = [...state.elements];
    if (direction === 'up' && idx < elements.length - 1) {
      [elements[idx], elements[idx + 1]] = [elements[idx + 1], elements[idx]];
    } else if (direction === 'down' && idx > 0) {
      [elements[idx], elements[idx - 1]] = [elements[idx - 1], elements[idx]];
    } else {
      return {};
    }
    // Filter to ensure only valid PDFElement objects
    elements = elements.filter(e => e && typeof e.id === 'string' && typeof e.type === 'string') as PDFElement[];
    return { elements };
  }),
})); 