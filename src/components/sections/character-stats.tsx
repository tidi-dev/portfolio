import Image from "next/image";
import type { CSSProperties } from "react";
import avatar from "@/assets/images/ava.png";
import { Icon } from "@/components/ui/icon";
import { Panel, PanelHeading } from "@/components/ui/panel";
import { SectionFrame, sectionTitleId } from "@/components/ui/section-frame";
import { about } from "@/content/about";
import { copy } from "@/content/copy";
import { identity } from "@/content/identity";
import type { Section } from "@/content/schema/sections";
import { sections } from "@/content/sections";
import { joinMiddot, typography } from "@/lib/format/typography";
import { AvatarTilt } from "./avatar-tilt.client";
import { DialogueContinue } from "./dialogue-continue.client";

// "Press A to continue" moves on to AFK, so it renders only when AFK does.
const AFK = sections.find((section) => section.id === "afk" && section.present);

// The frame's rendered widths (DESIGN.md → Responsive Behavior → Character
// stats: at most 220 px below sm, 160 px from sm, avatar 200 px from lg).
const AVATAR_SIZES =
  "(min-width: 1024px) 200px, (min-width: 640px) 160px, 220px";

const { education, languages } = about;

// A certification whose subject is a shown language sits with it (English:
// IELTS 6.0, EF SET C1, contrib-design §1.3); any other stays in Education.
const LANGUAGE_CREDENTIALS = new Map(
  education.certifications
    .filter((item) => languages.items.includes(item.subject))
    .map((item) => [item.subject, item.credentials]),
);
const OTHER_CERTIFICATIONS = education.certifications.filter(
  (item) => !languages.items.includes(item.subject),
);

/**
 * The avatar frame (DESIGN.md → Avatar frame): the owner's 3:4 avatar,
 * whole, in a 1 px `line` frame, `alt=""` because `avatar.caption` sits
 * visibly on the scrim below it. A holo band scans it once when its panel
 * powers on (`data-oneshot`), and it tilts toward a fine pointer.
 */
function AvatarFrame() {
  return (
    <AvatarTilt>
      <figure className="avatar-frame">
        <Image
          src={avatar}
          alt=""
          sizes={AVATAR_SIZES}
          className="avatar-image"
        />
        <span aria-hidden="true" data-oneshot="" className="avatar-scan" />
        <figcaption className="avatar-caption type-caption">
          {copy.avatar.caption}
        </figcaption>
      </figure>
    </AvatarTilt>
  );
}

/** Class, Guild, Base, XP, Quests, Passive: stat rows that tick in with their panel. */
function StatRows() {
  return (
    <dl className="flex flex-col">
      {about.stats.map((stat, index) => (
        <div
          key={stat.label}
          style={{ "--i": index } as CSSProperties}
          className="facts-row"
        >
          <dt className="type-label text-accent-ink">{stat.label}</dt>
          <dd className="type-body-sm text-primary">
            {typography(stat.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The dialogue box (DESIGN.md → Dialogue box): the bio as an RPG
 * dialogue, a gold speaker tag, both paragraphs always visible, then
 * "Press A to continue ▼" on to AFK.
 */
function DialogueBox() {
  return (
    <Panel className="stats-dialogue flex flex-col items-start gap-md">
      <span className="chamfer speaker-tag type-label chamfer-sm">
        <span className="relative">{identity.brand}</span>
      </span>
      {about.bio.map((paragraph) => (
        <p key={paragraph} className="max-w-measure">
          {typography(paragraph)}
        </p>
      ))}
      {AFK === undefined ? null : (
        <DialogueContinue
          href={`#${AFK.id}`}
          targetId={sectionTitleId(AFK)}
          label={copy.ui.pressAToContinue}
          icon={<Icon name="caret-down-filled" />}
        />
      )}
    </Panel>
  );
}

function EducationPanel() {
  return (
    <Panel className="stats-education flex flex-col gap-md">
      <PanelHeading>{education.label}</PanelHeading>
      <ul className="flex flex-col gap-md">
        {education.degrees.map((degree) => (
          <li key={degree.degree} className="flex flex-col gap-2xs">
            <span className="type-body-strong text-primary">
              {degree.degree}
            </span>
            <span className="type-body-sm text-text-muted">
              {joinMiddot([degree.school, degree.years])}
            </span>
          </li>
        ))}
        {OTHER_CERTIFICATIONS.map((item) => (
          <li key={item.subject} className="flex flex-col gap-2xs">
            <span className="type-body-strong text-primary">
              {item.subject}
            </span>
            <span className="type-body-sm text-text-muted">
              {joinMiddot(item.credentials)}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function LanguagesPanel() {
  return (
    <Panel className="stats-languages flex flex-col gap-md">
      <PanelHeading>{languages.label}</PanelHeading>
      <ul className="flex flex-col gap-md">
        {languages.items.map((language) => {
          const credentials = LANGUAGE_CREDENTIALS.get(language);
          return (
            <li key={language} className="flex flex-col gap-2xs">
              <span className="type-body-strong text-primary">{language}</span>
              {credentials === undefined ? null : (
                <span className="type-body-sm text-text-muted">
                  {joinMiddot(credentials)}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/**
 * Character stats (DESIGN.md → Avatar frame, Dialogue box; Responsive
 * Behavior → Character stats): from lg the stats panel (avatar 200 px +
 * rows) takes 7 columns and the dialogue 5, then education 7 and
 * languages 5. Stacked below lg: the avatar (at most 220 px) above the
 * rows, beside them at 160 px from sm.
 */
export function CharacterStats({ section }: { readonly section: Section }) {
  return (
    <SectionFrame section={section}>
      <div className="stats-grid">
        <Panel className="stats-card">
          <AvatarFrame />
          <StatRows />
        </Panel>
        <DialogueBox />
        <EducationPanel />
        <LanguagesPanel />
      </div>
    </SectionFrame>
  );
}
