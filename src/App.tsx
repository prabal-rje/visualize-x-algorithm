import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import CompletionOverlay from './components/effects/CompletionOverlay';
import CRTControls from './components/effects/CRTControls';
import { DEFAULT_CRT_CONFIG } from './components/effects/crtConfig';
import type { CRTConfig } from './components/effects/crtConfig';
import CRTOverlay from './components/effects/CRTOverlay';
import ScreenFlicker from './components/effects/ScreenFlicker';
import Marquee from './components/layout/Marquee';
import MobileHeader from './components/layout/MobileHeader';
import Timeline from './components/layout/Timeline';
import BIOSIntro from './components/visualization/BIOSIntro';
import BIOSLoading from './components/visualization/BIOSLoading';
import ChapterSkeleton from './components/visualization/ChapterSkeleton';
import ChapterWrapper from './components/visualization/ChapterWrapper';
import { useSimulationState } from './hooks/useSimulationState';
import { useViewport } from './hooks/useViewport';
import { initializeEmbedder, isInitialized } from './ml/embeddings';
import { initAudienceEmbeddings } from './ml/reach';
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
  const [showIntro, setShowIntro] = useState(true);
  const [simulationState, dispatch] = useSimulationState();
  const simulationStarted = useConfigStore((state) => state.simulationStarted);
  const beginSimulation = useConfigStore((state) => state.beginSimulation);
  const resetSimulation = useConfigStore((state) => state.resetSimulation);
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
      .then(async () => {
        // Pre-compute audience embeddings for reach calculation
        setLoading('Computing audience profiles...');
        await initAudienceEmbeddings();
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

  // Direct callback for BEGIN button - no effect indirection
  const handleBeginSimulation = useCallback(() => {
    beginSimulation(); // Compute simulation results
    dispatch({ type: 'START' });
    dispatch({ type: 'JUMP_TO_CHAPTER', chapterIndex: 1 });
  }, [beginSimulation, dispatch]);

  // Callback for trying again from completion screen
  const handleTryAgain = useCallback(() => {
    resetSimulation(); // Reset config store's simulationStarted flag
    dispatch({ type: 'RESET' });
  }, [dispatch, resetSimulation]);

  // Callback for Continue button in chapter scenes
  const handleContinue = useCallback(() => {
    dispatch({ type: 'STEP_FORWARD' });
  }, [dispatch]);

  // Callback for dismissing intro screen
  const handleDismissIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  // Handle Enter key to dismiss intro
  useEffect(() => {
    if (!showIntro || !isModelReady) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        setShowIntro(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showIntro, isModelReady]);

  const { position } = simulationState;
  const isCompactChapter = position.chapterIndex >= 3;

  const renderChapterScene = () => {
    const { chapterIndex, subChapterIndex } = position;

    return (
      <Suspense fallback={<ChapterSkeleton />}>
        {chapterIndex === 0 && (
          <ChapterWrapper chapterIndex={0} isActive={true}>
            <Chapter0Scene
              currentStep={subChapterIndex}
              isActive={true}
              onStepForward={() => dispatch({ type: 'STEP_FORWARD' })}
              onStepBack={() => dispatch({ type: 'STEP_BACK' })}
              onBeginSimulation={handleBeginSimulation}
            />
          </ChapterWrapper>
        )}
        {chapterIndex === 1 && (
          <ChapterWrapper chapterIndex={1} isActive={true}>
            <Chapter1Scene
              currentStep={subChapterIndex}
              isActive={true}
              userId="8392847293"
              onContinue={handleContinue}
            />
          </ChapterWrapper>
        )}
        {chapterIndex === 2 && (
          <ChapterWrapper chapterIndex={2} isActive={true}>
            <Chapter2Scene currentStep={subChapterIndex} isActive={true} onContinue={handleContinue} />
          </ChapterWrapper>
        )}
        {chapterIndex === 3 && (
          <ChapterWrapper chapterIndex={3} isActive={true}>
            <Chapter3Scene currentStep={subChapterIndex} isActive={true} onContinue={handleContinue} />
          </ChapterWrapper>
        )}
        {chapterIndex === 4 && (
          <ChapterWrapper chapterIndex={4} isActive={true}>
            <Chapter4Scene currentStep={subChapterIndex} isActive={true} onContinue={handleContinue} />
          </ChapterWrapper>
        )}
        {chapterIndex === 5 && (
          <ChapterWrapper chapterIndex={5} isActive={true}>
            <Chapter5Scene currentStep={subChapterIndex} isActive={true} onContinue={handleContinue} />
          </ChapterWrapper>
        )}
      </Suspense>
    );
  };

  // Show loading screen while model downloads
  if (!isModelReady) {
    return (
      <CRTOverlay
        config={crtConfig}
        reducedEffects={isMobile}
        reducedMotion={prefersReducedMotion}
      >
        <div
          data-testid="app-shell"
          className="relative flex min-h-screen flex-col bg-crt-void bg-crt-veil"
          data-loading="true"
          data-mobile={isMobile}
          data-reduced-motion={prefersReducedMotion}
          data-high-contrast={prefersHighContrast}
          data-system="shell"
        >
          <ScreenFlicker />
          <Marquee />
          <div className="flex flex-1 items-center justify-center p-4 max-sm:p-0">
            {/* Mobile: rotate 90deg for widescreen BIOS effect */}
            <div className="px-4 max-sm:fixed max-sm:top-1/2 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:-translate-y-1/2 max-sm:rotate-90 max-sm:w-[min(100vh,100vw)] max-sm:px-6">
              <BIOSLoading />
            </div>
          </div>
        </div>
      </CRTOverlay>
    );
  }

  // Show intro screen after model is ready, before simulation
  if (showIntro) {
    return (
      <CRTOverlay
        config={crtConfig}
        reducedEffects={isMobile}
        reducedMotion={prefersReducedMotion}
      >
        <div
          data-testid="app-shell"
          className="relative flex min-h-screen flex-col bg-crt-void bg-crt-veil"
          data-intro="true"
          data-mobile={isMobile}
          data-reduced-motion={prefersReducedMotion}
          data-high-contrast={prefersHighContrast}
          data-system="shell"
        >
          <ScreenFlicker />
          <Marquee />
          <div className="flex flex-1 items-center justify-center p-4 max-sm:p-0">
            <div className="px-4 max-sm:fixed max-sm:top-1/2 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:-translate-y-1/2 max-sm:rotate-90 max-sm:w-[85vh] max-sm:px-2">
              <BIOSIntro onStart={handleDismissIntro} />
            </div>
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
        className={`relative bg-crt-void bg-crt-veil ${
          isMobile
            ? 'flex h-screen w-full flex-col'
            : 'ds-shell min-h-screen grid-rows-[auto_auto_1fr] max-sm:px-0'
        }`}
        data-mobile={isMobile}
        data-reduced-motion={prefersReducedMotion}
        data-high-contrast={prefersHighContrast}
        data-system="shell"
      >
        <ScreenFlicker />

        {isMobile ? (
          <>
            {/* Mobile: Sticky header + scrollable content */}
            <MobileHeader
              position={simulationState.position}
              status={simulationState.status}
              dispatch={dispatch}
            />
            <main className="flex-1 overflow-y-auto">
              <section
                className="min-h-full bg-crt-void px-2 text-crt-ink"
                data-testid="chapter-canvas"
                data-compact={isCompactChapter}
              >
                {renderChapterScene()}
              </section>
            </main>
          </>
        ) : (
          <>
            {/* Desktop: Original layout */}
            <Marquee />
            <section className="relative z-[1]">
              <Timeline
                position={simulationState.position}
                status={simulationState.status}
                dispatch={dispatch}
              />
            </section>
            <main className="relative grid min-h-0 items-stretch gap-shell grid-cols-1">
              <section
                className="relative min-h-0 h-full overflow-x-hidden overflow-y-auto rounded-panel border border-transparent bg-crt-void/90 p-panel text-crt-ink shadow-[inset_0_0_40px_rgba(0,20,0,0.35)]"
                data-testid="chapter-canvas"
                data-proportion="fixed"
                data-viewport-fit="true"
                data-fill-height="true"
                data-compact={isCompactChapter}
              >
                {renderChapterScene()}
              </section>
            </main>
          </>
        )}

        <CRTControls config={crtConfig} onChange={setCrtConfig} />

        {/* Completion celebration overlay */}
        {simulationState.status === 'complete' && (
          <CompletionOverlay onTryAgain={handleTryAgain} />
        )}
      </div>
    </CRTOverlay>
  );
}

export default App
