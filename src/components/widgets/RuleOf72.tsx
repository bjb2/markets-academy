import { useState } from "react";

/**
 * Side-by-side Rule of 72 approximation vs exact. Shows when the rule
 * works (typical rates) and when it strains (very low or very high rates).
 */
export default function RuleOf72() {
  const [rate, setRate] = useState(8);

  const approx = 72 / rate;
  const exact = Math.log(2) / Math.log(1 + rate / 100);
  const err = ((approx - exact) / exact) * 100;

  // Table sweep
  const rates = [2, 4, 6, 8, 10, 12, 15, 20];

  return (
    <div className="my-6 border border-rule rounded-lg p-5 bg-paper">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-ink/70 mb-4 mt-0">
        Rule of 72 — approximation vs exact
      </h4>
      <label className="flex items-baseline justify-between gap-3 mb-3 text-sm">
        <span className="text-ink/70">Annual return</span>
        <span className="font-mono">{rate}%</span>
      </label>
      <input
        type="range"
        min={1}
        max={25}
        step={0.5}
        value={rate}
        onChange={(e) => setRate(parseFloat(e.target.value))}
        className="w-full mb-4"
      />
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-xs text-ink/60 uppercase tracking-wide">Rule of 72</div>
          <div className="text-2xl font-bold font-mono">{approx.toFixed(2)}</div>
          <div className="text-xs text-ink/60">years</div>
        </div>
        <div>
          <div className="text-xs text-ink/60 uppercase tracking-wide">Exact</div>
          <div className="text-2xl font-bold font-mono">{exact.toFixed(2)}</div>
          <div className="text-xs text-ink/60">years</div>
        </div>
        <div>
          <div className="text-xs text-ink/60 uppercase tracking-wide">Error</div>
          <div className={`text-2xl font-bold font-mono ${Math.abs(err) < 3 ? "text-green-700" : Math.abs(err) < 8 ? "text-amber-700" : "text-red-700"}`}>
            {err >= 0 ? "+" : ""}{err.toFixed(1)}%
          </div>
        </div>
      </div>
      <details className="mt-5 text-sm">
        <summary className="cursor-pointer text-ink/70 hover:text-ink">Sweep across typical rates →</summary>
        <table className="w-full mt-3 text-sm">
          <thead>
            <tr className="text-left text-xs text-ink/60 border-b border-rule">
              <th className="py-1">Rate</th>
              <th className="py-1">Rule of 72</th>
              <th className="py-1">Exact</th>
              <th className="py-1">Error</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((r) => {
              const a = 72 / r;
              const e = Math.log(2) / Math.log(1 + r / 100);
              const err2 = ((a - e) / e) * 100;
              return (
                <tr key={r} className="border-b border-rule/40">
                  <td className="py-1 font-mono">{r}%</td>
                  <td className="py-1 font-mono">{a.toFixed(2)}</td>
                  <td className="py-1 font-mono">{e.toFixed(2)}</td>
                  <td className={`py-1 font-mono ${Math.abs(err2) < 3 ? "text-green-700" : "text-amber-700"}`}>{err2 >= 0 ? "+" : ""}{err2.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
      <p className="text-xs text-ink/60 mt-3 italic">
        Useful enough to do in your head when someone is pitching you. Accurate to within a few percent for 4–15% — exactly the range that matters for portfolio math.
      </p>
    </div>
  );
}
