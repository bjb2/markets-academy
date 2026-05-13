const KEY = "markets-academy:v1";

export interface AttemptRecord {
  exerciseId: string;
  lessonId: string;
  firstAttemptCorrect: boolean;
  attempts: number;
  lastAttemptAt: number;
  /** SM-2 spaced-repetition state */
  srs: {
    interval: number; // days
    easeFactor: number;
    nextReviewAt: number; // epoch ms
    reps: number;
  };
}

export interface LessonProgress {
  lessonId: string;
  startedAt: number;
  completedAt: number | null;
  exerciseAttempts: Record<string, AttemptRecord>;
}

export interface ProgressState {
  version: 1;
  lessons: Record<string, LessonProgress>;
}

function defaultState(): ProgressState {
  return { version: 1, lessons: {} };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as ProgressState;
    if (parsed.version !== 1) return defaultState();
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveProgress(state: ProgressState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function exportProgress(): string {
  return JSON.stringify(loadProgress(), null, 2);
}

export function importProgress(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as ProgressState;
    if (parsed.version !== 1) return false;
    saveProgress(parsed);
    return true;
  } catch {
    return false;
  }
}

export function resetProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function recordAttempt(
  lessonId: string,
  exerciseId: string,
  correct: boolean,
): AttemptRecord {
  const state = loadProgress();
  const lesson = state.lessons[lessonId] ?? {
    lessonId,
    startedAt: Date.now(),
    completedAt: null,
    exerciseAttempts: {},
  };
  const existing = lesson.exerciseAttempts[exerciseId];
  const isFirst = !existing;
  const firstAttemptCorrect = isFirst ? correct : existing.firstAttemptCorrect;
  const attempts = (existing?.attempts ?? 0) + 1;
  const srs = updateSrs(existing?.srs, correct);
  const record: AttemptRecord = {
    exerciseId,
    lessonId,
    firstAttemptCorrect,
    attempts,
    lastAttemptAt: Date.now(),
    srs,
  };
  lesson.exerciseAttempts[exerciseId] = record;
  state.lessons[lessonId] = lesson;
  saveProgress(state);
  return record;
}

export function markLessonComplete(lessonId: string) {
  const state = loadProgress();
  const lesson = state.lessons[lessonId];
  if (!lesson) return;
  lesson.completedAt = Date.now();
  state.lessons[lessonId] = lesson;
  saveProgress(state);
}

export function mastery(lessonId: string, totalExercises: number): number {
  const state = loadProgress();
  const lesson = state.lessons[lessonId];
  if (!lesson || totalExercises === 0) return 0;
  let score = 0;
  for (const att of Object.values(lesson.exerciseAttempts)) {
    // Full credit if first try was right OR most recent try was right (srs.reps resets to 0 on wrong, so reps > 0 means currently correct).
    if (att.firstAttemptCorrect || att.srs.reps > 0) score += 1;
    else if (att.attempts > 0) score += 0.5;
  }
  return Math.min(1, score / totalExercises);
}

export function isLessonComplete(lessonId: string): boolean {
  return loadProgress().lessons[lessonId]?.completedAt != null;
}

export function layerMastery(lessonIds: string[], exerciseCountsByLesson: Record<string, number>): number {
  if (lessonIds.length === 0) return 0;
  const sum = lessonIds.reduce((acc, id) => acc + mastery(id, exerciseCountsByLesson[id] ?? 1), 0);
  return sum / lessonIds.length;
}

/** SM-2 spaced repetition (simplified). */
function updateSrs(prev: AttemptRecord["srs"] | undefined, correct: boolean): AttemptRecord["srs"] {
  const day = 24 * 60 * 60 * 1000;
  const base = prev ?? { interval: 0, easeFactor: 2.5, nextReviewAt: Date.now(), reps: 0 };
  const quality = correct ? 5 : 2;
  let { interval, easeFactor, reps } = base;
  if (quality < 3) {
    reps = 0;
    interval = 1;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  }
  return {
    interval,
    easeFactor,
    reps,
    nextReviewAt: Date.now() + interval * day,
  };
}

export function dueForReview(): AttemptRecord[] {
  const state = loadProgress();
  const now = Date.now();
  const due: AttemptRecord[] = [];
  for (const lesson of Object.values(state.lessons)) {
    for (const att of Object.values(lesson.exerciseAttempts)) {
      if (att.srs.nextReviewAt <= now) due.push(att);
    }
  }
  return due.sort((a, b) => a.srs.nextReviewAt - b.srs.nextReviewAt);
}
