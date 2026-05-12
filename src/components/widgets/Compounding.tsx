import { useMemo, useState } from "react";

/**
 * Compounding widget. Drag years and rate, watch terminal value grow.
 * Dual-coding the exponential intuition that text alone can't deliver.
 */
export default function Compounding() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(30);

  const series = useMemo(() => {
    const arr: { year: number; value: number }[] = [];
    for (let y = 0; y <= years; y++) {
      arr.push({ year: y, value: principal * Math.pow(1 + rate / 100, y) });
    }
    return arr;
  }, [principal, rate, years]);

  const terminal = series[series.length - 1].value;
  const maxVal = series[series.length - 1].value;

  // SVG chart
  const W = 600;
  const H = 200;
  const padding = { top: 10, right: 10, bottom: 25, left: 50 };
  const innerW = W - padding.left - padding.right;
  const innerH = H - padding.top - padding.bottom;

  const path = series
    .map((d, i) => {
      const x = padding.left + (i / years) * innerW;
      const y = padding.top + innerH - (d.value / maxVal) * innerH;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div className="my-6 border border-rule rounded-lg p-5 bg-paper">
      <h4 className="text-sm font-semibold mb-4 mt-0 uppercase tracking-wide text-ink/70">
        Compounding — drag to feel it
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Slider label="Principal" value={principal} min={1000} max={100000} step={1000} onChange={setPrincipal} format={(v) => `$${v.toLocaleString()}`} />
        <Slider label="Annual return" value={rate} min={0} max={20} step={0.5} onChange={setRate} format={(v) => `${v}%`} />
        <Slider label="Years" value={years} min={1} max={50} step={1} onChange={setYears} />
      </div>
      <div className="flex items-baseline gap-4 mb-3">
        <span className="text-3xl font-bold tabular-nums">${Math.round(terminal).toLocaleString()}</span>
        <span className="text-sm text-ink/60">after {years} years</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
        <line x1={padding.left} y1={H - padding.bottom} x2={W - padding.right} y2={H - padding.bottom} stroke="#d8d4cb" />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={H - padding.bottom} stroke="#d8d4cb" />
        <path d={path} fill="none" stroke="#1e40af" strokeWidth={2} />
        <text x={padding.left - 5} y={padding.top + 5} textAnchor="end" fontSize="10" fill="#6b6b6b">${Math.round(maxVal).toLocaleString()}</text>
        <text x={padding.left - 5} y={H - padding.bottom + 4} textAnchor="end" fontSize="10" fill="#6b6b6b">${principal.toLocaleString()}</text>
        <text x={padding.left} y={H - padding.bottom + 18} fontSize="10" fill="#6b6b6b">year 0</text>
        <text x={W - padding.right} y={H - padding.bottom + 18} textAnchor="end" fontSize="10" fill="#6b6b6b">year {years}</text>
      </svg>
      <p className="text-xs text-ink/60 mt-2 italic">
        Notice: small changes in rate produce huge changes in terminal value when years are large. That's the only insight that matters.
      </p>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex justify-between text-ink/70">
        <span>{label}</span>
        <span className="font-mono tabular-nums">{format ? format(value) : value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </label>
  );
}
