import type { ReactNode } from "react";
import { Hero } from "@/components/hero/hero";
import { RevealObserver } from "@/components/motion/reveal-observer.client";
import { QuestJournal } from "@/components/quest-journal/quest-journal";
import { Afk } from "@/components/sections/afk";
import { CharacterStats } from "@/components/sections/character-stats";
import { HouseRules } from "@/components/sections/house-rules";
import { Inventory } from "@/components/sections/inventory";
import { JoinParty } from "@/components/sections/join-party";
import { MissionLog } from "@/components/sections/mission-log";
import type { Section, SectionId } from "@/content/schema/sections";
import { sections } from "@/content/sections";
import { renderedSections } from "@/lib/content/sections";

type SectionComponent = (props: { readonly section: Section }) => ReactNode;

// Every registry section's component (contrib-design §1.2).
const COMPONENTS: Readonly<Record<SectionId, SectionComponent>> = {
  "quest-journal": QuestJournal,
  experience: MissionLog,
  "house-rules": HouseRules,
  inventory: Inventory,
  about: CharacterStats,
  afk: Afk,
  contact: JoinParty,
};

const BUILT = new Set(Object.keys(COMPONENTS) as SectionId[]);

// The sections with content, in the registry's order.
const PAGE_SECTIONS = renderedSections(sections, BUILT);

/**
 * The one page (contrib-design §1.2): the hero, then every section the
 * registry holds content for, in its order. The reveal observer powers the
 * panels on as they are reached.
 */
export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      {PAGE_SECTIONS.map((section) => {
        const Component = COMPONENTS[section.id];
        return <Component key={section.id} section={section} />;
      })}
      <RevealObserver />
    </main>
  );
}
