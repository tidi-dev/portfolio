import { Icon } from "@/components/ui/icon";
import { copy } from "@/content/copy";
import type { FullProject } from "@/content/schema/projects";
import { typography } from "@/lib/format/typography";
import { youtubeEmbedUrl } from "@/lib/content/youtube";
import { VideoFacadePlayer } from "./video-facade.client";

const PLAY_ICON = <Icon name="player-play" />;

/**
 * The video facade (DESIGN.md → Video facade): a 16:9 `plate` poster with
 * the video's title, the 48 px play mark and a caption, and no request to
 * YouTube until the visitor activates it. The server HTML is a real link to
 * the watch URL; the client leaf swaps in the youtube-nocookie player.
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
