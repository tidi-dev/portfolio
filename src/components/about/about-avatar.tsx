import Image from "next/image";
import avatar from "@/assets/images/ava.png";
import { copy } from "@/content/copy";
import { typography } from "@/lib/format/typography";

/** DESIGN.md → Responsive Behavior → Images: the avatar's rendered widths. */
const SIZES = "(min-width: 1024px) 352px, min(calc(100vw - 40px), 320px)";

/**
 * The About avatar (DESIGN.md → About avatar): the owner's image exactly as
 * provided, at its native 3:4 with square corners, in a `plate` mat (12 px
 * padding, 16 px from lg, a 1 px `rule` border, radius 6). No shadow,
 * rotation, crop, filter or tint. The approved caption (info.md → Approved
 * copy, avatar.caption) sits under the mat, so the `img` takes `alt=""` and
 * the description is read once. Below the fold: lazy, responsive AVIF or
 * WebP through next/image, with the intrinsic width and height from the
 * static import, so nothing shifts. Never the LCP.
 */
export function AboutAvatar() {
  return (
    <figure className="w-full max-w-avatar lg:max-w-none">
      <div className="rounded-base border border-rule bg-surface-raised p-sm lg:p-md">
        <Image
          src={avatar}
          alt=""
          sizes={SIZES}
          loading="lazy"
          className="block h-auto w-full"
        />
      </div>
      <figcaption className="mt-xs type-body-sm text-text-muted">
        {typography(copy.avatar.caption)}
      </figcaption>
    </figure>
  );
}
