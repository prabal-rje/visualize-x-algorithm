import React, { useState } from 'react';
import { CRTConfig } from './types';
import RetroCanvas from './components/RetroCanvas';
import CRTEffects from './components/CRTEffects';
import Controls from './components/Controls';
import { Settings2 } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<CRTConfig>({
    power: true,
    curvature: 0.8,
    scanlineIntensity: 0.35,
    vignetteIntensity: 0.4,
    noiseIntensity: 0.2,
    phosphorDecay: 0.95, // 5% Persistence (1 - 0.95)
    chromaticAberration: 0.3,
    brightness: 1.1,
  });

  const [showControls, setShowControls] = useState(true);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative font-sans">
      
      {/* Full Screen CRT Effect */}
      <div className="absolute inset-0 z-0">
          <CRTEffects config={config}>
            <RetroCanvas config={config} />
          </CRTEffects>
      </div>

      {/* Floating Controls */}
      <div className={`absolute top-6 right-6 z-50 transition-transform duration-300 ${showControls ? 'translate-x-0' : 'translate-x-[120%]'}`}>
         <div className="relative">
            <Controls config={config} setConfig={setConfig} />
            <button 
                onClick={() => setShowControls(false)}
                className="absolute -left-10 top-0 p-2 bg-neutral-900 text-white rounded-l-md opacity-50 hover:opacity-100"
                title="Hide Controls"
            >
                ✕
            </button>
         </div>
      </div>

      {/* Show Controls Trigger */}
      {!showControls && (
        <button 
            onClick={() => setShowControls(true)}
            className="absolute top-6 right-0 z-50 p-3 bg-neutral-900/80 backdrop-blur text-white rounded-l-xl border-l border-neutral-700 hover:bg-neutral-800 transition-all shadow-[0_0_15px_rgba(0,255,100,0.2)]"
        >
            <Settings2 size={24} />
        </button>
      )}

    </div>
  );
};

export default App;