import type { ReactNode } from "react";
import {
  GhostButtonLink,
  PrimaryButtonLink,
} from "@/components/ui/button-link";
import { PartyBrackets } from "@/components/shell/corner-brackets";
import { Icon } from "@/components/ui/icon";
import { Panel } from "@/components/ui/panel";
import { SectionFrame } from "@/components/ui/section-frame";
import { about } from "@/content/about";
import { contact } from "@/content/contact";
import { copy } from "@/content/copy";
import type { Section } from "@/content/schema/sections";
import { fillSize } from "@/lib/format/file-size";
import { typography } from "@/lib/format/typography";
import { RESUME_FILE } from "@/lib/resume/file";

interface ContactRow {
  readonly term: string;
  readonly value: ReactNode;
}

const { email, telegram, github, location } = contact;

/**
 * The rows (DESIGN.md → Contact row), exactly the channels the owner opted
 * in to (info.md → Contact & links → Shown on the site): Email as the gold
 * button, Telegram and GitHub as ghost buttons with the external-link
 * icon, the Résumé row once the PDF exists (Phase 5 generates it), then
 * the location as plain text. Icons are 24 px here (Consistency locks 4).
 */
const ROWS: readonly ContactRow[] = [
  {
    term: email.label,
    value: (
      <PrimaryButtonLink href={`mailto:${email.address}`}>
        <Icon name="mail" size="large" />
        {email.address}
      </PrimaryButtonLink>
    ),
  },
  {
    term: telegram.label,
    value: (
      <GhostButtonLink href={telegram.url}>
        <Icon name="brand-telegram" size="large" />
        {telegram.handle}
        <Icon name="external-link" />
      </GhostButtonLink>
    ),
  },
  {
    term: github.label,
    value: (
      <GhostButtonLink href={github.url}>
        <Icon name="brand-github" size="large" />
        {github.text}
        <Icon name="external-link" />
      </GhostButtonLink>
    ),
  },
  ...(RESUME_FILE === undefined
    ? []
    : [
        {
          term: copy.resume.link,
          value: (
            <GhostButtonLink href={RESUME_FILE.href} type="application/pdf">
              <Icon name="file-download" size="large" />
              {fillSize(copy.resume.contactLink, RESUME_FILE.bytes)}
            </GhostButtonLink>
          ),
        },
      ]),
  {
    term: location.label,
    value: (
      <span className="inline-flex items-center gap-xs type-body text-primary">
        <span className="text-accent-ink">
          <Icon name="map-pin" size="large" />
        </span>
        {location.text}
      </span>
    ),
  },
];

/**
 * Join party (DESIGN.md → Contact row; Responsive Behavior → Join party):
 * the owner's sign-off, then the contact rows. Stacked below lg; from lg
 * the sign-off takes 5 columns, stretched to the rows' height, and the
 * rows 7. The hero's corner brackets frame the pair, drawn on as the
 * sign-off panel powers on.
 */
export function JoinParty({ section }: { readonly section: Section }) {
  return (
    <SectionFrame section={section}>
      <div className="contact-grid">
        <PartyBrackets />
        <Panel className="contact-signoff">
          <p className="max-w-measure type-heading-quest text-primary">
            {typography(about.signOff)}
          </p>
        </Panel>
        <Panel className="contact-rows">
          <dl className="flex flex-col">
            {ROWS.map((row) => (
              <div key={row.term} className="contact-row">
                <dt className="type-label text-accent-ink">{row.term}</dt>
                <dd className="min-w-0">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </SectionFrame>
  );
}
