import { useEffect, useMemo, useState, Suspense, lazy } from "react";
import type { ComponentType } from "react";
import { Link, useParams } from "react-router-dom";
import { getLesson, getLayer, nextLesson } from "../lib/manifest";
import { mastery as masteryFor, markLessonComplete, isLessonComplete } from "../lib/progress";
import { lessonModules } from "../content/lessonLoader";
import MasteryBar from "../components/MasteryBar";

export default function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const layer = lesson ? getLayer(lesson.layer) : undefined;
  const next = lessonId ? nextLesson(lessonId) : undefined;
  const [, force] = useState(0);

  const MDX = useMemo<ComponentType | null>(() => {
    if (!lessonId) return null;
    const loader = lessonModules[lessonId];
    if (!loader) return null;
    return lazy(loader);
  }, [lessonId]);

  // Refresh mastery bar after exercise submissions (recordAttempt mutates localStorage)
  useEffect(() => {
    const id = window.setInterval(() => force((n) => n + 1), 2000);
    return () => window.clearInterval(id);
  }, []);

  if (!lesson || !layer) {
    return <div className="max-w-3xl mx-auto px-6 py-10">Lesson not found.</div>;
  }

  const m = masteryFor(lesson.id, lesson.exerciseCount);
  const done = isLessonComplete(lesson.id);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to={`/layer/${layer.id}`} className="text-sm text-ink/60 hover:text-ink">
        ← {layer.title}
      </Link>
      <h1 className="text-3xl font-bold tracking-tight mt-3 mb-2">{lesson.title}</h1>
      <div className="max-w-md mb-8">
        <MasteryBar value={m} />
      </div>

      <article className="prose">
        {MDX ? (
          <Suspense fallback={<p className="text-ink/60">Loading lesson…</p>}>
            <MDX />
          </Suspense>
        ) : (
          <p className="text-ink/60">Lesson body not yet written.</p>
        )}
      </article>

      <div className="mt-10 pt-6 border-t border-rule flex items-center justify-between">
        <div>
          {!done && m >= 0.8 && (
            <button
              className="px-4 py-2 bg-green-700 text-paper rounded text-sm"
              onClick={() => {
                markLessonComplete(lesson.id);
                force((n) => n + 1);
              }}
            >
              Mark complete
            </button>
          )}
          {done && <span className="text-green-700 text-sm">✓ Completed</span>}
        </div>
        {next && (
          <Link to={`/lesson/${next.id}`} className="text-accent hover:underline text-sm">
            Next: {next.title} →
          </Link>
        )}
      </div>
    </div>
  );
}
