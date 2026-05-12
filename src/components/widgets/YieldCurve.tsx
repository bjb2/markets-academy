import { useState } from "react";

interface Point {
  label: string;
  maturityYears: number;
  yield: number;
}

const initial: Point[] = [
  { label: "3M", maturityYears: 0.25, yield: 4.5 },
  { label: "2Y", maturityYears: 2, yield: 4.2 },
  { label: "5Y", maturityYears: 5, yield: 4.0 },
  { label: "10Y", maturityYears: 10, yield: 4.3 },
  { label: "30Y", maturityYears: 30, yield: 4.6 },
];

export default function YieldCurve() {
  const [points, setPoints] = useState<Point[]>(initial);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const W = 600;
  const H = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const innerW = W - padding.left - padding.right;
  const innerH = H - padding.top - padding.bottom;
  const yMin = 0;
  const yMax = 8;
  const xMax = 30;

  const xScale = (years: number) => padding.left + Math.log(years + 0.1) / Math.log(xMax + 0.1) * innerW;
  const yScale = (yield_: number) => padding.top + innerH - ((yield_ - yMin) / (yMax - yMin)) * innerH;

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.maturityYears).toFixed(1)} ${yScale(p.yield).toFixed(1)}`).join(" ");

  const spread2s10s = points[3].yield - points[1].yield;
  let shape = "Normal";
  if (Math.abs(spread2s10s) < 0.1) shape = "Flat";
  else if (spread2s10s < 0) shape = "Inverted";
  const humped = points[2].yield > Math.max(points[0].yield, points[4].yield) + 0.1;
  if (humped) shape = "Humped";

  function onPointerMove(e: React.PointerEvent<SVGElement>) {
    if (draggingIdx === null) return;
    const svg = e.currentTarget.ownerSVGElement!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const { y } = pt.matrixTransform(ctm.inverse());
    const newYield = Math.max(yMin, Math.min(yMax, ((padding.top + innerH - y) / innerH) * (yMax - yMin) + yMin));
    setPoints((prev) => prev.map((p, i) => (i === draggingIdx ? { ...p, yield: Math.round(newYield * 10) / 10 } : p)));
  }

  return (
    <div className="my-6 border border-rule rounded-lg p-5 bg-paper">
      <div className="flex justify-between items-baseline mb-3">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-ink/70 mt-0">
          Yield curve — drag points
        </h4>
        <span className={`text-sm font-mono px-2 py-0.5 rounded ${
          shape === "Inverted" ? "bg-red-100 text-red-800" :
          shape === "Flat" ? "bg-amber-100 text-amber-800" :
          shape === "Humped" ? "bg-purple-100 text-purple-800" :
          "bg-green-100 text-green-800"
        }`}>
          {shape}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none touch-none"
        onPointerMove={onPointerMove}
        onPointerUp={() => setDraggingIdx(null)}
        onPointerLeave={() => setDraggingIdx(null)}
      >
        {/* Grid */}
        {[0, 2, 4, 6, 8].map((y) => (
          <g key={y}>
            <line x1={padding.left} y1={yScale(y)} x2={W - padding.right} y2={yScale(y)} stroke="#e5e2d8" strokeDasharray="2 4" />
            <text x={padding.left - 8} y={yScale(y) + 4} textAnchor="end" fontSize="10" fill="#6b6b6b">{y}%</text>
          </g>
        ))}
        {/* X labels */}
        {points.map((p) => (
          <text key={p.label} x={xScale(p.maturityYears)} y={H - padding.bottom + 18} textAnchor="middle" fontSize="11" fill="#6b6b6b">{p.label}</text>
        ))}
        <path d={path} fill="none" stroke="#1e40af" strokeWidth={2.5} />
        {points.map((p, i) => (
          <circle
            key={p.label}
            cx={xScale(p.maturityYears)}
            cy={yScale(p.yield)}
            r={9}
            fill="#1e40af"
            stroke="white"
            strokeWidth={2}
            style={{ cursor: "ns-resize" }}
            onPointerDown={() => setDraggingIdx(i)}
          />
        ))}
        {points.map((p) => (
          <text key={`y-${p.label}`} x={xScale(p.maturityYears)} y={yScale(p.yield) - 14} textAnchor="middle" fontSize="10" fill="#1e40af" fontWeight="bold">{p.yield.toFixed(1)}%</text>
        ))}
      </svg>
      <p className="text-xs text-ink/60 mt-3 italic">
        2s10s spread: <span className="font-mono">{(spread2s10s * 100).toFixed(0)} bps</span>. Drag the 10Y below the 2Y to invert.
      </p>
    </div>
  );
}
