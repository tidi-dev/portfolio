import { Icon } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import { identity } from "@/content/identity";
import { joinMiddot } from "@/lib/format/typography";

const LINE = joinMiddot([copy.ui.progressSaved, identity.tagline]);

/**
 * The footer (DESIGN.md → Footer): device-floppy + "progress saved" (the
 * owner's label) and his tagline, in `footer-line`.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-rule py-lg page-x">
      <p className="mx-auto flex max-w-container items-center justify-center gap-xs type-label text-text-muted">
        <Icon name="device-floppy" />
        {LINE}
      </p>
    </footer>
  );
}
