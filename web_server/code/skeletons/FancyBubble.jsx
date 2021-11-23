module.exports = ({ color1, color2, children, ...props }) => {
    // main content
    const bubbleInnerPart = <div
        name="bubble-inner-part"
        style={`
            width: 100%;
            aspect-ratio: 1;
            border-radius: 200vw;
        `}
        >
            {children}
    </div>
    
    // wrapper #1
    const unRotatePart = <div
        name="bubble-un-rotate-part"
        class="rotateCounterClockwise centered"
        >
        {bubbleInnerPart}
    </div>
    
    // wapper #2
    const animatedColorGradientPart = <div
        name="bubble-animated-background-part"
        class="animatedGradientBackground centered"
        style={`
            min-width: 101%;
            aspect-ratio: 1;
            --color1: ${color1};
            --color2: ${color2};
            border-radius: 200vw;
        `}
        >
        {unRotatePart}
    </div>
    
    // wrapper #3
    const rotatingCircle = <div
        name="bubble-outer-part"
        class="rotateClockwise centered"
        style={`
            min-width: 101%;
            aspect-ratio: 1;
            border-radius: 200vw;
        `}
        {...props}
        >
            {animatedColorGradientPart}
    </div>
    
    // wrapper #4
    const circleWithShadow = <div
        name="bubble-outer-part"
        class="shadow-2 centered"
        style={`
            max-width: 99%;
            width: 99%;
            transition: all 0.2s ease-in-out 0s;
            aspect-ratio: 1;
            border-radius: 200vw;
        `}
        {...props}
        >
            {rotatingCircle}
    </div>
    
    return circleWithShadow
}