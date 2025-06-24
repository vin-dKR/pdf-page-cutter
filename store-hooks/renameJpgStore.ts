import { create } from 'zustand';

interface RenameJpgState {
  images: File[];
  setImages: (images: File[]) => void;
  resetImages: () => void;
}

export const useRenameJpgStore = create<RenameJpgState>((set) => ({
  images: [],
  setImages: (images) => set({ images }),
  resetImages: () => set({ images: [] }),
})); 