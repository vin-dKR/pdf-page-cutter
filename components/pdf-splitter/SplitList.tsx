import React from 'react';
import { useSplitPointsStore, SplitPoint } from '@/store-hooks/splitPointsStore';

const SplitList: React.FC = () => {
    const splitPoints = useSplitPointsStore(state => state.splitPoints);
    const removeSplit = useSplitPointsStore(state => state.removeSplit);

    const allSplits = Object.entries(splitPoints).flatMap(([page, splits]) =>
        (splits as SplitPoint[]).map(split => ({ ...split, page }))
    );

    console.log('SplitList rendered', { state: { splitPoints } });

    return (
        <div className="relative border border-white/10 rounded-lg bg-white/10 p-6 shadow-sm overflow-hidden">
            {/* Spiral Blur Background */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
                <svg width="340" height="340" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="blur-2xl opacity-40">
                    <defs>
                        <radialGradient id="spiralWhite" cx="50%" cy="50%" r="50%" fx="50%" fy="50%" gradientTransform="rotate(45)">
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <circle cx="170" cy="170" r="160" fill="url(#spiralWhite)" />
                    <path d="M170 170 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" stroke="#fff" strokeWidth="8" fill="none" opacity="0.2" />
                    <path d="M170 170 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" stroke="#fff" strokeWidth="4" fill="none" opacity="0.2" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold mb-1">Split Points</h3>
            <div className='w-full border-white/50 border-t mb-3' />
            {allSplits.length === 0 && (
                <div className="text-muted-foreground text-sm">No splits added.</div>
            )}
            <div className="space-y-4">
                {Object.entries(splitPoints).map(([page, splits]) => (
                    (splits as SplitPoint[]).length > 0 && (
                        <div key={page} className="mb-2">
                            <div className="font-medium text-base mb-1">Page {page}:</div>
                            <ul className="ml-4 space-y-2">
                                {(splits as SplitPoint[]).map((split) => (
                                    <li key={split.id} className="flex items-center justify-center gap-2 group">
                                        <span className="flex-1 text-sm">
                                            {split.orientation === 'horizontal' ? 'Horizontal' : 'Vertical'} split at {(split.position * 100).toFixed(1)}%
                                        </span>
                                        <button
                                            className="relative h-5 w-5 rounded-sm bg-white/30 text-white hover:bg-red-500 hover:text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
                                            onClick={() => removeSplit(split.id)}
                                            title="Remove split"
                                        >
                                            <div className='absolute -top-[2px] left-[5px]'>
                                            ×
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default SplitList; 