import { create } from 'zustand';

export type SplitPoint = {
    id: string;
    position: number; // 0-1 (percentage of height for horizontal, width for vertical)
    orientation: 'horizontal' | 'vertical';
};

export interface SplitPointsState {
    splitPoints: Record<number, SplitPoint[]>;
    addSplit: (pageNumber: number, position: number, orientation: 'horizontal' | 'vertical') => void;
    moveSplit: (splitId: string, newPosition: number) => void;
    removeSplit: (splitId: string) => void;
}

function uuid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const useSplitPointsStore = create<SplitPointsState>((set) => ({
    splitPoints: {},
    addSplit: (pageNumber, position, orientation) => set((state) => ({
        splitPoints: {
            ...state.splitPoints,
            [pageNumber]: [
                ...(state.splitPoints[pageNumber] || []),
                { id: uuid(), position, orientation },
            ],
        },
    })),
    moveSplit: (splitId, newPosition) => set((state) => {
        const updated: Record<number, SplitPoint[]> = {};
        for (const [page, splits] of Object.entries(state.splitPoints)) {
            updated[Number(page)] = splits.map(s =>
                s.id === splitId ? { ...s, position: newPosition } : s
            );
        }
        return { splitPoints: updated };
    }),
    removeSplit: (splitId) => set((state) => {
        const updated: Record<number, SplitPoint[]> = {};
        for (const [page, splits] of Object.entries(state.splitPoints)) {
            updated[Number(page)] = splits.filter(s => s.id !== splitId);
        }
        return { splitPoints: updated };
    }),
})); 