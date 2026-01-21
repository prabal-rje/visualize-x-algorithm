import { Suspense, lazy, useEffect, useState } from 'react';
import CRTControls from './components/effects/CRTControls';
import { DEFAULT_CRT_CONFIG } from './components/effects/crtConfig';
import type { CRTConfig } from './components/effects/crtConfig';
import CRTOverlay from './components/effects/CRTOverlay';
import ScreenFlicker from './components/effects/ScreenFlicker';
import Marquee from './components/layout/Marquee';
import Timeline from './components/layout/Timeline';
import BIOSLoading from './components/visualization/BIOSLoading';
import ChapterSkeleton from './components/visualization/ChapterSkeleton';
import ChapterWrapper from './components/visualization/ChapterWrapper';
import MissionReport from './components/visualization/MissionReport';
import { useSimulationState } from './hooks/useSimulationState';
import { useViewport } from './hooks/useViewport';
import { initializeEmbedder, isInitialized } from './ml/embeddings';
import { setAmbientDrone } from './audio/engine';
import { useConfigStore } from './stores/config';
import { useMLStore } from './stores/ml';
import styles from './styles/app-shell.module.css';

const Chapter0Scene = lazy(() => import('./components/chapters/Chapter0Scene'));
const Chapter1Scene = lazy(() => import('./components/chapters/Chapter1Scene'));
const Chapter2Scene = lazy(() => import('./components/chapters/Chapter2Scene'));
const Chapter3Scene = lazy(() => import('./components/chapters/Chapter3Scene'));
const Chapter4Scene = lazy(() => import('./components/chapters/Chapter4Scene'));
const Chapter5Scene = lazy(() => import('./components/chapters/Chapter5Scene'));

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
  const { isMobile, prefersReducedMotion, prefersHighContrast } = useViewport();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(!isMobile);
  const isModelReady = mlStatus === 'ready';

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

  useEffect(() => {
    if (!simulationStarted || mlStatus !== 'ready') {
      void setAmbientDrone(false);
      return undefined;
    }
    void setAmbientDrone(true);
    return () => {
      void setAmbientDrone(false);
    };
  }, [simulationStarted, mlStatus]);

  useEffect(() => {
    if (simulationStarted) {
      dispatch({ type: 'START' });
      dispatch({ type: 'JUMP_TO_CHAPTER', chapterIndex: 1 });
    } else {
      dispatch({ type: 'RESET' });
    }
  }, [dispatch, simulationStarted]);

  useEffect(() => {
    if (isMobile) {
      setIsSidePanelOpen(false);
    }
  }, [isMobile]);

  const { position } = simulationState;

  const renderMainContent = () => {
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
    return null;
  };

  const mainContent = renderMainContent();
  const showSidePanel = Boolean(mainContent);
  const sidePanelOpen = showSidePanel && isSidePanelOpen;
  const isCompactChapter = position.chapterIndex >= 3;

  const renderChapterScene = () => {
    const { chapterIndex, subChapterIndex } = position;

    return (
      <Suspense fallback={<ChapterSkeleton />}>
        {chapterIndex === 0 && (
          <ChapterWrapper chapterIndex={0} isActive={true}>
            <Chapter0Scene currentStep={subChapterIndex} isActive={true} />
          </ChapterWrapper>
        )}
        {chapterIndex === 1 && (
          <ChapterWrapper chapterIndex={1} isActive={true}>
            <Chapter1Scene
              currentStep={subChapterIndex}
              isActive={true}
              userId="8392847293"
            />
          </ChapterWrapper>
        )}
        {chapterIndex === 2 && (
          <ChapterWrapper chapterIndex={2} isActive={true}>
            <Chapter2Scene currentStep={subChapterIndex} isActive={true} />
          </ChapterWrapper>
        )}
        {chapterIndex === 3 && (
          <ChapterWrapper chapterIndex={3} isActive={true}>
            <Chapter3Scene currentStep={subChapterIndex} isActive={true} />
          </ChapterWrapper>
        )}
        {chapterIndex === 4 && (
          <ChapterWrapper chapterIndex={4} isActive={true}>
            <Chapter4Scene currentStep={subChapterIndex} isActive={true} />
          </ChapterWrapper>
        )}
        {chapterIndex === 5 && (
          <ChapterWrapper chapterIndex={5} isActive={true}>
            <Chapter5Scene currentStep={subChapterIndex} isActive={true} />
          </ChapterWrapper>
        )}
      </Suspense>
    );
  };

  if (!isModelReady) {
    return (
      <CRTOverlay
        config={crtConfig}
        reducedEffects={isMobile}
        reducedMotion={prefersReducedMotion}
      >
        <div
          data-testid="app-shell"
          className={styles.appShell}
          data-loading="true"
          data-mobile={isMobile}
          data-reduced-motion={prefersReducedMotion}
          data-high-contrast={prefersHighContrast}
        >
          <ScreenFlicker />
          <Marquee />
          <div className={styles.loadingCenter}>
            <BIOSLoading />
          </div>
        </div>
      </CRTOverlay>
    );
  }

  return (
    <CRTOverlay
      config={crtConfig}
      reducedEffects={isMobile}
      reducedMotion={prefersReducedMotion}
    >
      <div
        data-testid="app-shell"
        className={styles.appShell}
        data-mobile={isMobile}
        data-reduced-motion={prefersReducedMotion}
        data-high-contrast={prefersHighContrast}
      >
        <ScreenFlicker />
        <Marquee />
        <section className={styles.timelineBar}>
          <Timeline
            position={simulationState.position}
            status={simulationState.status}
            dispatch={dispatch}
          />
        </section>
        <main
          className={styles.main}
          data-side-panel={sidePanelOpen}
          data-side-open={sidePanelOpen}
        >
          {showSidePanel && (
            <button
              className={styles.sideToggle}
              onClick={() => setIsSidePanelOpen((prev) => !prev)}
              type="button"
              aria-label={sidePanelOpen ? 'Hide mission report' : 'Show mission report'}
              aria-expanded={sidePanelOpen}
              aria-controls="mission-report-panel"
            >
              <span className={styles.sideToggleLabel}>REPORT</span>
            </button>
          )}
          <section
            className={styles.chapterCanvas}
            data-testid="chapter-canvas"
            data-proportion="fixed"
            data-viewport-fit="true"
            data-fill-height="true"
            data-compact={isCompactChapter}
          >
            {renderChapterScene()}
          </section>
          {sidePanelOpen && (
            <section className={styles.sidePanel} id="mission-report-panel">
              {mainContent}
            </section>
          )}
        </main>
        <CRTControls config={crtConfig} onChange={setCrtConfig} />
      </div>
    </CRTOverlay>
  );
}

export default App
