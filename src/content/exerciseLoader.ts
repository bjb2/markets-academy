/**
 * Exercise JSON loader. Eager — all exercise packs are loaded at build time.
 * Each pack lives at `content/exercises/<lessonId>.json` and is an array of Exercise.
 */
import type { Exercise } from "../lib/types";

const packs = import.meta.glob("./exercises/**/*.json", { eager: true }) as Record<
  string,
  { default: Exercise[] }
>;

const map: Record<string, Exercise[]> = {};
for (const [path, mod] of Object.entries(packs)) {
  const match = path.match(/\/([^/]+)\.json$/);
  if (!match) continue;
  map[match[1]] = mod.default;
}

export function exercisesForLesson(lessonId: string): Exercise[] {
  return map[lessonId] ?? [];
}
