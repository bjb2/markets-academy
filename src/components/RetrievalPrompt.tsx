import { useState } from "react";

interface Props {
  prompt: string;
  reveal: string;
  children?: React.ReactNode;
}

/**
 * Cold-recall prompt at the top of a lesson. Forces the learner to attempt
 * an answer from memory before reading the lesson body — the retrieval-practice
 * principle: encoding is stronger when paired with effortful recall.
 */
export default function RetrievalPrompt({ prompt, reveal, children }: Props) {
  const [show, setShow] = useState(false);
  return (
    <aside className="my-6 border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r">
      <p className="text-xs uppercase tracking-wide text-amber-800 font-semibold mb-2">
        Before you start — try from memory
      </p>
      <p className="text-ink/90 mb-3 font-medium">{prompt}</p>
      {children && <div className="text-sm text-ink/70 mb-3">{children}</div>}
      {!show ? (
        <button
          onClick={() => setShow(true)}
          className="text-sm text-amber-900 underline underline-offset-2 hover:no-underline"
        >
          Show what's coming →
        </button>
      ) : (
        <div className="text-sm text-ink/80 bg-paper rounded p-3 border border-amber-200">
          <p className="text-xs uppercase tracking-wide text-amber-800 mb-1">What we're heading toward</p>
          <p>{reveal}</p>
        </div>
      )}
    </aside>
  );
}
