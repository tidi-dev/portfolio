/**
 * Scroll-spy (DESIGN.md → HUD bar: "the current section (scroll-spy) gets
 * a 2 px state-bar underline and aria-current") as a
 * `useSyncExternalStore` source. One IntersectionObserver, shared by every
 * subscriber, watches the page's sections (`main > section[id]`); the
 * current section is the one crossing a thin band just above the middle
 * of the viewport. No scroll listeners. Browser-only.
 */

// The band: 45 %–46 % down the viewport. Sections are contiguous, so one
// of them crosses it at a time; the hero ("top") and the sections outside
// the nav simply match no link.
const BAND = "-45% 0px -54% 0px";

const listeners = new Set<() => void>();
const crossing = new Set<string>();
let observer: IntersectionObserver | null = null;
let sectionIds: string[] = [];
let current: string | null = null;

function update(): void {
  // The last crossing section in page order, if two touch the band.
  const next = sectionIds.findLast((id) => crossing.has(id)) ?? null;
  if (next === current) return;
  current = next;
  for (const listener of listeners) listener();
}

function start(): void {
  const sections = [
    ...document.querySelectorAll<HTMLElement>("main > section[id]"),
  ];
  sectionIds = sections.map((section) => section.id);
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const { id } = entry.target;
        if (entry.isIntersecting) crossing.add(id);
        else crossing.delete(id);
      }
      update();
    },
    { rootMargin: BAND },
  );
  for (const section of sections) observer.observe(section);
}

function stop(): void {
  observer?.disconnect();
  observer = null;
  crossing.clear();
  sectionIds = [];
  current = null;
}

export function subscribeSection(listener: () => void): () => void {
  listeners.add(listener);
  if (observer === null) start();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stop();
  };
}

/** The id of the section in view, or null (the hero, or between sections). */
export function sectionSnapshot(): string | null {
  return current;
}

/** The server can't know: no link is current. */
export function serverSectionSnapshot(): string | null {
  return null;
}
