interface Props {
  points: string[];
}

/**
 * Closing recap with 3-5 retrieval-framed bullets. Re-stated as if the reader
 * is recalling, not being told. Triggers a final consolidation pass.
 */
export default function LessonRecap({ points }: Props) {
  return (
    <aside className="my-8 border border-rule rounded-lg bg-ink/[0.03] p-5">
      <h3 className="text-xs uppercase tracking-wide font-semibold text-ink/70 mb-3 mt-0">
        Recap — should be retrievable now
      </h3>
      <ol className="space-y-2 list-none pl-0">
        {points.map((p, i) => (
          <li key={i} className="flex gap-3 my-0">
            <span className="font-mono text-ink/40 tabular-nums">{i + 1}</span>
            <span>{p}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
