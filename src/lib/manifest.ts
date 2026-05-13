import manifestData from "../content/manifest.json";
import resourcesData from "../content/resources.json";
import type { Manifest, Layer, Lesson, Resource } from "./types";

export const manifest: Manifest = manifestData as Manifest;
export const resources: Resource[] = resourcesData as Resource[];

export function getLayer(id: number): Layer | undefined {
  return manifest.layers.find((l) => l.id === id);
}

export function getLesson(id: string): Lesson | undefined {
  return manifest.lessons[id];
}

export function lessonsForLayer(id: number): Lesson[] {
  const layer = getLayer(id);
  if (!layer) return [];
  return layer.lessons
    .map((lid) => manifest.lessons[lid])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);
}

export function nextLesson(currentId: string): Lesson | undefined {
  const current = getLesson(currentId);
  if (!current) return undefined;
  const layerLessons = lessonsForLayer(current.layer);
  const idx = layerLessons.findIndex((l) => l.id === currentId);
  if (idx < 0) return undefined;
  if (idx + 1 < layerLessons.length) return layerLessons[idx + 1];
  const next = manifest.layers.find((l) => l.id === current.layer + 1);
  if (!next) return undefined;
  return manifest.lessons[next.lessons[0]];
}

export function resourceById(id: string): Resource | undefined {
  return resources.find((r) => r.id === id);
}
