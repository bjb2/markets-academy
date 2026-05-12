# Markets Academy

A self-hosted, free-source curriculum for learning markets from first principles to systematic execution. Khan-Academy style: sequenced lessons, inline exercises, in-browser Python for backtest exercises (via Pyodide), progress tracked in localStorage.

11 layers, macro → micro → execution. Free sources only (Yale Shiller, MIT OCW, Khan Academy, Mehrling, Hayek, Bernstein, Buffett letters, Marks memos, CBOE Options Institute, QuantConnect / Quantopian archive, Hasbrouck).

## Status

Phase 0 scaffold + Phase 1 curriculum spine + Phase 2 Layer 0/1 content shipped 2026-05-12.

## Develop

```sh
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```sh
npm run build
npm run preview
```

## Deploy

Pushes to `main` deploy to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.

## Contributing — lesson template

Every lesson follows the same evidence-based pedagogical pattern (retrieval → concrete → visual → abstract → worked example → recap). The full template, component reference, and failure-mode checklist are in [`docs/lesson-template.md`](docs/lesson-template.md). Read that before writing your first lesson.

The rationale for the template (cognitive load theory, retrieval practice, dual coding, Khan Academy's mastery-learning model) is captured in the parent org's KB.

## License

MIT.
