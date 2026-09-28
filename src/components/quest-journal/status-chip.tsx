import { Icon } from "@/components/ui/icon";
import type { FullProject } from "@/content/schema/projects";

// status-active, status-side, status-cleared: the text colour, with a 1 px
// border in the same colour (quest.css).
const TONE: Record<FullProject["status"], string> = {
  Active: "chamfer status-chip status-active type-label chamfer-sm",
  Side: "chamfer status-chip status-side type-label chamfer-sm",
  Cleared: "chamfer status-chip status-cleared type-label chamfer-sm",
};

/**
 * A status chip (DESIGN.md → Status chip): "Active", "Side" or "Cleared",
 * the owner's words; Cleared adds a check icon. Inside a quest file it
 * flips in when the file becomes current (quest.css).
 */
export function StatusChip({
  status,
}: {
  readonly status: FullProject["status"];
}) {
  return (
    <span className={TONE[status]}>
      <span className="relative inline-flex items-center gap-2xs">
        {status === "Cleared" ? <Icon name="check" /> : null}
        {status}
      </span>
    </span>
  );
}
