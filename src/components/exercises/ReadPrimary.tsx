import { useState } from "react";
import type { ReadPrimaryExercise } from "../../lib/types";
import { recordAttempt } from "../../lib/progress";

interface Props {
  ex: ReadPrimaryExercise;
  lessonId: string;
}

export default function ReadPrimary({ ex, lessonId }: Props) {
  const [val, setVal] = useState("");
  const [done, setDone] = useState(false);

  function submit() {
    if (val.trim().length < 20) return;
    recordAttempt(lessonId, ex.id, true);
    setDone(true);
  }

  return (
    <div>
      <p className="font-medium mb-3">{ex.prompt}</p>
      <a
        href={ex.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-3 py-2 border border-rule rounded mb-3 hover:bg-ink/5"
      >
        Open: {ex.title} ↗
      </a>
      <p className="text-sm text-ink/80 mb-2">{ex.reflectionPrompt}</p>
      <textarea
        className="w-full border border-rule rounded px-3 py-2 font-mono text-sm"
        rows={4}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        disabled={done}
        placeholder="One sentence is enough."
      />
      {!done && (
        <button
          className="mt-3 px-4 py-2 bg-ink text-paper rounded text-sm disabled:opacity-30"
          disabled={val.trim().length < 20}
          onClick={submit}
        >
          Mark read
        </button>
      )}
      {done && (
        <p className="mt-3 text-sm text-green-700">Logged. Move on when ready.</p>
      )}
    </div>
  );
}
