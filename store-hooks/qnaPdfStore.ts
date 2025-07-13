import { create } from "zustand"

interface QnADataState {
    name: string
    fileName: string
    setName: (name: string) => void
    setFileName: (fileName: string) => void
    pdfData: ArrayBuffer | null;
    selectedPages: Set<number>;
    setPdfData: (data: ArrayBuffer | null, fileName?: string) => void;
    togglePageSelection: (pageNumber: number) => void;
    clearSelections: () => void;
    reset: () => void;
}

const initialState = {
    name: "",
    fileName: "",
    pdfData: null,
    selectedPages: new Set<number>(),
}

export const useQnADataStore = create<QnADataState>((set) => ({
    ...initialState,
    setName: (data) => set({ name: data }),
    setFileName: (fileName) => set({ fileName }),
    setPdfData: (data, fileName = "") => set({ 
        pdfData: data, 
        selectedPages: new Set<number>(),
        fileName: fileName
    }),
    togglePageSelection: (pageNumber: number) => set((state) => {
        const newSelectedPages = new Set(state.selectedPages);
        if (newSelectedPages.has(pageNumber)) {
            newSelectedPages.delete(pageNumber);
        } else {
            newSelectedPages.add(pageNumber);
        }
        return { selectedPages: newSelectedPages };
    }),
    clearSelections: () => set({ selectedPages: new Set<number>() }),
    reset: () => set(initialState),
}))
