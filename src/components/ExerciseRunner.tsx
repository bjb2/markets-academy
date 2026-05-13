import { useMemo, useState } from "react";
import type { Exercise } from "../lib/types";
import MultiChoice from "./exercises/MultiChoice";
import CalcInput from "./exercises/CalcInput";
import FreeText from "./exercises/FreeText";
import ReadPrimary from "./exercises/ReadPrimary";
import CodeExerciseView from "./exercises/CodeExerciseView";
import { exercisesForLesson } from "../content/exerciseLoader";

interface Props {
  lessonId: string;
}

export default function ExerciseRunner({ lessonId }: Props) {
  const exercises = useMemo<Exercise[]>(() => exercisesForLesson(lessonId), [lessonId]);
  const [idx, setIdx] = useState(0);

  if (exercises.length === 0) {
    return (
      <div className="my-6 border border-dashed border-rule rounded p-4 text-sm text-ink/60">
        No exercises yet for this lesson. (Stub.)
      </div>
    );
  }

  const ex = exercises[idx];

  return (
    <section className="my-8 border border-rule rounded-lg p-5 bg-paper shadow-sm">
      <header className="flex items-center justify-between mb-4 text-sm text-ink/60">
        <span>Exercise {idx + 1} / {exercises.length}</span>
        <span className="uppercase tracking-wide text-xs">{ex.kind}</span>
      </header>
      <ExerciseView key={ex.id} exercise={ex} lessonId={lessonId} />
      <nav className="mt-5 flex justify-between text-sm">
        <button
          className="text-ink/60 disabled:opacity-30"
          disabled={idx === 0}
          onClick={() => setIdx(idx - 1)}
        >
          ← previous
        </button>
        <button
          className="text-accent disabled:opacity-30"
          disabled={idx === exercises.length - 1}
          onClick={() => setIdx(idx + 1)}
        >
          next →
        </button>
      </nav>
    </section>
  );
}

function ExerciseView({ exercise, lessonId }: { exercise: Exercise; lessonId: string }) {
  switch (exercise.kind) {
    case "multi-choice":
      return <MultiChoice ex={exercise} lessonId={lessonId} />;
    case "calc-input":
      return <CalcInput ex={exercise} lessonId={lessonId} />;
    case "free-text":
      return <FreeText ex={exercise} lessonId={lessonId} />;
    case "read-primary":
      return <ReadPrimary ex={exercise} lessonId={lessonId} />;
    case "code":
      return <CodeExerciseView ex={exercise} lessonId={lessonId} />;
  }
}
