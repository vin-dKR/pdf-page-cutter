const Noise = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <svg viewBox="0 0 1000 700" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60">
                <g filter="url(#filter0_fn_50_35)">
                    <rect x="-180" width="1500" height="800" fill="white" fillOpacity="0.2" />
                </g>
                <defs>
                    <filter id="filter0_fn_50_35" x="-626" y="-500" width="2792" height="2098" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur_50_35" />
                        <feTurbulence type="fractalNoise" baseFrequency="1 1" stitchTiles="stitch" numOctaves="3" result="noise" seed="6062" />
                        <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
                        <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                            <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 " />
                        </feComponentTransfer>
                        <feComposite operator="in" in2="effect1_foregroundBlur_50_35" in="coloredNoise1" result="noise1Clipped" />
                        <feFlood floodColor="rgba(255, 255, 255, 0.3)" result="color1Flood" />
                        <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
                        <feMerge result="effect2_noise_50_35">
                            <feMergeNode in="effect1_foregroundBlur_50_35" />
                            <feMergeNode in="color1" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>
        </div>
    )
}

export default Noise