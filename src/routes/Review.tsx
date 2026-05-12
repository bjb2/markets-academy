import { Link } from "react-router-dom";
import { dueForReview } from "../lib/progress";
import { getLesson } from "../lib/manifest";

export default function Review() {
  const due = dueForReview();
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-3">Review queue</h1>
      <p className="text-ink/70 mb-8">
        Spaced repetition over exercises you've answered. Items become due based on SM-2 scheduling.
      </p>
      {due.length === 0 ? (
        <p className="text-ink/60">Nothing due. Come back after more lessons.</p>
      ) : (
        <ul className="space-y-2">
          {due.map((a) => {
            const lesson = getLesson(a.lessonId);
            if (!lesson) return null;
            return (
              <li key={a.exerciseId}>
                <Link
                  to={`/lesson/${a.lessonId}`}
                  className="block border border-rule rounded px-4 py-3 hover:border-ink/40"
                >
                  <div className="font-medium">{lesson.title}</div>
                  <div className="text-xs text-ink/60 mt-1">
                    exercise {a.exerciseId} · reps {a.srs.reps} · interval {a.srs.interval}d
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
