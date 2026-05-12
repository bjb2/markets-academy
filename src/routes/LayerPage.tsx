import { Link, useParams } from "react-router-dom";
import { getLayer, lessonsForLayer } from "../lib/manifest";
import { mastery as masteryFor, isLessonComplete } from "../lib/progress";
import MasteryBar from "../components/MasteryBar";

export default function LayerPage() {
  const { layerId } = useParams<{ layerId: string }>();
  const id = parseInt(layerId ?? "0", 10);
  const layer = getLayer(id);
  const lessons = lessonsForLayer(id);

  if (!layer) {
    return <div className="max-w-3xl mx-auto px-6 py-10">Layer not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/" className="text-sm text-ink/60 hover:text-ink">← all layers</Link>
      <h1 className="text-3xl font-bold tracking-tight mt-3 mb-2">
        <span className="text-ink/40 mr-3 font-mono">{String(layer.id).padStart(2, "0")}</span>
        {layer.title}
      </h1>
      <p className="text-ink/80 mb-2">{layer.subtitle}</p>
      <blockquote className="border-l-4 border-rule pl-4 italic text-ink/70 my-4">
        🎯 {layer.objective}
      </blockquote>
      <p className="text-sm text-ink/60 mb-8">Estimated: {layer.estWeeks}.</p>

      <ol className="space-y-2">
        {lessons.map((lesson, i) => {
          const m = masteryFor(lesson.id, lesson.exerciseCount);
          const done = isLessonComplete(lesson.id);
          return (
            <li key={lesson.id}>
              <Link
                to={`/lesson/${lesson.id}`}
                className="block border border-rule rounded-lg px-4 py-3 hover:border-ink/40 hover:bg-ink/[0.02]"
              >
                <div className="flex items-baseline justify-between mb-1">
                  <div className="font-medium">
                    <span className="text-ink/40 mr-3 font-mono text-sm">
                      {layer.id}.{i + 1}
                    </span>
                    {lesson.title}
                    {done && <span className="ml-2 text-green-700 text-xs">✓</span>}
                  </div>
                  <span className="text-xs text-ink/60">~{lesson.estMinutes}m</span>
                </div>
                <div className="ml-9 mt-2 max-w-md">
                  <MasteryBar value={m} />
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
