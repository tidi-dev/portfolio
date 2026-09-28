import { Hero } from "@/components/hero/hero";
import { QuestJournal } from "@/components/quest-journal/quest-journal";
import { sections } from "@/content/sections";

// The Quest journal's registry entry: its anchor (the nav's target) and
// its heading.
const QUEST_JOURNAL = sections.find(
  (section) => section.id === "quest-journal" && section.present,
);

/**
 * The one page (contrib-design §1.2). Phase 3: the hero and the Quest
 * journal; the remaining sections follow in Phase 4.
 */
export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      {QUEST_JOURNAL === undefined ? null : (
        <QuestJournal section={QUEST_JOURNAL} />
      )}
    </main>
  );
}
