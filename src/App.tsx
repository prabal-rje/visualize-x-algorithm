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
import { useSimulationState } from './hooks/useSimulationState';
import { useViewport } from './hooks/useViewport';
import { initializeEmbedder, isInitialized } from './ml/embeddings';
import { setAmbientDrone } from './audio/engine';
import { useConfigStore } from './stores/config';
import { useMLStore } from './stores/ml';

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
  const mlStatus = useMLStore((state) => state.status);
  const setLoading = useMLStore((state) => state.setLoading);
  const setProgress = useMLStore((state) => state.setProgress);
  const setReady = useMLStore((state) => state.setReady);
  const setError = useMLStore((state) => state.setError);
  const { isMobile, prefersReducedMotion, prefersHighContrast } = useViewport();
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

  const { position } = simulationState;
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
          className="ds-shell relative min-h-screen grid-rows-[auto_auto_1fr] bg-crt-void bg-crt-veil data-[loading=true]:min-h-[min(100vh,100dvh)] data-[loading=true]:grid-rows-[auto_1fr]"
          data-loading="true"
          data-mobile={isMobile}
          data-reduced-motion={prefersReducedMotion}
          data-high-contrast={prefersHighContrast}
          data-system="shell"
        >
          <ScreenFlicker />
          <Marquee />
          <div className="flex min-h-[clamp(320px,60vh,640px)] items-center justify-center">
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
        className="ds-shell relative min-h-screen grid-rows-[auto_auto_1fr] bg-crt-void bg-crt-veil"
        data-mobile={isMobile}
        data-reduced-motion={prefersReducedMotion}
        data-high-contrast={prefersHighContrast}
        data-system="shell"
      >
        <ScreenFlicker />
        <Marquee />
        <section className="relative z-[1]">
          <Timeline
            position={simulationState.position}
            status={simulationState.status}
            dispatch={dispatch}
          />
        </section>
        <main
          className="relative grid min-h-0 items-stretch gap-shell grid-cols-1"
        >
          <section
            className="relative min-h-0 h-full overflow-x-hidden overflow-y-auto rounded-panel border border-crt-line/30 bg-crt-void/90 p-panel text-crt-ink shadow-[inset_0_0_40px_rgba(0,20,0,0.35)]"
            data-testid="chapter-canvas"
            data-proportion="fixed"
            data-viewport-fit="true"
            data-fill-height="true"
            data-compact={isCompactChapter}
          >
            {renderChapterScene()}
          </section>
        </main>
        <CRTControls config={crtConfig} onChange={setCrtConfig} />
      </div>
    </CRTOverlay>
  );
}

export default App
