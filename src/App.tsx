import { useEffect, useState } from 'react';
import Chapter1Scene from './components/chapters/Chapter1Scene';
import Chapter2Scene from './components/chapters/Chapter2Scene';
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
import ChapterWrapper from './components/visualization/ChapterWrapper';
import MissionReport from './components/visualization/MissionReport';
import { getFunctionAtPosition } from './data/chapters';
import { useSimulationState } from './hooks/useSimulationState';
import { initializeEmbedder, isInitialized } from './ml/embeddings';
import { useConfigStore } from './stores/config';
import { useMLStore } from './stores/ml';

function App() {
  const [crtConfig, setCrtConfig] = useState<CRTConfig>(DEFAULT_CRT_CONFIG);
  const [simulationState, dispatch] = useSimulationState();
  const simulationStarted = useConfigStore((state) => state.simulationStarted);
  const rpgStats = useConfigStore((state) => state.rpgStats);
  const resetSimulation = useConfigStore((state) => state.resetSimulation);
  const mlStatus = useMLStore((state) => state.status);
  const setLoading = useMLStore((state) => state.setLoading);
  const setProgress = useMLStore((state) => state.setProgress);
  const setReady = useMLStore((state) => state.setReady);
  const setError = useMLStore((state) => state.setError);

  // Initialize embedder on mount (downloads and caches Nomic model)
  useEffect(() => {
    // Skip if already initialized or currently loading
    if (isInitialized() || mlStatus !== 'idle') {
      return;
    }

    setLoading('Initializing semantic processor...');

    initializeEmbedder((progress, status) => {
      setProgress(progress / 100);
      setLoading(status);
    })
      .then(() => {
        setReady();
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load model');
      });
  }, [mlStatus, setLoading, setProgress, setReady, setError]);

  // Get current function info from simulation position
  const { position } = simulationState;
  const currentFunction = getFunctionAtPosition(
    position.chapterIndex,
    position.subChapterIndex,
    position.functionIndex
  );

  const renderMainContent = () => {
    // Always show BIOS loading until model is ready
    if (mlStatus !== 'ready') {
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

  const renderChapterScene = () => {
    // Don't render chapters until model is ready
    if (!simulationStarted || mlStatus !== 'ready') return null;

    const { chapterIndex, subChapterIndex } = position;

    return (
      <>
        {chapterIndex === 0 && (
          <ChapterWrapper chapterIndex={0} isActive={true}>
            <Chapter1Scene
              currentStep={subChapterIndex}
              isActive={true}
              userId="8392847293"
            />
          </ChapterWrapper>
        )}
        {chapterIndex === 1 && (
          <ChapterWrapper chapterIndex={1} isActive={true}>
            <Chapter2Scene currentStep={subChapterIndex} isActive={true} />
          </ChapterWrapper>
        )}
        {chapterIndex > 1 && (
          <div style={{ padding: '20px', color: 'var(--phosphor-green)', fontFamily: 'var(--font-mono)' }}>
            Chapter {chapterIndex + 1} coming soon...
          </div>
        )}
      </>
    );
  };

  return (
    <CRTOverlay config={crtConfig}>
      <div data-testid="app-shell">
        <ScreenFlicker />
        <Marquee />
        <main>
          <section data-testid="chapter-canvas">
            {simulationStarted && mlStatus === 'ready'
              ? renderChapterScene()
              : <div style={{ padding: '20px', color: 'var(--phosphor-green)', fontFamily: 'var(--font-mono)' }}>
                  {mlStatus !== 'ready' ? 'Waiting for model to load...' : 'Configure and start simulation'}
                </div>
            }
          </section>
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
