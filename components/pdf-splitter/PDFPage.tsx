import React, { useRef, useState, useCallback } from 'react';
import { useSplitPointsStore, SplitPoint } from '@/store-hooks/splitPointsStore';

export type { SplitPoint };

interface PDFPageProps {
    pageNumber: number;
}

const PDFPage: React.FC<PDFPageProps> = ({ pageNumber }) => {
    console.log("PDF PAGE: ------- re-render ")
    const splitPoints = useSplitPointsStore(state => state.splitPoints);
    const addSplit = useSplitPointsStore(state => state.addSplit);
    const moveSplit = useSplitPointsStore(state => state.moveSplit);
    const removeSplit = useSplitPointsStore(state => state.removeSplit);
    const pageSplits = splitPoints[pageNumber] || [];
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState<{
        splitId: string;
        orientation: 'horizontal' | 'vertical';
    } | null>(null);

    const handleAddSplit = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || e.target !== containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        if (e.button === 2) {
            addSplit(pageNumber, x, 'vertical');
        } else {
            addSplit(pageNumber, y, 'horizontal');
        }
    }, [addSplit, pageNumber]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    const handleMouseDown = (split: SplitPoint, e: React.MouseEvent) => {
        e.stopPropagation();
        setDragging({ splitId: split.id, orientation: split.orientation });
    };

    React.useEffect(() => {
        if (!dragging) return;
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            let newPosition = 0;
            if (dragging.orientation === 'horizontal') {
                newPosition = (e.clientY - rect.top) / rect.height;
            } else {
                newPosition = (e.clientX - rect.left) / rect.width;
            }
            moveSplit(dragging.splitId, Math.max(0, Math.min(1, newPosition)));
        };
        const handleMouseUp = () => setDragging(null);
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, moveSplit]);

    return (
        <div
            ref={containerRef}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'crosshair', zIndex: 10 }}
            onClick={handleAddSplit}
            onContextMenu={handleContextMenu}
        >
            {pageSplits.map(split => (
                <div
                    key={split.id}
                    style={{
                        position: 'absolute',
                        left: split.orientation === 'vertical' ? `${split.position * 100}%` : 0,
                        top: split.orientation === 'horizontal' ? `${split.position * 100}%` : 0,
                        width: split.orientation === 'vertical' ? 2 : '100%',
                        height: split.orientation === 'horizontal' ? 2 : '100%',
                        background: split.orientation === 'horizontal' ? 'red' : 'blue',
                        cursor: split.orientation === 'horizontal' ? 'row-resize' : 'col-resize',
                        transform: split.orientation === 'vertical' ? 'translateX(-1px)' : 'translateY(-1px)',
                    }}
                    onMouseDown={e => handleMouseDown(split, e)}
                >
                    <span
                        className='text-red-500'
                        style={{
                            position: 'absolute',
                            top: -8,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'white',
                            border: '1px solid black',
                            borderRadius: '50%',
                            width: 16,
                            height: 16,
                            cursor: 'pointer',
                            textAlign: 'center',
                            lineHeight: '14px',
                            fontSize: 18
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            removeSplit(split.id);
                        }}
                    >
                        ×
                    </span>
                </div>
            ))}
        </div>
    );
};

export default PDFPage; 