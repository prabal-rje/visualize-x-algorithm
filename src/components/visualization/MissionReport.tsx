import { badgeForPercentile } from '../../utils/rpgStats';

export type MissionReportProps = {
  reach: number;
  resonance: number;
  momentum: number;
  percentile: number;
  onReplay: () => void;
};

const MissionReport = ({
  reach,
  resonance,
  momentum,
  percentile,
  onReplay
}: MissionReportProps) => {
  const badge = badgeForPercentile(percentile);
  const formattedResonance = resonance.toFixed(2);
  const formattedMomentum = `${momentum.toFixed(1)}%`;

  return (
    <div
      className="grid gap-6 border border-crt-line/35 bg-crt-dark/90 p-panel-lg shadow-[inset_0_0_30px_rgba(51,255,51,0.08),_0_0_24px_rgba(51,255,51,0.15)]"
      data-testid="mission-report"
      data-system="report"
    >
      <h2 className="font-display text-[20px] uppercase tracking-[0.15em] text-crt-amber text-glow-amber">
        Mission Report
      </h2>

      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
        <div className="flex flex-col gap-2 border border-crt-line/25 bg-crt-panel-strong/50 p-3">
          <span className="text-[12px] uppercase tracking-[0.1em] text-crt-ink/70">
            Reach
          </span>
          <span className="text-[24px] font-bold text-crt-ink text-glow-green">
            {reach}
          </span>
        </div>
        <div className="flex flex-col gap-2 border border-crt-line/25 bg-crt-panel-strong/50 p-3">
          <span className="text-[12px] uppercase tracking-[0.1em] text-crt-ink/70">
            Resonance
          </span>
          <span className="text-[24px] font-bold text-crt-ink text-glow-green">
            {formattedResonance}
          </span>
        </div>
        <div className="flex flex-col gap-2 border border-crt-line/25 bg-crt-panel-strong/50 p-3">
          <span className="text-[12px] uppercase tracking-[0.1em] text-crt-ink/70">
            Momentum
          </span>
          <span className="text-[24px] font-bold text-crt-ink text-glow-green">
            {formattedMomentum}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 border border-crt-amber/35 bg-[rgba(30,20,0,0.4)] p-4 text-center">
        <span className="text-[12px] uppercase tracking-[0.1em] text-crt-amber/70">
          Rank
        </span>
        <span className="text-[18px] uppercase tracking-[0.12em] text-crt-amber text-glow-amber">
          {badge}
        </span>
      </div>

      <button
        className="crt-button px-5 py-3 text-[14px] tracking-[0.15em] shadow-crt hover:-translate-y-0.5 hover:shadow-crt-strong active:translate-y-0"
        onClick={onReplay}
      >
        Run Another Simulation
      </button>
    </div>
  );
};

export default MissionReport;
