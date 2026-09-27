/**
 * Privacy rules for the file scan (contrib-verification P1-6 and C5; plan
 * Global Constraints → Privacy). They run on source, public files and the
 * whole build output, including minified client chunks, so each rule is
 * written to catch human-written values without matching framework code.
 */

export type RuleId = "email" | "phone" | "tel" | "banner";

export interface Finding {
  readonly rule: RuleId;
  readonly index: number;
  readonly match: string;
}

/** The only address the owner opted to show (info.md → Contact & links). */
export const OPTED_IN_EMAIL = "tidi.dev1321@gmail.com";

// "@", plain or in an encoded form that would hide an address from a plain
// search. Matched in place, so a finding keeps its position in the file.
const ENCODED_AT = /%40|&#0*64;|&#x0*40;|&commat;|\\u0040|\\x40/gi;
const EMAIL =
  /[A-Za-z0-9._%+-]+(?:@|%40|&#0*64;|&#x0*40;|&commat;|\\u0040|\\x40)[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}(?![A-Za-z0-9-])/gi;

// A run of digits joined by single spaces, dots, hyphens or brackets, with an
// optional leading "+" or "(", not touching letters or digits on either side.
const PHONE_CANDIDATE =
  /(?<![\p{L}\p{N}_])\(?\+?\d(?:[\d().-]| (?=[\d(]))*\d\)?(?![\p{L}\p{N}_])/gu;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;
const DECIMAL = /^\d+\.\d+$/;
const IPV4 = /^\d{1,3}(?:\.\d{1,3}){3}$/;
const PLAIN_RUN = /^\+?\d+$/;
const COUNTRY_CODE = /^\(?\+\d{1,3}\)?/;

// A tel: URI, not the `tel` key of an input-type map in framework code.
const TEL_URI = /\btel:(?:\/\/)?\s*(?:\+|%2B)?[\d(]/gi;

// Banner-only strings (info.md → Visual assets → banner.svg; C5). "XP" is
// allowed only inside the owner's house rule 4.
const BANNER = [
  /accepting\s+quests/gi,
  /\bPLAYER[\s-]?1\b/gi,
  /tidi@saigon/gi,
  /\bSTATUS\b/g,
  /\bLVL\b/g,
  /\bMAX\b/g,
  /\bXP\b/g,
];
const HOUSE_RULE_XP = "where the XP comes from";
const HOUSE_RULE_XP_OFFSET = HOUSE_RULE_XP.indexOf("XP");

/** "0123456789" and its runs: a digit alphabet in library code, not a number. */
function isDigitAlphabet(run: string): boolean {
  const ZERO = 48;
  for (let index = 1; index < run.length; index += 1) {
    const previous = run.charCodeAt(index - 1) - ZERO;
    if (run.charCodeAt(index) - ZERO !== (previous + 1) % 10) return false;
  }
  return true;
}

/**
 * 9 to 15 digits (C5). Excluded: ISO dates, decimals, IPv4 addresses, a digit
 * alphabet, and a plain digit run unless it starts with "0" or "+" (framework
 * constants such as 2147483647). In a formatted number every group has 2 or
 * more digits, except a country code after "+" and a "(0)" trunk prefix,
 * which rules out coordinate lists such as "0 0 1200 630".
 */
function isPhoneShaped(candidate: string): boolean {
  const digits = candidate.replace(/\D/g, "").length;
  if (digits < 9 || digits > 15) return false;
  if (
    ISO_DATE.test(candidate) ||
    DECIMAL.test(candidate) ||
    IPV4.test(candidate)
  ) {
    return false;
  }
  if (PLAIN_RUN.test(candidate)) {
    if (isDigitAlphabet(candidate)) return false;
    return candidate.startsWith("+") || candidate.startsWith("0");
  }

  const groups = candidate
    .replaceAll("(0)", " ")
    .replace(COUNTRY_CODE, " ")
    .split(/[\s.()-]+/)
    .filter((group) => group !== "");
  return groups.every((group) => group.length >= 2);
}

function matchesOf(pattern: RegExp, text: string): RegExpMatchArray[] {
  return [...text.matchAll(pattern)];
}

export function findPrivacyViolations(text: string): Finding[] {
  const findings: Finding[] = [];

  for (const match of matchesOf(EMAIL, text)) {
    const address = match[0].replace(ENCODED_AT, "@");
    if (address.toLowerCase() !== OPTED_IN_EMAIL) {
      findings.push({ rule: "email", index: match.index ?? 0, match: address });
    }
  }

  for (const match of matchesOf(PHONE_CANDIDATE, text)) {
    if (isPhoneShaped(match[0])) {
      findings.push({
        rule: "phone",
        index: match.index ?? 0,
        match: match[0],
      });
    }
  }

  for (const match of matchesOf(TEL_URI, text)) {
    findings.push({ rule: "tel", index: match.index ?? 0, match: match[0] });
  }

  for (const pattern of BANNER) {
    for (const match of matchesOf(pattern, text)) {
      const index = match.index ?? 0;
      const start = index - HOUSE_RULE_XP_OFFSET;
      const inHouseRule =
        match[0] === "XP" &&
        start >= 0 &&
        text.slice(start, start + HOUSE_RULE_XP.length) === HOUSE_RULE_XP;
      if (!inHouseRule)
        findings.push({ rule: "banner", index, match: match[0] });
    }
  }

  return findings.sort((a, b) => a.index - b.index);
}

/** Masks a matched value, so scan output never repeats private data. */
export function maskMatch(rule: RuleId, match: string): string {
  if (rule === "banner") return match;
  if (rule === "email") {
    const at = match.indexOf("@");
    return `${match.slice(0, 1)}${"•".repeat(Math.max(at - 1, 0))}${match.slice(at)}`;
  }

  const digits = match.replace(/\D/g, "").length;
  let seen = 0;
  return match.replace(/\d/g, (digit) => {
    seen += 1;
    return seen > digits - 2 ? digit : "•";
  });
}
