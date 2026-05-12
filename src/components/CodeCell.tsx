import { useState } from "react";
import { runUserCode } from "../lib/pyodide";
import { recordAttempt } from "../lib/progress";

interface Props {
  exerciseId?: string;
  lessonId?: string;
  starter: string;
  tests?: string;
  hint?: string;
  packages?: string[];
}

export default function CodeCell({
  exerciseId,
  lessonId,
  starter,
  tests = "",
  hint,
  packages = [],
}: Props) {
  const [code, setCode] = useState(starter);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [passed, setPassed] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  async function run() {
    setRunning(true);
    setOutput("");
    setError("");
    setPassed(null);
    const result = await runUserCode(code, tests, packages);
    setOutput(result.output);
    setError(result.error ?? "");
    setPassed(result.testsPassed ?? result.ok);
    if (exerciseId && lessonId) {
      recordAttempt(lessonId, exerciseId, result.testsPassed ?? result.ok);
    }
    setRunning(false);
  }

  return (
    <div className="my-2 border border-rule rounded overflow-hidden bg-ink/[0.02]">
      <textarea
        className="w-full font-mono text-sm p-3 bg-ink text-paper resize-y min-h-[160px] outline-none"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
      />
      <div className="flex items-center gap-3 px-3 py-2 border-t border-rule text-sm bg-paper">
        <button
          className="px-3 py-1 bg-accent text-paper rounded disabled:opacity-40"
          disabled={running}
          onClick={run}
        >
          {running ? "running…" : "Run"}
        </button>
        {hint && (
          <button onClick={() => setShowHint(!showHint)} className="underline text-ink/60">
            {showHint ? "hide hint" : "hint"}
          </button>
        )}
        {passed === true && <span className="text-green-700">✓ tests passed</span>}
        {passed === false && <span className="text-red-700">✗ tests failed</span>}
      </div>
      {showHint && hint && (
        <div className="px-3 py-2 text-sm bg-amber-50 border-t border-amber-200 text-amber-900">
          {hint}
        </div>
      )}
      {(output || error) && (
        <pre className="px-3 py-2 text-xs font-mono whitespace-pre-wrap bg-paper border-t border-rule">
          {output}
          {error && <span className="text-red-700">{error}</span>}
        </pre>
      )}
    </div>
  );
}
