import {
  GhostButtonLink,
  PrimaryButtonLink,
} from "@/components/ui/button-link";
import { Icon } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import { sectionHref } from "@/lib/content/sections";
import { RESUME_FILE } from "@/lib/resume/file";

/**
 * The hero CTA pair (DESIGN.md → Buttons): "Bring me a pain point" →
 * Join party, and "Résumé" → the PDF with the file-download icon. The
 * Résumé link renders only when the PDF exists (contrib-engineering §7),
 * which Phase 5 generates. Below sm the pair stacks at full width; from
 * sm it sits in a row (DESIGN.md → Responsive Behavior → Hero).
 */
export function CtaPair() {
  return (
    <div className="flex flex-col gap-sm sm:flex-row sm:flex-wrap">
      <PrimaryButtonLink href={sectionHref("contact")}>
        {copy.hero.cta}
      </PrimaryButtonLink>
      {RESUME_FILE === undefined ? null : (
        <GhostButtonLink href={RESUME_FILE.href} type="application/pdf">
          <Icon name="file-download" />
          {copy.resume.link}
        </GhostButtonLink>
      )}
    </div>
  );
}
