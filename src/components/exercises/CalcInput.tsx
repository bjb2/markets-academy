import { useState } from "react";
import type { CalcInputExercise } from "../../lib/types";
import { recordAttempt } from "../../lib/progress";

interface Props {
  ex: CalcInputExercise;
  lessonId: string;
}

export default function CalcInput({ ex, lessonId }: Props) {
  const [val, setVal] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  function submit() {
    const num = parseFloat(val);
    if (Number.isNaN(num)) return;
    const isCorrect = Math.abs(num - ex.expected) <= ex.tolerance;
    recordAttempt(lessonId, ex.id, isCorrect);
    setCorrect(isCorrect);
    setSubmitted(true);
  }

  function retry() {
    setSubmitted(false);
    setVal("");
  }

  return (
    <div>
      <p className="font-medium mb-3">{ex.prompt}</p>
      <div className="flex items-baseline gap-2">
        <input
          type="number"
          step="any"
          inputMode="decimal"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          disabled={submitted}
          className="border border-rule rounded px-3 py-2 w-40 font-mono"
          placeholder="answer"
        />
        {ex.unit && <span className="text-ink/60">{ex.unit}</span>}
        {!submitted && (
          <button
            className="ml-2 px-4 py-2 bg-ink text-paper rounded text-sm disabled:opacity-30"
            disabled={val === ""}
            onClick={submit}
          >
            Submit
          </button>
        )}
      </div>
      {submitted && (
        <div className="mt-4 text-sm">
          <p className={correct ? "text-green-700" : "text-red-700"}>
            {correct
              ? `Correct.`
              : `Off. Expected ${ex.expected}${ex.unit ? " " + ex.unit : ""} (±${ex.tolerance}).`}
          </p>
          {ex.explanation && <p className="mt-2 text-ink/80">{ex.explanation}</p>}
          {!correct && (
            <button onClick={retry} className="mt-3 underline text-ink/70">
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
