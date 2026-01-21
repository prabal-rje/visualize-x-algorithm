import React from 'react';
import { CRTConfig } from '../types';
import { Power, Zap, Activity, Grid, Layers, Aperture, Sun } from 'lucide-react';

interface ControlsProps {
  config: CRTConfig;
  setConfig: React.Dispatch<React.SetStateAction<CRTConfig>>;
}

const Controls: React.FC<ControlsProps> = ({ config, setConfig }) => {
  const handleChange = (key: keyof CRTConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const togglePower = () => {
    setConfig((prev) => ({ ...prev, power: !prev.power }));
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-2xl w-full max-w-sm md:max-w-md backdrop-blur-sm bg-opacity-90">
      <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
        <h2 className="text-xl font-bold text-neutral-300 font-mono tracking-wider flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            SYS.CONTROL
        </h2>
        <button
          onClick={togglePower}
          className={`
            p-3 rounded-full border-2 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]
            ${config.power 
              ? 'border-green-500 bg-green-500/20 text-green-400 shadow-green-500/20' 
              : 'border-red-600 bg-red-600/10 text-red-600 hover:bg-red-600/20'}
          `}
        >
          <Power size={20} />
        </button>
      </div>

      <div className={`space-y-5 transition-opacity duration-300 ${!config.power ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Phosphor Persistence (Decay) */}
        <ControlGroup 
          icon={<Activity size={16} />}
          label="Phosphor Persistence" 
          value={1 - config.phosphorDecay} // Invert for UI: High persistence = Low decay
          min={0.05} max={0.98} step={0.01}
          onChange={(v) => handleChange('phosphorDecay', 1 - v)} // Invert back
          displayValue={Math.round((1 - config.phosphorDecay) * 100) + '%'}
        />

        {/* Scanlines */}
        <ControlGroup 
          icon={<Grid size={16} />}
          label="Scanline Intensity" 
          value={config.scanlineIntensity} 
          min={0} max={1} step={0.05}
          onChange={(v) => handleChange('scanlineIntensity', v)}
        />

        {/* Curvature */}
        <ControlGroup 
          icon={<Layers size={16} />}
          label="Screen Curvature" 
          value={config.curvature} 
          min={0} max={1.5} step={0.1}
          onChange={(v) => handleChange('curvature', v)}
        />

        {/* Chromatic Aberration */}
        <ControlGroup 
          icon={<Zap size={16} />}
          label="RGB Shift (Aberration)" 
          value={config.chromaticAberration} 
          min={0} max={1} step={0.05}
          onChange={(v) => handleChange('chromaticAberration', v)}
        />

         {/* Vignette */}
         <ControlGroup 
          icon={<Aperture size={16} />}
          label="Vignette" 
          value={config.vignetteIntensity} 
          min={0} max={1} step={0.05}
          onChange={(v) => handleChange('vignetteIntensity', v)}
        />

        {/* Brightness */}
        <ControlGroup 
          icon={<Sun size={16} />}
          label="Brightness" 
          value={config.brightness} 
          min={0.5} max={1.5} step={0.05}
          onChange={(v) => handleChange('brightness', v)}
        />

      </div>
      
      {!config.power && (
        <div className="mt-4 text-center text-red-900 font-mono text-xs uppercase tracking-widest animate-pulse">
            System Standby
        </div>
      )}
    </div>
  );
};

// Sub-component for a single slider
const ControlGroup: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue?: string;
  onChange: (val: number) => void;
}> = ({ label, icon, value, min, max, step, onChange, displayValue }) => {
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-neutral-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
            <span className="text-neutral-500 group-hover:text-blue-400 transition-colors">{icon}</span>
            {label}
        </label>
        <span className="text-neutral-500 text-xs font-mono bg-neutral-950 px-1.5 py-0.5 rounded">
          {displayValue || value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="
          w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-sm
          [&::-webkit-slider-thumb]:bg-neutral-400
          [&::-webkit-slider-thumb]:hover:bg-blue-400
          [&::-webkit-slider-thumb]:transition-colors
          focus:outline-none
        "
      />
    </div>
  );
};

export default Controls;