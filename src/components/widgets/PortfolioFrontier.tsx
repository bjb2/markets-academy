import { useState, useMemo } from "react";

// Fixed two-asset case so the lesson narrative stays anchored:
// Asset A: low-risk / low-return (think bonds), Asset B: higher-risk / higher-return (think stocks).
// Slider varies correlation. Frontier collapses to a straight line at ρ = +1
// and bows leftward (lower portfolio vol for any given return) as ρ falls.
const A = { mu: 0.05, sigma: 0.08, name: "A (bond-like)" };
const B = { mu: 0.10, sigma: 0.18, name: "B (stock-like)" };

export default function PortfolioFrontier() {
  const [rho, setRho] = useState(0.2);

  const points = useMemo(() => {
    const out: { w: number; mu: number; sigma: number }[] = [];
    for (let w = 0; w <= 1.0001; w += 0.02) {
      const mu = w * A.mu + (1 - w) * B.mu;
      const varP =
        w * w * A.sigma * A.sigma +
        (1 - w) * (1 - w) * B.sigma * B.sigma +
        2 * w * (1 - w) * rho * A.sigma * B.sigma;
      const sigma = Math.sqrt(Math.max(varP, 0));
      out.push({ w, mu, sigma });
    }
    return out;
  }, [rho]);

  // Min-variance portfolio (closed-form for two assets):
  // w* = (σ_B² - ρ σ_A σ_B) / (σ_A² + σ_B² - 2 ρ σ_A σ_B)
  const mv = useMemo(() => {
    const num = B.sigma * B.sigma - rho * A.sigma * B.sigma;
    const den = A.sigma * A.sigma + B.sigma * B.sigma - 2 * rho * A.sigma * B.sigma;
    const w = Math.max(0, Math.min(1, num / den));
    const mu = w * A.mu + (1 - w) * B.mu;
    const varP =
      w * w * A.sigma * A.sigma +
      (1 - w) * (1 - w) * B.sigma * B.sigma +
      2 * w * (1 - w) * rho * A.sigma * B.sigma;
    return { w, mu, sigma: Math.sqrt(Math.max(varP, 0)) };
  }, [rho]);

  const W = 600;
  const H = 360;
  const pad = { top: 20, right: 30, bottom: 60, left: 70 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  // Axis ranges fixed so the frontier visibly morphs with rho.
  const xMin = 0;
  const xMax = 0.22;
  const yMin = 0.04;
  const yMax = 0.11;
  const xScale = (s: number) => pad.left + ((s - xMin) / (xMax - xMin)) * innerW;
  const yScale = (m: number) => pad.top + innerH - ((m - yMin) / (yMax - yMin)) * innerH;

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.sigma).toFixed(2)} ${yScale(p.mu).toFixed(2)}`)
    .join(" ");

  return (
    <div className="my-6 border border-rule rounded-lg p-5 bg-paper">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-ink/70 mb-4 mt-0">
        Two-asset efficient frontier
      </h4>
      <div className="mb-3 text-sm">
        <label className="flex flex-col">
          <span className="text-ink/70 flex justify-between">
            Correlation ρ between A and B
            <span className="font-mono">{rho >= 0 ? "+" : ""}{rho.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.05}
            value={rho}
            onChange={(e) => setRho(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* Axes */}
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={H - pad.bottom} stroke="#888" />
        <line x1={pad.left} y1={H - pad.bottom} x2={W - pad.right} y2={H - pad.bottom} stroke="#888" />
        {/* Y ticks */}
        {[0.04, 0.06, 0.08, 0.10].map((m) => (
          <g key={m}>
            <line x1={pad.left - 4} y1={yScale(m)} x2={pad.left} y2={yScale(m)} stroke="#888" />
            <text x={pad.left - 8} y={yScale(m) + 4} textAnchor="end" fontSize="10" fill="#6b6b6b">
              {(m * 100).toFixed(0)}%
            </text>
          </g>
        ))}
        {/* X ticks */}
        {[0.05, 0.10, 0.15, 0.20].map((s) => (
          <g key={s}>
            <line x1={xScale(s)} y1={H - pad.bottom} x2={xScale(s)} y2={H - pad.bottom + 4} stroke="#888" />
            <text x={xScale(s)} y={H - pad.bottom + 16} textAnchor="middle" fontSize="10" fill="#6b6b6b">
              {(s * 100).toFixed(0)}%
            </text>
          </g>
        ))}
        <text x={pad.left - 50} y={pad.top + innerH / 2} fontSize="11" fill="#6b6b6b" transform={`rotate(-90 ${pad.left - 50} ${pad.top + innerH / 2})`}>
          Expected return (μ)
        </text>
        <text x={pad.left + innerW / 2} y={H - 10} textAnchor="middle" fontSize="11" fill="#6b6b6b">
          Volatility (σ)
        </text>

        {/* Frontier path */}
        <path d={pathD} fill="none" stroke="#1e40af" strokeWidth={2.5} />

        {/* Endpoints */}
        <circle cx={xScale(A.sigma)} cy={yScale(A.mu)} r={5} fill="#0a7d4a" />
        <text x={xScale(A.sigma) - 10} y={yScale(A.mu) + 4} textAnchor="end" fontSize="11" fill="#0a7d4a">
          {A.name}
        </text>
        <circle cx={xScale(B.sigma)} cy={yScale(B.mu)} r={5} fill="#dc2626" />
        <text x={xScale(B.sigma) + 10} y={yScale(B.mu) + 4} fontSize="11" fill="#dc2626">
          {B.name}
        </text>

        {/* Minimum-variance portfolio */}
        <circle cx={xScale(mv.sigma)} cy={yScale(mv.mu)} r={6} fill="#444" />
        <text x={xScale(mv.sigma) + 8} y={yScale(mv.mu) - 8} fontSize="11" fill="#444" fontWeight="bold">
          MVP ({(mv.w * 100).toFixed(0)}% A / {((1 - mv.w) * 100).toFixed(0)}% B)
        </text>
      </svg>
      <p className="text-xs text-ink/60 mt-2 italic">
        σ(MVP) = {(mv.sigma * 100).toFixed(2)}%, μ(MVP) = {(mv.mu * 100).toFixed(2)}%. At ρ = +1 the frontier collapses to a straight line: diversification stops doing work. As ρ falls, the frontier bows leftward, the minimum-variance portfolio gets a smaller σ than either asset alone. At ρ = −1 you could in principle hit σ = 0.
      </p>
    </div>
  );
}
