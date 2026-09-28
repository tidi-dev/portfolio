"use client";

import { type MouseEvent, type ReactNode, useState } from "react";

interface VideoFacadePlayerProps {
  /** The YouTube watch URL: the link without JavaScript. */
  readonly watchUrl: string;
  /** The youtube-nocookie player, with autoplay. */
  readonly embedUrl: string;
  /** The video's title, shown on the poster and as the iframe's title. */
  readonly title: string;
  /** Approved copy video.name: the poster link's accessible name. */
  readonly name: string;
  /** Approved copy video.caption: says YouTube loads on play. */
  readonly caption: string;
  /** The server-rendered `player-play` icon. */
  readonly playIcon: ReactNode;
}

type Phase = "poster" | "loading" | "playing";

// Stable, so React calls it once, when the player mounts: focus moves to it
// on activation and never again.
function focusOnMount(node: HTMLIFrameElement | null) {
  node?.focus();
}

// The poster's content: the title in `ui-strong`, the play mark (a 48 px
// `button-primary` square) and the caption line. Shared by the link and the
// backdrop the player fades in over.
const POSTER =
  "flex size-full flex-col items-center justify-center gap-xs rounded-base p-md text-center md:p-lg";

function PosterContent({
  title,
  caption,
  playIcon,
}: Pick<VideoFacadePlayerProps, "title" | "caption" | "playIcon">) {
  return (
    <>
      <span className="type-ui-strong">{title}</span>
      <span className="inline-flex size-2xl items-center justify-center rounded-base bg-accent text-on-accent transition-feedback group-hover:bg-accent-hover group-active:bg-accent-hover">
        {playIcon}
      </span>
      <span className="type-body-sm text-text-muted">{caption}</span>
    </>
  );
}

/**
 * The video facade's behaviour (DESIGN.md → Video facade; contrib-engineering
 * §5.3). The first render, and the server HTML, is a link to the watch URL,
 * so it works without JavaScript and loads nothing from YouTube. A plain
 * click swaps in the youtube-nocookie player inside the same 16:9 box, so
 * nothing shifts: the poster stays behind it as an inert backdrop, the
 * player takes focus at once and fades in over `duration-fade` when it has
 * loaded (instantly under reduced motion). A modified click (new tab,
 * window) keeps the link's default.
 */
export function VideoFacadePlayer({
  watchUrl,
  embedUrl,
  title,
  name,
  caption,
  playIcon,
}: VideoFacadePlayerProps) {
  const [phase, setPhase] = useState<Phase>("poster");

  function activate(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    setPhase("loading");
  }

  const poster = (
    <PosterContent title={title} caption={caption} playIcon={playIcon} />
  );

  return (
    <div className="relative aspect-video rounded-base border border-rule bg-surface-raised">
      {phase === "poster" ? (
        <a
          href={watchUrl}
          aria-label={name}
          onClick={activate}
          className={`group ${POSTER}`}
        >
          {poster}
        </a>
      ) : (
        <div aria-hidden="true" className={POSTER}>
          {poster}
        </div>
      )}
      {phase === "poster" ? null : (
        <iframe
          ref={focusOnMount}
          src={embedUrl}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => {
            setPhase("playing");
          }}
          data-loaded={phase === "playing" ? "" : undefined}
          className="absolute inset-0 size-full rounded-base opacity-0 transition-opacity duration-fade ease-out data-loaded:opacity-100 motion-reduce:transition-none"
        />
      )}
    </div>
  );
}
