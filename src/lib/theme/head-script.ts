import {
  MOTION_ATTRIBUTE,
  MOTION_STORAGE_KEY,
  REDUCED_MOTION_QUERY,
} from "@/lib/motion/preference";
import { THEME_STORAGE_KEY } from "./preference";

/**
 * The no-flash head script (contrib-engineering §5.2, §6.4), run before the
 * body is parsed:
 * - a stored theme sets `data-theme` on <html>, which the dark swap in
 *   theme.css reads; with none stored the system theme applies through CSS
 * - `data-motion` is "on" or "off" from the stored choice, else
 *   prefers-reduced-motion, so no load animation starts in the calm mode
 * Storage can throw (private modes, blocked cookies), so each read sits in
 * try/catch: the page then follows the system. Without JavaScript neither
 * attribute exists, and every element rests in its final state.
 */
export function headScript(): string {
  const themeKey = JSON.stringify(THEME_STORAGE_KEY);
  const motionKey = JSON.stringify(MOTION_STORAGE_KEY);
  const motionAttribute = JSON.stringify(MOTION_ATTRIBUTE);
  const reduce = JSON.stringify(REDUCED_MOTION_QUERY);
  return [
    "(function(){var d=document.documentElement,t=null,m=null;",
    `try{t=localStorage.getItem(${themeKey});m=localStorage.getItem(${motionKey});}catch(e){}`,
    'if(t==="light"||t==="dark")d.setAttribute("data-theme",t);',
    `var r=!!(window.matchMedia&&window.matchMedia(${reduce}).matches);`,
    `d.setAttribute(${motionAttribute},m==="on"||(m!=="off"&&!r)?"on":"off");`,
    "})();",
  ].join("");
}
