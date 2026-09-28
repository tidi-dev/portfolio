/**
 * The youtube-nocookie player for a watch URL (DESIGN.md → Video facade),
 * reused from v1: it autoplays, because it loads only after the visitor's
 * click. projects.ts validates the watch URL's shape.
 */
export function youtubeEmbedUrl(watchUrl: string): string {
  const id = new URL(watchUrl).searchParams.get("v");
  if (id === null) {
    throw new Error(`No video id in ${watchUrl}`);
  }
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1`;
}
