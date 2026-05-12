import { resourceById } from "../lib/manifest";

interface Props {
  id: string;
  children?: React.ReactNode;
}

export default function SourceLink({ id, children }: Props) {
  const r = resourceById(id);
  if (!r) return <span className="text-red-600">unknown source: {id}</span>;
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-baseline gap-1 text-accent underline underline-offset-2 hover:no-underline"
      title={`${r.type} · ${r.cost}`}
    >
      {children ?? r.title}
      <span className="text-xs opacity-60">↗</span>
    </a>
  );
}
