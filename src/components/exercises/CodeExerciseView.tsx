import type { CodeExercise } from "../../lib/types";
import CodeCell from "../CodeCell";

interface Props {
  ex: CodeExercise;
  lessonId: string;
}

export default function CodeExerciseView({ ex, lessonId }: Props) {
  return (
    <div>
      <p className="font-medium mb-3">{ex.prompt}</p>
      <CodeCell
        exerciseId={ex.id}
        lessonId={lessonId}
        starter={ex.starter}
        tests={ex.tests}
        hint={ex.hint}
      />
    </div>
  );
}
