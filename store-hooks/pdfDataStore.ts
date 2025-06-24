import { create } from 'zustand';

interface PDFDataState {
  pdfData: ArrayBuffer | null;
  setPdfData: (data: ArrayBuffer | null) => void;
}

export const usePDFDataStore = create<PDFDataState>((set) => ({
  pdfData: null,
  setPdfData: (data) => set({ pdfData: data }),
})); 