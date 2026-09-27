import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findPrivacyViolations, maskMatch } from "../../scripts/privacy/rules";
import { sourceMapTargets } from "../../scripts/privacy/source-maps";
import { scanRoots } from "../../scripts/privacy/walk";
import { REPO_ROOT } from "../support/repo";

// Every number and address below is fictional.
function rulesHit(text: string): string[] {
  return findPrivacyViolations(text).map((finding) => finding.rule);
}

describe("privacy scan rules (P1-6)", () => {
  it.each([
    "0900 000 111",
    "0900.000.111",
    "090-000-0111",
    "0900000111",
    "+84 900 000 111",
    "+84900000111",
    "(+84) 900-000-111",
    "84 900 000 111",
    "(028) 0000 1111",
    "+44 (0) 20 0000 0000",
    "+1 (415) 000-0000",
  ])("flags the phone-shaped number %s", (phone) => {
    expect(rulesHit(`Call ${phone} today`)).toEqual(["phone"]);
    expect(rulesHit(`"${phone}"`)).toEqual(["phone"]);
  });

  it.each([
    "2020-03 to 2024-03",
    "2013–2017",
    "646 customers, 2951 orders, 107786 import, 89945 export",
    "1727481600000",
    "a=1073741823",
    "x+2147483647",
    "0.30102999566398",
    "127.0.0.1",
    "255.255.255.255",
    'viewBox="0 0 1200 630"',
    "version 16.3.6",
    "2026-09-28T03:01:00.000Z",
    "chunks/0a1b2c3d4e5f6789012.js",
    // The digit alphabet: object-assign's property-order test in a client
    // chunk, and a base64 table comment in Turbopack's build runner.
    '"0123456789"!==Object.getOwnPropertyNames(e)',
    "// 52 - 61: 0123456789",
    "123456789",
  ])("does not flag %s as a phone number", (text) => {
    expect(rulesHit(text)).toEqual([]);
  });

  it("flags tel: links and ignores the tel input-type key in framework code", () => {
    expect(rulesHit('<a href="tel:0900000111">')).toContain("tel");
    expect(rulesHit('<a href="tel:+84-900-000-111">')).toContain("tel");
    expect(rulesHit("{email:!0,tel:!0,text:!0}")).toEqual([]);
  });

  it("flags every email address except the opted-in one, including encoded forms", () => {
    expect(rulesHit("someone@example.com")).toEqual(["email"]);
    expect(rulesHit("mailto:someone%40example.com")).toEqual(["email"]);
    expect(rulesHit("someone&#64;example.com")).toEqual(["email"]);
    expect(rulesHit("someone\\u0040example.com")).toEqual(["email"]);
    expect(rulesHit("mailto:tidi.dev1321@gmail.com")).toEqual([]);
    expect(rulesHit("TIDI.DEV1321@GMAIL.COM")).toEqual([]);
  });

  it.each([
    "STATUS accepting quests",
    "Accepting quests",
    "▸ PLAYER 1",
    "tidi@saigon: ~/player-1",
    "XP · SYSTEM DESIGN",
    "LVL still leveling",
    "MAX not a thing",
  ])("flags the banner-only string %s", (text) => {
    expect(rulesHit(text)).toContain("banner");
  });

  it("allows XP inside the owner's house rule", () => {
    expect(
      rulesHit(
        "If I'm wrong, I'd rather find out early — that's where the XP comes from.",
      ),
    ).toEqual([]);
  });

  it("masks matched values, so a report never repeats private data", () => {
    expect(maskMatch("phone", "+84 900 000 111")).toBe("+•• ••• ••• •11");
    expect(maskMatch("email", "someone@example.com")).toBe(
      "s••••••@example.com",
    );
    expect(maskMatch("banner", "PLAYER 1")).toBe("PLAYER 1");
  });

  it("scans the first-party sources a source map embeds, not node_modules ones", () => {
    const map = JSON.stringify({
      version: 3,
      sources: [
        "../../node_modules/lib/index.js",
        "../../src/app/page.tsx",
        "turbopack:///[project]/src/content/contact.ts",
      ],
      sourcesContent: [
        "// @author Someone <someone@example.com>",
        "export default function Page() {}",
        'export const email = "leak@example.com";',
      ],
      mappings: "",
    });

    const targets = sourceMapTargets(map);
    expect(targets?.scanned.map((target) => target.source)).toEqual([
      "../../src/app/page.tsx",
      "turbopack:///[project]/src/content/contact.ts",
    ]);
    expect(targets?.skipped).toBe(1);
    expect(targets?.scanned.flatMap((target) => rulesHit(target.text))).toEqual(
      ["email"],
    );
  });

  it("reads indexed source maps (sections) too", () => {
    const map = JSON.stringify({
      version: 3,
      sections: [
        {
          offset: { line: 0, column: 0 },
          map: {
            version: 3,
            sources: ["../../src/app/layout.tsx"],
            sourcesContent: ['const tel = "tel:0900000111";'],
            mappings: "",
          },
        },
      ],
    });

    expect(
      sourceMapTargets(map)?.scanned.flatMap((target) => rulesHit(target.text)),
    ).toEqual(expect.arrayContaining(["tel", "phone"]));
  });

  it("finds nothing in src/ and public/", () => {
    const result = scanRoots([
      join(REPO_ROOT, "src"),
      join(REPO_ROOT, "public"),
    ]);

    expect(result.filesScanned).toBeGreaterThan(0);
    expect(result.findings).toEqual([]);
  });
});
