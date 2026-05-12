import type { ComponentProps } from "react";
import ExerciseRunner from "./ExerciseRunner";
import CodeCell from "./CodeCell";
import SourceLink from "./SourceLink";

export const mdxComponents = {
  ExerciseRunner,
  CodeCell,
  SourceLink,
  a: (props: ComponentProps<"a">) => (
    <a {...props} target={props.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" />
  ),
};
