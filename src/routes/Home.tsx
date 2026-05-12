import { Link } from "react-router-dom";
import { manifest, lessonsForLayer } from "../lib/manifest";
import { layerMastery, isLessonComplete } from "../lib/progress";
import MasteryBar from "../components/MasteryBar";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold tracking-tight mb-2">Markets Academy</h1>
      <p className="text-ink/70 mb-10">
        Eleven layers, macro → micro → execution. Free sources only. The point is
        sequencing and verification, not link curation.
      </p>

      <div className="space-y-3">
        {manifest.layers.map((layer) => {
          const lessons = lessonsForLayer(layer.id);
          const counts = Object.fromEntries(lessons.map((l) => [l.id, l.exerciseCount]));
          const mastery = layerMastery(lessons.map((l) => l.id), counts);
          const completedCount = lessons.filter((l) => isLessonComplete(l.id)).length;
          const locked = layer.id > 0 && layerMasteryLocked(layer.id);

          return (
            <Link
              key={layer.id}
              to={locked ? "#" : `/layer/${layer.id}`}
              className={`block border border-rule rounded-lg p-5 transition-colors ${
                locked ? "opacity-50 cursor-not-allowed" : "hover:border-ink/40 hover:bg-ink/[0.02]"
              }`}
              onClick={(e) => locked && e.preventDefault()}
            >
              <div className="flex items-baseline justify-between mb-1">
                <h2 className="font-semibold tracking-tight">
                  <span className="text-ink/40 mr-3 font-mono">{String(layer.id).padStart(2, "0")}</span>
                  {layer.title}
                  {locked && <span className="ml-2 text-xs text-ink/40">🔒 prereq pending</span>}
                </h2>
                <span className="text-xs text-ink/60">{layer.estWeeks}</span>
              </div>
              <p className="text-sm text-ink/70 mb-3">{layer.subtitle}</p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <MasteryBar value={mastery} />
                </div>
                <span className="text-xs text-ink/60 font-mono">
                  {completedCount}/{lessons.length}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function layerMasteryLocked(layerId: number): boolean {
  if (layerId === 0) return false;
  const prev = lessonsForLayer(layerId - 1);
  if (prev.length === 0) return false;
  const counts = Object.fromEntries(prev.map((l) => [l.id, l.exerciseCount]));
  return layerMastery(prev.map((l) => l.id), counts) < 0.8;
}
