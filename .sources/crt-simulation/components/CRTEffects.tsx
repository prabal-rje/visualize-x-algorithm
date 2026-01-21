import React from 'react';
import { CRTConfig } from '../types';

interface CRTEffectsProps {
  config: CRTConfig;
  children: React.ReactNode;
}

const CRTEffects: React.FC<CRTEffectsProps> = ({ config, children }) => {
  const curveVal = config.curvature * 20; 

  // Calculate dynamic filters based on config
  const blurAmount = config.power ? '0.4px' : '0px';
  const contrast = config.power ? '1.1' : '0.9';
  const saturation = config.power ? '1.15' : '0';
  const brightness = config.power ? config.brightness : '0';

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      
      {/* 1. Main Container with Curve and Post-Processing Filters */}
      <div 
        className="relative w-full h-full overflow-hidden transition-all duration-500 ease-out"
        style={{
           borderRadius: `${curveVal}px`,
           transform: `scale(${1 - (config.curvature * 0.025)})`,
           filter: `blur(${blurAmount}) contrast(${contrast}) brightness(${brightness}) saturate(${saturation})`,
           boxShadow: `inset 0 0 ${100 * config.vignetteIntensity}px rgba(0,0,0,0.9)`
        }}
      >
        {/* 2. Content Layer (The raw signal) */}
        <div className={`relative w-full h-full z-10 ${config.power ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
             {children}
        </div>

        {/* 3. BLOOM / HALATION LAYER (Simulates light scattering in the tube glass) */}
        <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-30 bg-gradient-to-t from-blue-900/10 to-red-900/10" />

        {/* 4. PHOSPHOR MASK (The subpixels) - High Fidelity Aperture Grille */}
        {config.power && (
            <div 
                className="absolute inset-0 z-30 pointer-events-none mix-blend-overlay"
                style={{
                    background: 'linear-gradient(90deg, #ff0000 0px, #ff0000 1px, #00ff00 1px, #00ff00 2px, #0000ff 2px, #0000ff 3px)',
                    backgroundSize: '3px 100%',
                    opacity: 0.15 
                }}
            />
        )}

        {/* 5. SCANLINES (The horizontal beams) */}
        {/* FIX: Use static black lines and control OPACITY instead of regenerating the gradient.
            This prevents rendering truncation bugs on large screens and ensures consistent brightness. */}
        {config.power && (
            <div 
                className="absolute inset-0 z-40 pointer-events-none"
                style={{
                    // Static gradient: Transparent then Black
                    background: `linear-gradient(to bottom, transparent 50%, #000000 50%)`,
                    backgroundSize: '100% 4px',
                    // Control intensity via opacity
                    opacity: config.scanlineIntensity
                }}
            />
        )}

        {/* 6. RGB CHANNEL SPLIT (Chromatic Aberration) - Global */}
        {config.power && config.chromaticAberration > 0 && (
            <>
                <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-40"
                     style={{
                         transform: `translate(${config.chromaticAberration * 2}px, 0)`,
                         background: 'rgba(255,0,0,0.02)'
                     }} />
                 <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-40"
                     style={{
                         transform: `translate(${-config.chromaticAberration * 2}px, 0)`,
                         background: 'rgba(0,0,255,0.02)'
                     }} />
            </>
        )}

        {/* 7. REFRESH FLICKER (60Hz hum) */}
        {config.power && (
            <div className="absolute inset-0 z-50 pointer-events-none bg-white opacity-[0.02] animate-flicker" />
        )}

        {/* 8. TUBE REFLECTION & GLARE */}
        <div 
            className="absolute inset-0 z-[60] pointer-events-none mix-blend-soft-light"
            style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 20%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
            }}
        />

        {/* 9. SIGNAL NOISE (Snow) */}
        {config.power && config.noiseIntensity > 0 && (
             <div 
             className="absolute inset-0 z-[15] pointer-events-none"
             style={{
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")',
                 filter: 'contrast(150%) brightness(100%)',
                 opacity: config.noiseIntensity * 0.08,
                 mixBlendMode: 'overlay',
                 animation: 'noise-shift 0.2s infinite steps(4)'
             }}
         />
        )}
      </div>

      {/* Screen Turn-off flash */}
      {!config.power && (
        <div className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none">
            <div className="w-[90%] h-[2px] bg-white animate-collapse-horizontal"></div>
        </div>
      )}
      
      <style>{`
        @keyframes flicker {
            0% { opacity: 0.02; }
            50% { opacity: 0.05; }
            100% { opacity: 0.02; }
        }
        @keyframes noise-shift {
            0% { transform: translate(0,0); }
            25% { transform: translate(-5%, 5%); }
            50% { transform: translate(5%, -5%); }
            75% { transform: translate(-5%, -5%); }
            100% { transform: translate(0,0); }
        }
        @keyframes collapse-horizontal {
            0% { transform: scaleX(1) scaleY(200); opacity: 1; }
            50% { transform: scaleX(1) scaleY(0.02); opacity: 1; }
            100% { transform: scaleX(0) scaleY(0.02); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CRTEffects;