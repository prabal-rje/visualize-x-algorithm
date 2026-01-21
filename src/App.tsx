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
import BIOSLoading from './components/visualization/BIOSLoading';
import MissionReport from './components/visualization/MissionReport';
import { getFunctionAtPosition } from './data/chapters';
import { useSimulationState } from './hooks/useSimulationState';
import { useConfigStore } from './stores/config';
import { useMLStore } from './stores/ml';

function App() {
  const [crtConfig, setCrtConfig] = useState<CRTConfig>(DEFAULT_CRT_CONFIG);
  const [simulationState, dispatch] = useSimulationState();
  const simulationStarted = useConfigStore((state) => state.simulationStarted);
  const rpgStats = useConfigStore((state) => state.rpgStats);
  const resetSimulation = useConfigStore((state) => state.resetSimulation);
  const mlStatus = useMLStore((state) => state.status);

  // Get current function info from simulation position
  const { position } = simulationState;
  const currentFunction = getFunctionAtPosition(
    position.chapterIndex,
    position.subChapterIndex,
    position.functionIndex
  );

  const renderMainContent = () => {
    if (mlStatus === 'loading') {
      return <BIOSLoading />;
    }
    if (simulationStarted && rpgStats) {
      return (
        <MissionReport
          reach={rpgStats.reach}
          resonance={rpgStats.resonance}
          momentum={rpgStats.momentum}
          percentile={rpgStats.percentile}
          onReplay={resetSimulation}
        />
      );
    }
    return <ConfigPanel />;
  };

  return (
    <CRTOverlay config={crtConfig}>
      <div data-testid="app-shell">
        <ScreenFlicker />
        <Marquee />
        <main>
          <section>CANVAS PLACEHOLDER</section>
          <section>
            <FunctionPanel
              info={
                simulationStarted && currentFunction
                  ? {
                      name: currentFunction.name,
                      file: currentFunction.file,
                      summary: currentFunction.summary,
                      githubUrl: currentFunction.githubUrl,
                    }
                  : undefined
              }
            />
            {renderMainContent()}
            <CRTControls config={crtConfig} onChange={setCrtConfig} />
          </section>
        </main>
        <Timeline
          position={simulationState.position}
          status={simulationState.status}
          dispatch={dispatch}
        />
      </div>
    </CRTOverlay>
  );
}

export default App
