import type { ComponentProps } from "react";
import ExerciseRunner from "./ExerciseRunner";
import CodeCell from "./CodeCell";
import SourceLink from "./SourceLink";
import YouTubeEmbed from "./YouTubeEmbed";
import RetrievalPrompt from "./RetrievalPrompt";
import LessonRecap from "./LessonRecap";
import WorkedExample from "./WorkedExample";
import Compounding from "./widgets/Compounding";
import YieldCurve from "./widgets/YieldCurve";
import MoneyHierarchy from "./widgets/MoneyHierarchy";
import SupplyDemand from "./widgets/SupplyDemand";
import FisherCalculator from "./widgets/FisherCalculator";
import RuleOf72 from "./widgets/RuleOf72";

export const mdxComponents = {
  ExerciseRunner,
  CodeCell,
  SourceLink,
  YouTubeEmbed,
  RetrievalPrompt,
  LessonRecap,
  WorkedExample,
  Compounding,
  YieldCurve,
  MoneyHierarchy,
  SupplyDemand,
  FisherCalculator,
  RuleOf72,
  a: (props: ComponentProps<"a">) => (
    <a {...props} target={props.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" />
  ),
};
