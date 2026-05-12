/**
 * Lesson MDX loader. Discovers every `*.mdx` file under `content/lessons/`
 * and exposes a map keyed by lesson id (filename without extension).
 */

const modules = import.meta.glob("./lessons/**/*.mdx") as Record<
  string,
  () => Promise<{ default: React.ComponentType }>
>;

export const lessonModules: Record<string, () => Promise<{ default: React.ComponentType }>> = {};

for (const [path, loader] of Object.entries(modules)) {
  const match = path.match(/\/([^/]+)\.mdx$/);
  if (!match) continue;
  lessonModules[match[1]] = loader;
}
