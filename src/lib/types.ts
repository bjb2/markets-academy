export type ExerciseKind =
  | "multi-choice"
  | "calc-input"
  | "free-text"
  | "code"
  | "read-primary";

export interface MultiChoiceExercise {
  id: string;
  kind: "multi-choice";
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
}

export interface CalcInputExercise {
  id: string;
  kind: "calc-input";
  prompt: string;
  expected: number;
  tolerance: number;
  unit?: string;
  explanation?: string;
}

export interface FreeTextExercise {
  id: string;
  kind: "free-text";
  prompt: string;
  reference: string;
  rubricKeywords?: string[];
}

export interface CodeExercise {
  id: string;
  kind: "code";
  prompt: string;
  starter: string;
  tests: string;
  hint?: string;
}

export interface ReadPrimaryExercise {
  id: string;
  kind: "read-primary";
  prompt: string;
  url: string;
  title: string;
  reflectionPrompt: string;
}

export type Exercise =
  | MultiChoiceExercise
  | CalcInputExercise
  | FreeTextExercise
  | CodeExercise
  | ReadPrimaryExercise;

export interface Lesson {
  id: string;
  layer: number;
  order: number;
  title: string;
  prereqs: string[];
  estMinutes: number;
  sources: string[];
  exerciseCount: number;
}

export interface Layer {
  id: number;
  title: string;
  subtitle: string;
  objective: string;
  estWeeks: string;
  lessons: string[];
}

export interface Manifest {
  layers: Layer[];
  lessons: Record<string, Lesson>;
}

export interface Resource {
  id: string;
  title: string;
  type: "course" | "book" | "paper" | "memo" | "site" | "tutorial" | "newsletter" | "podcast" | "essay";
  url: string;
  cost: "free" | "library" | "paid";
  primaryLayers: number[];
  format: string[];
  estimatedHours?: number;
  notes?: string;
}
