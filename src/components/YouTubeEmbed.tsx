interface Props {
  /** YouTube video ID (the part after v= in the URL) */
  videoId: string;
  /** Optional start time in seconds */
  start?: number;
  /** Caption to display under the video */
  caption?: string;
  /** Source provider label (e.g. "Khan Academy", "MRU", "Yale OYC") */
  source?: string;
}

/**
 * Privacy-respecting YouTube embed using youtube-nocookie.com.
 * Used inline in lessons whenever an existing free video unblocks a concept faster than prose can.
 */
export default function YouTubeEmbed({ videoId, start, caption, source }: Props) {
  const url = `https://www.youtube-nocookie.com/embed/${videoId}${start ? `?start=${start}` : ""}`;
  return (
    <figure className="my-6">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={url}
          title={caption ?? "Embedded video"}
          className="absolute inset-0 w-full h-full rounded-lg border border-rule"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {(caption || source) && (
        <figcaption className="text-xs text-ink/60 mt-2 italic">
          {source && <span className="font-medium not-italic text-ink/80">{source}</span>}
          {source && caption && " · "}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
