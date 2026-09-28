"use client";

import { type MouseEvent, type ReactNode, useState } from "react";

interface VideoFacadePlayerProps {
  /** The YouTube watch URL: the link without JavaScript. */
  readonly watchUrl: string;
  /** The youtube-nocookie player, with autoplay. */
  readonly embedUrl: string;
  /** The video's title ("Quest by NFQ"), the player's accessible name. */
  readonly title: string;
  /** Approved copy video.name: the facade's visible label. */
  readonly name: string;
  /** Approved copy video.caption: says YouTube loads on activation. */
  readonly caption: string;
  /** The server-rendered `player-play` icon. */
  readonly playIcon: ReactNode;
}

// Stable, so React calls it once, when the player mounts: focus moves to it
// on activation and never again.
function focusOnMount(node: HTMLIFrameElement | null) {
  node?.focus();
}

/**
 * The video facade's behaviour (DESIGN.md → Video facade; v1's, restyled).
 * The server HTML is a link to the watch URL, so it works without
 * JavaScript and loads nothing from YouTube. A plain click swaps in the
 * youtube-nocookie player, which takes focus. A modified click (new tab,
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
  const [active, setActive] = useState(false);

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
    setActive(true);
  }

  return active ? (
    <div className="video-frame">
      <iframe
        ref={focusOnMount}
        src={embedUrl}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 size-full"
      />
    </div>
  ) : (
    <div className="flex flex-col items-start gap-xs">
      <a
        href={watchUrl}
        onClick={activate}
        className="chamfer btn type-button video-facade"
      >
        <span className="relative inline-flex items-center gap-xs">
          {playIcon}
          {name}
        </span>
      </a>
      <p className="type-caption text-text-muted">{caption}</p>
    </div>
  );
}
