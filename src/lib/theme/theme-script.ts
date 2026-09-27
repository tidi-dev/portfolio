import { THEME_STORAGE_KEY, type Theme } from "./preference";

/**
 * The no-flash head script (contrib-engineering §5.3). It runs before the
 * body is parsed: a stored choice sets `data-theme` on <html>, which the
 * generated dark swap reads, and every theme-color meta takes that theme's
 * page colour. With no choice stored it does nothing, and the system theme
 * applies through CSS. Storage can throw (private modes, blocked cookies),
 * so every step sits in try/catch: the page then follows the system.
 */
export function themeScript(
  pageColours: Readonly<Record<Theme, string>>,
): string {
  const key = JSON.stringify(THEME_STORAGE_KEY);
  const colours = JSON.stringify(pageColours);
  return [
    "(function(){try{",
    `var t=localStorage.getItem(${key});`,
    'if(t!=="light"&&t!=="dark")return;',
    'document.documentElement.setAttribute("data-theme",t);',
    `var c=${colours}[t];`,
    'var m=document.querySelectorAll("meta[name=theme-color]");',
    'for(var i=0;i<m.length;i++)m[i].setAttribute("content",c);',
    "}catch(e){}})();",
  ].join("");
}
