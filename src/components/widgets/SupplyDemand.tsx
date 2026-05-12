import { useState } from "react";

export default function SupplyDemand() {
  const [demandShift, setDemandShift] = useState(0);
  const [supplyShift, setSupplyShift] = useState(0);

  const W = 600;
  const H = 320;
  const pad = { top: 20, right: 30, bottom: 50, left: 60 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  // Linear curves: demand price = a - b*q + demandShift; supply price = c + d*q + supplyShift
  const a = 10 + demandShift;
  const b = 1;
  const c = 2 + supplyShift;
  const d = 1;

  // Clearing: a - b*q = c + d*q => q* = (a-c)/(b+d), p* = c + d*q*
  const qStar = Math.max(0, (a - c) / (b + d));
  const pStar = c + d * qStar;

  const xScale = (q: number) => pad.left + (q / 10) * innerW;
  const yScale = (p: number) => pad.top + innerH - (p / 12) * innerH;

  // Polyline points
  const demand = [{ q: 0, p: a }, { q: 10, p: Math.max(0, a - b * 10) }];
  const supply = [{ q: 0, p: c }, { q: 10, p: c + d * 10 }];

  return (
    <div className="my-6 border border-rule rounded-lg p-5 bg-paper">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-ink/70 mb-4 mt-0">
        Supply & demand — shift the curves
      </h4>
      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <label className="flex flex-col">
          <span className="text-ink/70 flex justify-between">Demand shift <span className="font-mono">{demandShift >= 0 ? "+" : ""}{demandShift}</span></span>
          <input type="range" min={-4} max={4} step={0.5} value={demandShift} onChange={(e) => setDemandShift(parseFloat(e.target.value))} />
        </label>
        <label className="flex flex-col">
          <span className="text-ink/70 flex justify-between">Supply shift <span className="font-mono">{supplyShift >= 0 ? "+" : ""}{supplyShift}</span></span>
          <input type="range" min={-4} max={4} step={0.5} value={supplyShift} onChange={(e) => setSupplyShift(parseFloat(e.target.value))} />
        </label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* Axes */}
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={H - pad.bottom} stroke="#888" />
        <line x1={pad.left} y1={H - pad.bottom} x2={W - pad.right} y2={H - pad.bottom} stroke="#888" />
        <text x={pad.left - 8} y={pad.top - 4} textAnchor="end" fontSize="11" fill="#6b6b6b">$</text>
        <text x={W - pad.right} y={H - pad.bottom + 30} textAnchor="end" fontSize="11" fill="#6b6b6b">quantity</text>

        {/* Demand */}
        <line
          x1={xScale(demand[0].q)}
          y1={yScale(demand[0].p)}
          x2={xScale(demand[1].q)}
          y2={yScale(demand[1].p)}
          stroke="#1e40af"
          strokeWidth={2.5}
        />
        <text x={xScale(demand[1].q) - 5} y={yScale(demand[1].p) - 5} textAnchor="end" fontSize="11" fill="#1e40af">Demand</text>

        {/* Supply */}
        <line
          x1={xScale(supply[0].q)}
          y1={yScale(supply[0].p)}
          x2={xScale(supply[1].q)}
          y2={yScale(supply[1].p)}
          stroke="#dc2626"
          strokeWidth={2.5}
        />
        <text x={xScale(supply[1].q) - 5} y={yScale(supply[1].p) - 5} textAnchor="end" fontSize="11" fill="#dc2626">Supply</text>

        {/* Clearing point */}
        <line x1={xScale(qStar)} y1={H - pad.bottom} x2={xScale(qStar)} y2={yScale(pStar)} stroke="#444" strokeDasharray="3 3" />
        <line x1={pad.left} y1={yScale(pStar)} x2={xScale(qStar)} y2={yScale(pStar)} stroke="#444" strokeDasharray="3 3" />
        <circle cx={xScale(qStar)} cy={yScale(pStar)} r={6} fill="#444" />
        <text x={xScale(qStar) + 10} y={yScale(pStar) - 8} fontSize="11" fill="#444" fontWeight="bold">
          ({qStar.toFixed(1)}, ${pStar.toFixed(1)})
        </text>
      </svg>
      <p className="text-xs text-ink/60 mt-2 italic">
        Equilibrium: q* = {qStar.toFixed(2)}, p* = ${pStar.toFixed(2)}. Shifting demand or supply moves the clearing point — but the price still clears at the margin.
      </p>
    </div>
  );
}
