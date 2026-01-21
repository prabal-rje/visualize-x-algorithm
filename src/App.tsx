import CRTOverlay from './components/effects/CRTOverlay';
import ScreenFlicker from './components/effects/ScreenFlicker';
import ConfigPanel from './components/layout/ConfigPanel';
import FunctionPanel from './components/layout/FunctionPanel';
import Marquee from './components/layout/Marquee';
import Timeline from './components/layout/Timeline';

function App() {
  return (
    <CRTOverlay>
      <div data-testid="app-shell">
        <ScreenFlicker />
        <Marquee />
        <main>
          <section>CANVAS PLACEHOLDER</section>
          <section>
            <FunctionPanel />
            <ConfigPanel />
          </section>
        </main>
        <Timeline />
      </div>
    </CRTOverlay>
  );
}

export default App
