import { identity } from "@/content/identity";

/**
 * The h1 lockup (DESIGN.md → Hero): "TiDi" in `display`, then "Hồ Trọng Đại"
 * (`lang="vi"`) and "Dai Ho Trong" in `name`, the second in `text-muted`,
 * wrapping as needed. The name role's line height (1.2) keeps the Vietnamese
 * marks clear; `display` never holds them. Real spaces separate the three, so
 * the heading's text and accessible name read as three names. The first line
 * is trimmed to the cap height, where the bench's top edge meets it (Layout
 * → Alignment).
 */
export function HeroLockup({ id }: { readonly id: string }) {
  return (
    <h1 id={id} className="trim-cap-start">
      <span className="block type-display">{identity.brand}</span>{" "}
      <span className="mt-sm flex flex-wrap gap-x-md">
        <span lang={identity.nativeName.lang} className="type-name">
          {identity.nativeName.text}
        </span>{" "}
        <span className="type-name text-text-muted">{identity.name}</span>
      </span>
    </h1>
  );
}
