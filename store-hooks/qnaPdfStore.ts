import { create } from "zustand"

interface QnADataState {
    name: string
    setName: (name: string) => void
    pdfData: ArrayBuffer | null;
    selectedPages: Set<number>;
    setPdfData: (data: ArrayBuffer | null) => void;
    togglePageSelection: (pageNumber: number) => void;
    clearSelections: () => void;
    reset: () => void;
}

const initialState = {
    name: "",
    pdfData: null,
    selectedPages: new Set<number>(),
}

export const useQnADataStore = create<QnADataState>((set) => ({
    ...initialState,
    setName: (data) => set({ name: data }),
    setPdfData: (data) => set({ pdfData: data, selectedPages: new Set<number>() }),
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
