import { useState } from "react";

type Unknown = "real" | "nominal" | "inflation";

/**
 * Fisher-equation interactive calculator: (1 + nominal) = (1 + real) × (1 + inflation).
 * Pick which variable is the unknown; the other two are inputs.
 */
export default function FisherCalculator() {
  const [unknown, setUnknown] = useState<Unknown>("real");
  const [nominal, setNominal] = useState(8);
  const [inflation, setInflation] = useState(3);
  const [real, setReal] = useState(5);

  function computed() {
    switch (unknown) {
      case "real":
        return ((1 + nominal / 100) / (1 + inflation / 100) - 1) * 100;
      case "nominal":
        return ((1 + real / 100) * (1 + inflation / 100) - 1) * 100;
      case "inflation":
        return ((1 + nominal / 100) / (1 + real / 100) - 1) * 100;
    }
  }

  const out = computed();

  return (
    <div className="my-6 border border-rule rounded-lg p-5 bg-paper">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-ink/70 mb-4 mt-0">
        Fisher equation — pick which is unknown
      </h4>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {(["real", "nominal", "inflation"] as Unknown[]).map((k) => (
          <button
            key={k}
            onClick={() => setUnknown(k)}
            className={`text-sm rounded border py-2 capitalize ${
              unknown === k ? "border-accent bg-accent/10 text-accent font-semibold" : "border-rule hover:border-ink/40"
            }`}
          >
            Solve for {k}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <NumField label="Nominal %" value={nominal} onChange={setNominal} disabled={unknown === "nominal"} />
        <NumField label="Inflation %" value={inflation} onChange={setInflation} disabled={unknown === "inflation"} />
        <NumField label="Real %" value={real} onChange={setReal} disabled={unknown === "real"} />
      </div>
      <div className="mt-4 text-center">
        <div className="text-xs uppercase text-ink/60 tracking-wide">{unknown} =</div>
        <div className="text-3xl font-bold font-mono tabular-nums text-accent">{out.toFixed(2)}%</div>
        <p className="text-xs text-ink/60 mt-1 italic">
          Exact form: (1 + nominal) = (1 + real) × (1 + inflation). Notice it stops being well-approximated by simple subtraction once inflation gets above ~5%.
        </p>
      </div>
    </div>
  );
}

function NumField({ label, value, onChange, disabled }: { label: string; value: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-ink/60 text-xs">{label}</span>
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        disabled={disabled}
        className={`border rounded px-3 py-2 font-mono ${
          disabled ? "bg-ink/[0.04] text-ink/50 border-rule" : "border-rule"
        }`}
      />
    </label>
  );
}
