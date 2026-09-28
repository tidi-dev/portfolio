import { Icon } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import type { ResumeFile } from "@/lib/resume/file";

/**
 * The hero's Résumé link (DESIGN.md → Links and buttons; Hero): `link`
 * with the `download` icon, on its own 44 px row, downloading the PDF.
 * The hero renders it only when the PDF exists (lib/resume/file.ts).
 */
export function ResumeLink({ file }: { readonly file: ResumeFile }) {
  return (
    <a
      href={file.href}
      download
      className="group inline-flex min-h-target items-center gap-xs type-body text-accent transition-feedback hover:text-accent-hover"
    >
      <span className="underline decoration-1 underline-offset-link group-hover:decoration-2">
        {copy.resume.link}
      </span>
      <Icon name="download" />
    </a>
  );
}
