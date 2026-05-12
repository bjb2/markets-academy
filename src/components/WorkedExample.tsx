import { useState } from "react";

interface Step {
  label: string;
  body: React.ReactNode;
}

interface Props {
  title: string;
  problem: React.ReactNode;
  steps: Step[];
}

/**
 * Worked-example component (Sweller's cognitive load theory). Shows a problem,
 * then the full solution path one step at a time. Novices learn structural
 * patterns better from worked examples than from unscaffolded problem-solving.
 */
export default function WorkedExample({ title, problem, steps }: Props) {
  const [revealed, setRevealed] = useState(0);

  return (
    <section className="my-6 border border-rule rounded-lg overflow-hidden">
      <header className="bg-ink/[0.04] px-4 py-2 border-b border-rule">
        <span className="text-xs uppercase tracking-wide text-ink/60 font-semibold">
          Worked example
        </span>
        <h4 className="font-semibold mt-0 mb-0">{title}</h4>
      </header>
      <div className="px-5 py-4">
        <div className="text-ink/90 mb-4">
          <strong>Problem:</strong> {problem}
        </div>
        <ol className="space-y-3 list-none pl-0">
          {steps.slice(0, revealed).map((step, i) => (
            <li key={i} className="flex gap-3 my-0">
              <span className="font-mono text-accent tabular-nums">{i + 1}.</span>
              <div>
                <div className="font-semibold text-sm text-ink/80">{step.label}</div>
                <div className="text-ink/90 mt-1">{step.body}</div>
              </div>
            </li>
          ))}
        </ol>
        {revealed < steps.length && (
          <button
            onClick={() => setRevealed(revealed + 1)}
            className="mt-4 text-sm text-accent underline underline-offset-2 hover:no-underline"
          >
            Reveal step {revealed + 1} →
          </button>
        )}
        {revealed === steps.length && (
          <p className="mt-4 text-sm text-green-700">All steps revealed.</p>
        )}
      </div>
    </section>
  );
}
