import { Icon } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import type { FullProject } from "@/content/schema/projects";
import { youtubeEmbedUrl } from "@/lib/content/youtube";
import { typography } from "@/lib/format/typography";
import { VideoFacadePlayer } from "./video-facade.client";

const PLAY_ICON = <Icon name="player-play" />;

/**
 * The video facade (DESIGN.md → Video facade): "Watch Quest by NFQ" with a
 * player-play icon and the caption "Opens the YouTube player."; nothing
 * loads from YouTube until the visitor activates it.
 */
export function VideoFacade({
  video,
}: {
  readonly video: NonNullable<FullProject["video"]>;
}) {
  return (
    <VideoFacadePlayer
      watchUrl={video.url}
      embedUrl={youtubeEmbedUrl(video.url)}
      title={video.title}
      name={copy.video.name}
      caption={typography(copy.video.caption)}
      playIcon={PLAY_ICON}
    />
  );
}
