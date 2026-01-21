import { useState } from 'react';
import CRTControls from './components/effects/CRTControls';
import { DEFAULT_CRT_CONFIG } from './components/effects/crtConfig';
import type { CRTConfig } from './components/effects/crtConfig';
import CRTOverlay from './components/effects/CRTOverlay';
import ScreenFlicker from './components/effects/ScreenFlicker';
import ConfigPanel from './components/layout/ConfigPanel';
import FunctionPanel from './components/layout/FunctionPanel';
import Marquee from './components/layout/Marquee';
import Timeline from './components/layout/Timeline';

function App() {
  const [crtConfig, setCrtConfig] = useState<CRTConfig>(DEFAULT_CRT_CONFIG);

  return (
    <CRTOverlay config={crtConfig}>
      <div data-testid="app-shell">
        <ScreenFlicker />
        <Marquee />
        <main>
          <section>CANVAS PLACEHOLDER</section>
          <section>
            <FunctionPanel />
            <ConfigPanel />
            <CRTControls config={crtConfig} onChange={setCrtConfig} />
          </section>
        </main>
        <Timeline />
      </div>
    </CRTOverlay>
  );
}

export default App
