# Lesson Template

Every lesson in `src/content/lessons/*.mdx` follows this pattern. Future lessons (Layer 2+) and any contributor should hit each section.

The pedagogical rationale lives in the org KB at `knowledge/domains/pedagogy-lesson-design-for-self-study-curriculum.md`. Read it before writing your first lesson.

## Skeleton

```mdx
<RetrievalPrompt
  prompt="A question the learner can attempt cold from prior layers + general intuition."
  reveal="One paragraph: where this lesson is heading. Concrete enough to anchor recall after they read the body."
/>

## Brief opening: a concrete instance

One paragraph anchoring the abstraction in a specific real-world example. Not generic ("imagine an economy"); specific ("In May 2024 the price of copper jumped 20%...").

## Visual or video

<Widget /> OR <YouTubeEmbed videoId="..." caption="..." source="..." />

Place the visual BEFORE the prose that requires it. The visual is the dual-coding anchor; if it appears after the explanation, the learner has already finished encoding without it.

## The abstraction

The generalization the example illustrates. Now that the learner has a concrete instance + a visual, prose can be dense without losing them.

<WorkedExample
  title="A concrete calculation or analytical step"
  problem="The problem statement."
  steps={[
    { label: "Step 1: ...", body: "..." },
    { label: "Step 2: ...", body: "..." },
    { label: "Final step or sanity check", body: "..." },
  ]}
/>

## Implications / why this matters

How this lesson connects to layers ahead, or to real decisions. Cite primary sources via <SourceLink id="..." /> when relevant.

<LessonRecap points={[
  "Retrieval-framed bullet — should be answerable from memory now.",
  "Each point is a CLAIM the learner can produce, not a TOPIC name.",
  "3–5 points.",
]} />

<ExerciseRunner lessonId="<lesson-id>" />
```

## Exercise pack format

Sibling file `src/content/exercises/<lesson-id>.json`:

```json
[
  {
    "id": "q1",
    "kind": "multi-choice" | "calc-input" | "free-text" | "code" | "read-primary",
    "prompt": "...",
    "..."
  }
]
```

Aim for 3–5 exercises per lesson. Mix types — pure multi-choice fatigues; calc-input + free-text + read-primary together cover recall, transfer, and primary-source contact.

## Failure-mode checklist

Before committing a lesson:

- [ ] Could the learner answer the retrieval prompt from PRIOR lessons + general intuition? If they need this lesson to answer it, it's not retrieval — it's setup. Rewrite.
- [ ] If you cut the widget/video, would the learner understand less? If no, cut it.
- [ ] Does the worked example have a structural pattern that an exercise tests transfer of? If no, the exercises are disconnected from the example. Add a transfer exercise.
- [ ] Is the recap a list of CLAIMS the learner can produce, or a list of TOPICS covered? Topics fail. Rewrite as claims.
- [ ] Did you load every primary source via `<SourceLink id="..." />` rather than a bare URL? Bare URLs bypass the source registry and break the global resources index.
- [ ] **For each `<YouTubeEmbed videoId="..." />`**: did you OPEN `https://www.youtube.com/watch?v=<id>` in a browser (or `WebFetch` it) and confirm the title, channel, and that it loads? Guessing video IDs from memory or from a confident-sounding LLM is the canonical bug. A wrong ID renders as a "Video unavailable" placeholder that the build won't catch.

## Components available

All registered in `src/components/mdxComponents.tsx`:

- `<RetrievalPrompt>` — opening retrieval prompt with reveal
- `<WorkedExample>` — step-by-step solution path, step-by-step reveal
- `<LessonRecap>` — closing retrieval-framed bullets
- `<YouTubeEmbed>` — privacy-respecting video embed (Khan, MRU, OYC, etc.)
- `<SourceLink id="..." />` — link to a registered free source (see `src/content/resources.json`)
- `<ExerciseRunner lessonId="..." />` — loads the exercise pack for the lesson
- `<CodeCell>` — Pyodide-powered code cell (for Layer 9 mainly)

### Widgets

- `<Compounding>` — sliders for compounding math (Layer 0, eventually reused in Layers 2, 3, 8)
- `<YieldCurve>` — draggable Treasury yields (Layer 1)
- `<MoneyHierarchy>` — Mehrling's pyramid (Layer 1)
- `<SupplyDemand>` — clearing point widget (Layer 0)
- `<FisherCalculator>` — nominal/real/inflation triangle (Layer 0)
- `<RuleOf72>` — approximation vs exact (Layer 0)

When you need a new widget that doesn't exist:

1. Build it under `src/components/widgets/`. Keep it SVG-based and lightweight; no Plotly unless absolutely required.
2. Register in `mdxComponents.tsx`.
3. Reuse across as many lessons as possible. The widget's reusability is part of the design.

## Manifest entry

Every new lesson must also be registered in `src/content/manifest.json`:

```json
"01.13-new-lesson": {
  "id": "01.13-new-lesson",
  "layer": 1,
  "order": 13,
  "title": "Title here",
  "prereqs": ["01.12-capstone-fomc-brief"],
  "estMinutes": 40,
  "sources": ["resource-id-1", "resource-id-2"],
  "exerciseCount": 4
}
```

And added to the layer's `lessons` array in the same file.
