import { useState } from "react";
import type { FreeTextExercise } from "../../lib/types";
import { recordAttempt } from "../../lib/progress";

interface Props {
  ex: FreeTextExercise;
  lessonId: string;
}

export default function FreeText({ ex, lessonId }: Props) {
  const [val, setVal] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (val.trim().length < 10) return;
    // Self-graded against rubricKeywords if present.
    const text = val.toLowerCase();
    const hits = (ex.rubricKeywords ?? []).filter((k) =>
      text.includes(k.toLowerCase()),
    ).length;
    const needed = Math.ceil((ex.rubricKeywords?.length ?? 0) * 0.5);
    const correct = ex.rubricKeywords && ex.rubricKeywords.length > 0 ? hits >= needed : true;
    recordAttempt(lessonId, ex.id, correct);
    setSubmitted(true);
  }

  return (
    <div>
      <p className="font-medium mb-3">{ex.prompt}</p>
      <textarea
        className="w-full border border-rule rounded px-3 py-2 font-mono text-sm"
        rows={5}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        disabled={submitted}
        placeholder="Your answer…"
      />
      {!submitted && (
        <button
          className="mt-3 px-4 py-2 bg-ink text-paper rounded text-sm disabled:opacity-30"
          disabled={val.trim().length < 10}
          onClick={submit}
        >
          Submit
        </button>
      )}
      {submitted && (
        <div className="mt-4 text-sm space-y-3">
          <p className="text-ink/60 uppercase text-xs tracking-wide">Reference answer</p>
          <p className="text-ink/90 whitespace-pre-wrap">{ex.reference}</p>
          <p className="text-ink/60 text-xs italic">
            Free-text exercises are self-checked. Compare your answer to the reference. If they overlap on the main idea, mark yourself correct mentally and move on.
          </p>
        </div>
      )}
    </div>
  );
}
