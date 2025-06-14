import React from 'react'

const DartboardSVG = ({
  center,
  radii,
  generateSegments,
  generateNumbers,
  handleDartThrow,
  BullseyeGlowWrapper,
  highlightedSegments = [],
}) => (
  <div className="dartboard-component">
    <div className="dartboard-glow"></div>
    <div className="dartboard-svg-container">
      <svg className="dartboard-svg" viewBox="0 0 500 500">
        <defs>
          <radialGradient id="gradient-a" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#f4e7a8' }} />
            <stop offset="100%" style={{ stopColor: '#d4bc3c' }} />
          </radialGradient>
          <radialGradient id="gradient-b" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#3a3a3a' }} />
            <stop offset="100%" style={{ stopColor: '#050505' }} />
          </radialGradient>
          <radialGradient id="gradient-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#22c55e' }} />
            <stop offset="100%" style={{ stopColor: '#15803d' }} />
          </radialGradient>
          <radialGradient id="gradient-r" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#ef4444' }} />
            <stop offset="100%" style={{ stopColor: '#b91c1c' }} />
          </radialGradient>
          <filter id="bevel" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
            <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
            <feSpecularLighting
              in="blur"
              surfaceScale="3"
              specularConstant=".75"
              specularExponent="10"
              lightingColor="#ffffff"
              result="specOut"
            >
              <fePointLight x="-5000" y="-10000" z="20000" />
            </feSpecularLighting>
            <feComposite
              in="specOut"
              in2="SourceAlpha"
              operator="in"
              result="specOut"
            />
            <feComposite
              in="SourceGraphic"
              in2="specOut"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              result="litPaint"
            />
            <feMerge>
              <feMergeNode in="offsetBlur" />
              <feMergeNode in="litPaint" />
            </feMerge>
          </filter>
          <filter id="bevel-hover" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset in="blur" dx="3" dy="3" result="offsetBlur" />
            <feSpecularLighting
              in="blur"
              surfaceScale="5"
              specularConstant="1"
              specularExponent="20"
              lightingColor="#ffffff"
              result="specOut"
            >
              <fePointLight x="-5000" y="-10000" z="20000" />
            </feSpecularLighting>
            <feComposite
              in="specOut"
              in2="SourceAlpha"
              operator="in"
              result="specOut"
            />
            <feComposite
              in="SourceGraphic"
              in2="specOut"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              result="litPaint"
            />
            <feMerge>
              <feMergeNode in="offsetBlur" />
              <feMergeNode in="litPaint" />
            </feMerge>
          </filter>
          <filter
            id="board-shadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="10"
              dy="10"
              stdDeviation="10"
              floodColor="#000000"
              floodOpacity="0.5"
            />
          </filter>
        </defs>
        <g transform="translate(50, 50)">
          {generateSegments(highlightedSegments)}
          <BullseyeGlowWrapper>
            <circle
              cx={center}
              cy={center}
              r={radii.bullOuter}
              className={`segment color-g ${highlightedSegments.includes('single-bull') ? 'active-segment' : ''}`}
              data-score="single-bull"
              onClick={() => handleDartThrow('single-bull')}
            />
          </BullseyeGlowWrapper>
          <BullseyeGlowWrapper>
            <circle
              cx={center}
              cy={center}
              r={radii.bullInner}
              className={`segment color-r ${highlightedSegments.includes('double-bull') ? 'active-segment' : ''}`}
              data-score="double-bull"
              onClick={() => handleDartThrow('double-bull')}
            />
          </BullseyeGlowWrapper>
        </g>
        <g transform="translate(50, 50)">{generateNumbers()}</g>
      </svg>
    </div>
  </div>
)

export default DartboardSVG
