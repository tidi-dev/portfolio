import { PAGE_COLOURS } from "@/lib/theme/page-colours";
import { themeScript } from "@/lib/theme/theme-script";

// Built once at module load: the script text is static.
const SCRIPT = themeScript(PAGE_COLOURS);

/**
 * The inline, parser-blocking theme script in <head>, so a stored dark theme
 * is dark at the first frame (contrib-engineering §5.3).
 */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
