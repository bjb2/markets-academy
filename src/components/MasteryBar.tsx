interface Props {
  value: number; // 0..1
  label?: string;
}

export default function MasteryBar({ value, label }: Props) {
  const pct = Math.round(value * 100);
  const color = value >= 0.8 ? "bg-green-600" : value >= 0.5 ? "bg-amber-500" : "bg-rule";
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex-1 h-1.5 bg-ink/10 rounded overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-ink/60 font-mono tabular-nums w-10 text-right">{pct}%</span>
      {label && <span className="text-ink/60">{label}</span>}
    </div>
  );
}
