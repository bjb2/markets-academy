import { resources } from "../lib/manifest";

export default function Resources() {
  const byLayer = new Map<number, typeof resources>();
  for (const r of resources) {
    for (const l of r.primaryLayers) {
      const arr = byLayer.get(l) ?? [];
      arr.push(r);
      byLayer.set(l, arr);
    }
  }
  const layers = Array.from(byLayer.keys()).sort((a, b) => a - b);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-3">Resources</h1>
      <p className="text-ink/70 mb-8">
        Every linked source in the curriculum, indexed by layer. All free unless tagged otherwise.
      </p>
      <div className="space-y-8">
        {layers.map((lid) => (
          <section key={lid}>
            <h2 className="text-xl font-semibold mb-3 border-b border-rule pb-1">
              Layer {lid}
            </h2>
            <ul className="space-y-2">
              {byLayer.get(lid)!.map((r) => (
                <li key={r.id} className="text-sm">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline underline-offset-2 hover:no-underline"
                  >
                    {r.title}
                  </a>
                  <span className="text-ink/50 ml-2 text-xs">
                    {r.type} · {r.cost}
                    {r.estimatedHours ? ` · ~${r.estimatedHours}h` : ""}
                  </span>
                  {r.notes && <div className="text-ink/60 text-xs mt-0.5">{r.notes}</div>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
