import { headScript } from "@/lib/theme/head-script";

// Built once at module load: the script text is static.
const SCRIPT = headScript();

/**
 * The inline, parser-blocking script in <head>, so a stored dark theme is
 * dark and a calm motion mode is calm at the first frame
 * (contrib-engineering §5.2, §6.4).
 */
export function HeadScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
