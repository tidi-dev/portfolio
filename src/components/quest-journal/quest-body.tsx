import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/icon";
import type { FullProject } from "@/content/schema/projects";
import type { Term } from "@/content/schema/primitives";
import { typography } from "@/lib/format/typography";

type Body = FullProject["body"];
type Achievements = Extract<Body, { kind: "achievements" }>;

/** A panel h4 (DESIGN.md → Panel heading): accent-ink caps, a trailing rule. */
function PanelSubheading({ children }: { readonly children: string }) {
  return (
    <h4 className="panel-heading type-heading-panel text-accent-ink">
      {children}
    </h4>
  );
}

/**
 * Quest's Party lead (contrib-design §1.2: an h4), the owner's line after
 * the dash.
 */
export function PartyLead({ lead }: { readonly lead: Term }) {
  return (
    <div className="flex flex-col gap-sm">
      <PanelSubheading>{lead.term}</PanelSubheading>
      <p className="max-w-measure">{typography(lead.description)}</p>
    </div>
  );
}

/**
 * Quest's achievements (DESIGN.md → Achievement badge): an h4, then the
 * four badges, each its icon, the name (`primary`) and the description
 * (`text-muted`), both body-compact; a 2 × 2 grid from `sm`. The first time Quest is current each badge wipes
 * on with one glint (quest.css); otherwise, and without JavaScript, they
 * simply show.
 */
function AchievementBadges({ body }: { readonly body: Achievements }) {
  return (
    <div className="flex flex-col gap-sm">
      <PanelSubheading>{body.heading}</PanelSubheading>
      <ul className="achievement-grid">
        {body.items.map((item, index) => (
          <li
            key={item.term}
            style={{ "--i": index } as CSSProperties}
            className="chamfer flex achievement flex-col gap-2xs p-md"
          >
            <span aria-hidden="true" className="achievement-glint" />
            <span className="relative text-accent-ink">
              <Icon name={item.icon} />
            </span>
            <span className="relative type-body-compact text-primary">
              {typography(item.term)}
            </span>
            <span className="relative type-body-compact text-text-muted">
              {typography(item.description)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A quest file's body (DESIGN.md → Quest file): the "What I built" /
 * "What it does" lists with no heading (bullets, or the owner's "Name —
 * description" strings as terms), or Quest's achievements.
 */
export function QuestBody({ body }: { readonly body: Body }) {
  switch (body.kind) {
    case "bullets":
      return (
        <ul className="quest-bullets flex max-w-measure flex-col gap-2xs type-body">
          {body.items.map((item) => (
            <li key={item}>{typography(item)}</li>
          ))}
        </ul>
      );
    case "terms":
      return (
        <dl className="flex flex-col gap-md">
          {body.items.map((item) => (
            <div key={item.term}>
              <dt className="type-body text-primary">
                {typography(item.term)}
              </dt>
              <dd className="mt-2xs type-body text-text-muted">
                {typography(item.description)}
              </dd>
            </div>
          ))}
        </dl>
      );
    case "achievements":
      return <AchievementBadges body={body} />;
  }
}
