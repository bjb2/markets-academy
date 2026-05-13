import { useState, useMemo } from "react";

// 10-year semi-annual coupon bond, face = 100. Drag YTM, watch price.
// Also computes Macaulay duration and modified duration so 2.6 can reuse.
const FACE = 100;
const COUPON_RATE = 0.05; // 5% annual coupon
const YEARS = 10;
const FREQ = 2; // semi-annual

export default function BondPriceYield() {
  const [ytmPct, setYtmPct] = useState(5);

  const { price, macDur, modDur, convexity } = useMemo(() => {
    const y = ytmPct / 100;
    const c = (COUPON_RATE * FACE) / FREQ; // periodic coupon
    const yPer = y / FREQ;
    const n = YEARS * FREQ;

    let price = 0;
    let weightedTime = 0;
    let convex = 0;
    for (let t = 1; t <= n; t++) {
      const cf = t < n ? c : c + FACE;
      const pvf = cf / Math.pow(1 + yPer, t);
      price += pvf;
      const tYears = t / FREQ;
      weightedTime += tYears * pvf;
      convex += tYears * (tYears + 1 / FREQ) * pvf;
    }
    const macDur = weightedTime / price;
    const modDur = macDur / (1 + yPer);
    const convexity = convex / (price * Math.pow(1 + yPer, 2));
    return { price, macDur, modDur, convexity };
  }, [ytmPct]);

  // Curve: sweep YTM 0-15%, plot price
  const curve = useMemo(() => {
    const points: { y: number; p: number }[] = [];
    for (let yp = 0.5; yp <= 15.01; yp += 0.25) {
      const y = yp / 100;
      const c = (COUPON_RATE * FACE) / FREQ;
      const yPer = y / FREQ;
      const n = YEARS * FREQ;
      let p = 0;
      for (let t = 1; t <= n; t++) {
        const cf = t < n ? c : c + FACE;
        p += cf / Math.pow(1 + yPer, t);
      }
      points.push({ y: yp, p });
    }
    return points;
  }, []);

  const W = 600;
  const H = 320;
  const pad = { top: 20, right: 30, bottom: 50, left: 70 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const xMin = 0;
  const xMax = 15;
  const yMin = Math.min(...curve.map((c) => c.p)) * 0.95;
  const yMax = Math.max(...curve.map((c) => c.p)) * 1.05;
  const xScale = (v: number) => pad.left + ((v - xMin) / (xMax - xMin)) * innerW;
  const yScale = (v: number) => pad.top + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  const pathD = curve
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${xScale(pt.y).toFixed(2)} ${yScale(pt.p).toFixed(2)}`)
    .join(" ");

  const premium = price > FACE;
  const discount = price < FACE;

  return (
    <div className="my-6 border border-rule rounded-lg p-5 bg-paper">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-ink/70 mb-4 mt-0">
        10-year, 5% semi-annual coupon, face $100 — drag YTM
      </h4>
      <div className="mb-3 text-sm">
        <label className="flex flex-col">
          <span className="text-ink/70 flex justify-between">
            Yield to maturity (YTM)
            <span className="font-mono">{ytmPct.toFixed(2)}%</span>
          </span>
          <input
            type="range"
            min={0.5}
            max={15}
            step={0.05}
            value={ytmPct}
            onChange={(e) => setYtmPct(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={H - pad.bottom} stroke="#888" />
        <line x1={pad.left} y1={H - pad.bottom} x2={W - pad.right} y2={H - pad.bottom} stroke="#888" />
        {[0, 3, 6, 9, 12, 15].map((v) => (
          <g key={v}>
            <line x1={xScale(v)} y1={H - pad.bottom} x2={xScale(v)} y2={H - pad.bottom + 4} stroke="#888" />
            <text x={xScale(v)} y={H - pad.bottom + 16} textAnchor="middle" fontSize="10" fill="#6b6b6b">
              {v}%
            </text>
          </g>
        ))}
        {[60, 80, 100, 120, 140].map((v) => (
          <g key={v}>
            <line x1={pad.left - 4} y1={yScale(v)} x2={pad.left} y2={yScale(v)} stroke="#888" />
            <text x={pad.left - 8} y={yScale(v) + 4} textAnchor="end" fontSize="10" fill="#6b6b6b">
              ${v}
            </text>
          </g>
        ))}
        <text x={pad.left + innerW / 2} y={H - 10} textAnchor="middle" fontSize="11" fill="#6b6b6b">
          YTM
        </text>
        <text x={pad.left - 55} y={pad.top + innerH / 2} fontSize="11" fill="#6b6b6b" transform={`rotate(-90 ${pad.left - 55} ${pad.top + innerH / 2})`}>
          Price
        </text>

        {/* Par line at face = 100 */}
        <line x1={pad.left} y1={yScale(FACE)} x2={W - pad.right} y2={yScale(FACE)} stroke="#aaa" strokeDasharray="3 3" />
        <text x={W - pad.right - 4} y={yScale(FACE) - 4} textAnchor="end" fontSize="10" fill="#888">
          par
        </text>

        {/* Curve */}
        <path d={pathD} fill="none" stroke="#1e40af" strokeWidth={2.5} />

        {/* Current point */}
        <circle cx={xScale(ytmPct)} cy={yScale(price)} r={6} fill="#dc2626" />
        <text x={xScale(ytmPct) + 8} y={yScale(price) - 8} fontSize="11" fill="#dc2626" fontWeight="bold">
          ${price.toFixed(2)}
        </text>
      </svg>
      <div className="text-xs text-ink/70 mt-2 font-mono grid grid-cols-2 gap-2">
        <div>Price: ${price.toFixed(3)} {premium && "(premium)"} {discount && "(discount)"}</div>
        <div>Macaulay duration: {macDur.toFixed(2)} yrs</div>
        <div>Modified duration: {modDur.toFixed(2)}</div>
        <div>Convexity: {convexity.toFixed(2)}</div>
      </div>
      <p className="text-xs text-ink/60 mt-2 italic">
        Price moves opposite to yield. When YTM equals the coupon (5%), price equals face ($100). Higher yield, lower price; lower yield, higher price. Modified duration estimates the % price change for a 100 bp yield move. Convexity is the curvature: actual price moves are LESS painful than modified duration predicts (for both rises and falls), thanks to the curve's bow.
      </p>
    </div>
  );
}
