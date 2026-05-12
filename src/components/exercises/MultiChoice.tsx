import { useState } from "react";
import type { MultiChoiceExercise } from "../../lib/types";
import { recordAttempt } from "../../lib/progress";

interface Props {
  ex: MultiChoiceExercise;
  lessonId: string;
}

export default function MultiChoice({ ex, lessonId }: Props) {
  const [pick, setPick] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (pick === null) return;
    recordAttempt(lessonId, ex.id, pick === ex.correctIndex);
    setSubmitted(true);
  }

  function retry() {
    setSubmitted(false);
    setPick(null);
  }

  const correct = submitted && pick === ex.correctIndex;

  return (
    <div>
      <p className="font-medium mb-3">{ex.prompt}</p>
      <ul className="space-y-2">
        {ex.choices.map((c, i) => {
          const isPick = pick === i;
          const isAnswer = i === ex.correctIndex;
          const style = submitted
            ? isAnswer
              ? "border-green-600 bg-green-50"
              : isPick
              ? "border-red-600 bg-red-50"
              : "border-rule"
            : isPick
            ? "border-accent bg-accent/5"
            : "border-rule hover:border-ink/40";
          return (
            <li key={i}>
              <button
                className={`w-full text-left border rounded px-3 py-2 transition-colors ${style}`}
                onClick={() => !submitted && setPick(i)}
                disabled={submitted}
              >
                {c}
              </button>
            </li>
          );
        })}
      </ul>
      {!submitted && (
        <button
          className="mt-4 px-4 py-2 bg-ink text-paper rounded text-sm disabled:opacity-30"
          disabled={pick === null}
          onClick={submit}
        >
          Submit
        </button>
      )}
      {submitted && (
        <div className="mt-4 text-sm">
          <p className={correct ? "text-green-700" : "text-red-700"}>
            {correct ? "Correct." : "Not quite."}
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
