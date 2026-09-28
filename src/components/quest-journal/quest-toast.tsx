import type { AnimationEvent } from "react";

// The last of the toast's keyframes (quest.css): when it ends, the toast
// is done.
const OUT_ANIMATION = "quest-toast-out";

interface QuestToastProps {
  /** Approved copy toast.quest-unlocked. */
  readonly label: string;
  readonly name: string;
  readonly onDone: () => void;
}

/**
 * The toast (DESIGN.md → Toast): a glass chip with a 1 px accent-ink edge
 * in the stage's top-left, "Quest unlocked" plus the quest's name, on each
 * selection the visitor makes (never the default on load); a new one
 * restarts it (keyed by the selection count). It wipes in, holds and
 * leaves (toast-in, toast-hold, toast-out); in the calm mode it fades in
 * and out. It sits inside the aria-hidden stage: the state is carried by
 * the cards' `aria-selected`.
 */
export function QuestToast({ label, name, onDone }: QuestToastProps) {
  return (
    <div
      onAnimationEnd={(event: AnimationEvent<HTMLDivElement>) => {
        if (event.animationName === OUT_ANIMATION) onDone();
      }}
      className="quest-toast chamfer flex flex-col gap-2xs p-sm chamfer-glass chamfer-sm"
    >
      <span className="type-heading-panel text-accent-ink">{label}</span>
      <span className="type-body-compact text-primary">{name}</span>
    </div>
  );
}
