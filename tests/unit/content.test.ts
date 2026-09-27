import { describe, expect, it } from "vitest";
import { z } from "zod";
import { about } from "@/content/about";
import { contact } from "@/content/contact";
import { copy } from "@/content/copy";
import { drawings } from "@/content/drawings";
import { experience } from "@/content/experience";
import { houseRules } from "@/content/house-rules";
import { identity } from "@/content/identity";
import { interests } from "@/content/interests";
import { factTerms, projects } from "@/content/projects";
import { Contact } from "@/content/schema/contact";
import { ContentError, defineContent, schemaOf } from "@/content/schema/define";
import { Identity } from "@/content/schema/identity";
import { HttpsUrl, Period, Text, YearMonth } from "@/content/schema/primitives";
import type { FullProject } from "@/content/schema/projects";
import { sections } from "@/content/sections";
import { site } from "@/content/site";
import { skills } from "@/content/skills";
import { formatNumber } from "@/lib/format/number";
import { formatPeriod } from "@/lib/format/period";
import { typography } from "@/lib/format/typography";
import {
  approvedCopy,
  readInfoMd,
  sectionLines,
  shownOnSite,
} from "../support/info-md";

const infoMd = readInfoMd();
const infoLines = infoMd.split(/\r?\n/);

/** Every export of every content module, by module. */
const CONTENT: Readonly<Record<string, Readonly<Record<string, unknown>>>> = {
  about: { about },
  contact: { contact },
  copy: { copy },
  drawings: { drawings },
  experience: { experience },
  "house-rules": { houseRules },
  identity: { identity },
  interests: { interests },
  projects: { projects, factTerms },
  sections: { sections },
  site: { site },
  skills: { skills },
};

const fullSheets = projects.filter(
  (project): project is FullProject => project.kind === "full",
);

function project(id: string) {
  const found = projects.find((candidate) => candidate.id === id);
  if (found === undefined) throw new Error(`no project "${id}"`);
  return found;
}

function period(value: Parameters<typeof formatPeriod>[0]): string {
  return formatPeriod(value, copy.format.period);
}

describe("schema primitives (contrib-engineering §1.4, §3.3)", () => {
  it("Text is non-empty, trimmed, NFC and keeps straight quotes (typography is applied at render)", () => {
    expect(Text.safeParse("Hồ Trọng Đại").success).toBe(true);
    for (const invalid of [
      "",
      " TiDi",
      "TiDi ",
      "Ho\u0302\u0300", // "Hồ" decomposed (NFD)
      "“quoted”",
      "it’s",
      "wait…",
    ]) {
      expect(Text.safeParse(invalid).success, invalid).toBe(false);
    }
  });

  it("YearMonth accepts YYYY-MM only", () => {
    expect(YearMonth.safeParse("2024-03").success).toBe(true);
    for (const invalid of [
      "2024-13",
      "2024-00",
      "2024-3",
      "24-03",
      "2024/03",
    ]) {
      expect(YearMonth.safeParse(invalid).success, invalid).toBe(false);
    }
  });

  it("Period runs forward, or stays open with 'present'", () => {
    expect(Period.safeParse({ start: "2020-12", end: "2024-03" }).success).toBe(
      true,
    );
    expect(Period.safeParse({ start: "2024-03", end: "present" }).success).toBe(
      true,
    );
    const backwards = Period.safeParse({ start: "2024-03", end: "2020-12" });
    expect(
      backwards.error?.issues.map((issue) => issue.path.join(".")),
    ).toEqual(["end"]);
  });

  it("HttpsUrl accepts https URLs only", () => {
    expect(HttpsUrl.safeParse("https://lemonswan.com/").success).toBe(true);
    for (const invalid of [
      "http://daiho.dev",
      "mailto:tidi@example.org",
      "daiho.dev",
    ]) {
      expect(HttpsUrl.safeParse(invalid).success, invalid).toBe(false);
    }
  });

  it("content objects are strict: an unknown key fails", () => {
    const result = Identity.safeParse({ ...identity, nickname: "Dai" });
    expect(result.error?.issues[0]?.code).toBe("unrecognized_keys");
  });
});

describe("defineContent: parsed at module load, failing with the module and the Zod path", () => {
  const Demo = z.strictObject({ period: Period, title: Text });

  it("returns the parsed value and registers its schema for the trace", () => {
    const demo = defineContent("demo", Demo, {
      period: { start: "2020-03", end: "present" },
      title: "Demo",
    });
    expect(demo).toEqual({
      period: { start: "2020-03", end: "present" },
      title: "Demo",
    });
    expect(schemaOf(demo)).toBe(Demo);
  });

  it("throws a readable error naming the file and the path", () => {
    let caught: unknown;
    try {
      defineContent("demo", Demo, {
        period: { start: "2024-03", end: "2020-01" },
        title: "Demo",
      });
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(ContentError);
    expect((caught as Error).message).toBe(
      "Invalid content in src/content/demo.ts\n✖ The period ends before it starts\n  → at period.end",
    );
  });

  it("every export of every content module was defined through it", () => {
    const exports = Object.entries(CONTENT).flatMap(([module, values]) =>
      Object.entries(values).map(([name, value]) => ({ module, name, value })),
    );
    expect(
      exports.filter(({ value }) => schemaOf(value) === undefined),
    ).toEqual([]);
  });
});

describe("section registry (contrib-engineering §3.1; DESIGN.md → Header)", () => {
  it("lists the sections in DESIGN.md's order, with the stable ids", () => {
    expect(sections.map((section) => section.id)).toEqual([
      "quest-journal",
      "experience",
      "house-rules",
      "inventory",
      "about",
      "afk",
      "contact",
    ]);
  });

  it("the nav holds Quest journal, Experience, House rules and Contact", () => {
    expect(
      sections.filter((section) => section.nav).map((section) => section.label),
    ).toEqual(["Quest journal", "Experience", "House rules", "Contact"]);
  });

  it("every section has content, so no nav link can dangle", () => {
    expect(sections.filter((section) => !section.present)).toEqual([]);
  });

  it("the primary action lands on a present section (the hero CTA → #contact)", () => {
    const target = sections.find(
      (section) => section.id === site.primaryAction,
    );
    expect(target?.id).toBe("contact");
    expect(target?.present).toBe(true);
  });
});

describe("cross-field rules (contrib-engineering §3.4)", () => {
  it("project ids are unique", () => {
    const ids = projects.map((candidate) => candidate.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every project an employer lists exists, and no project is listed twice", () => {
    const listed = experience.flatMap((entry) => entry.projects);
    expect(
      listed.filter((id) => !projects.some((candidate) => candidate.id === id)),
    ).toEqual([]);
    expect(new Set(listed).size).toBe(listed.length);
  });

  it("each listed project's period lies within its employer's period", () => {
    for (const entry of experience) {
      for (const id of entry.projects) {
        const { period: projectPeriod } = project(id);
        if (projectPeriod === undefined) continue;
        expect(projectPeriod.start >= entry.period.start, id).toBe(true);
        if (entry.period.end !== "present") {
          expect(projectPeriod.end !== "present", id).toBe(true);
          expect(projectPeriod.end <= entry.period.end, id).toBe(true);
        }
      }
    }
  });

  it("each full sheet draws its own drawing; the bench belongs to the hero", () => {
    const drawn = fullSheets.map((sheet) => sheet.drawing);
    expect([...drawn].sort()).toEqual(
      Object.keys(drawings)
        .filter((key) => key !== "bench")
        .sort(),
    );
  });

  it("the botmivivi replaced-steps step repeats the drawing's labels verbatim (Approved copy a11y.steps.botmivivi)", () => {
    const { replaced, steps } = drawings.botmivivi;
    expect(steps).toContain(`${replaced.label}: ${replaced.items.join(", ")}.`);
  });
});

describe("the owner's words are stored whole (portfolio-content C)", () => {
  it("each owner quote appears in info.md as a whole quoted string, not a truncated fragment", () => {
    const quotes = [
      identity.tagline,
      ...about.bio,
      about.signOff,
      ...houseRules.intro,
      ...houseRules.rules,
      drawings.bench.caption,
      drawings.botmivivi.caption,
      ...fullSheets.map((sheet) => sheet.lede),
      ...fullSheets.flatMap((sheet) =>
        sheet.body.kind === "bullets"
          ? sheet.body.items
          : sheet.body.items.map(
              (item) => `${item.term} — ${item.description}`,
            ),
      ),
      ...fullSheets.flatMap((sheet) =>
        sheet.partyLead === undefined
          ? []
          : [`${sheet.partyLead.term} — ${sheet.partyLead.description}`],
      ),
    ];

    expect(quotes.length).toBeGreaterThan(20);
    expect(quotes.filter((quote) => !infoMd.includes(`"${quote}"`))).toEqual(
      [],
    );
  });

  it("the house rules keep the owner's order", () => {
    const positions = houseRules.rules.map((rule) =>
      infoMd.indexOf(`"${rule}"`),
    );
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("each list is whole: joined, it appears in info.md and does not continue at either end", () => {
    const lists: readonly (readonly [readonly string[], string])[] = [
      ...fullSheets.flatMap((sheet) => [
        ...(typeof sheet.facts.role === "string"
          ? []
          : [[sheet.facts.role, " · "] as const]),
        ...(sheet.facts.stack === undefined
          ? []
          : [[sheet.facts.stack, " · "] as const]),
      ]),
      ...projects.flatMap((candidate) =>
        candidate.kind === "compact" ? [[candidate.stack, ", "] as const] : [],
      ),
      [about.levelingUp.items, " · "],
      [about.languages.items, " and "],
    ];

    expect(lists.length).toBeGreaterThan(5);
    for (const [items, separator] of lists) {
      const joined = items.join(separator);
      const line = infoLines.find((candidate) => candidate.includes(joined));
      expect(line, joined).toBeDefined();
      const at = (line ?? "").indexOf(joined);
      expect((line ?? "").slice(0, at).endsWith(separator), joined).toBe(false);
      expect(
        (line ?? "").slice(at + joined.length).startsWith(separator),
        joined,
      ).toBe(false);
    }
  });

  it("the Inventory groups are the five profile groups of Skills & tools, item for item", () => {
    const profileGroups = sectionLines(infoMd, "Skills & tools").flatMap(
      (line) => {
        const match = /^- (.+) \(profile\): (.+)$/.exec(line);
        return match
          ? [{ name: match[1], items: (match[2] ?? "").split(", ") }]
          : [];
      },
    );
    expect(profileGroups).toHaveLength(5);
    expect(skills.groups).toEqual(profileGroups);
  });

  it("the AFK list is the profile list of Interests, item for item", () => {
    const line = sectionLines(infoMd, "Interests").find((candidate) =>
      candidate.startsWith("- Profile: "),
    );
    const items = (line ?? "")
      .slice("- Profile: ".length)
      .split(", ")
      .map((item) => item.replace(/^"(.*)"$/, "$1"));
    expect(interests.afk).toEqual(items);
  });

  it("education and certifications match their info.md lines", () => {
    for (const { degree, school, years } of about.education.degrees) {
      expect(infoLines).toContain(`- ${degree}, ${school}, ${years}`);
    }
    for (const { subject, credentials } of about.education.certifications) {
      expect(infoLines).toContain(`- ${subject}: ${credentials.join(", ")}`);
    }
  });

  it("full sheets carry the name and status of their info.md project heading", () => {
    for (const sheet of fullSheets) {
      expect(
        infoLines.some((line) =>
          line.startsWith(`### ${sheet.name} (${sheet.status},`),
        ),
        sheet.name,
      ).toBe(true);
    }
  });

  it("each employer row matches its info.md heading and dates", () => {
    for (const entry of experience) {
      expect(
        infoLines.some((line) => line.startsWith(`### ${entry.employer}`)),
        entry.employer,
      ).toBe(true);
      expect(
        infoLines.some((line) =>
          line.startsWith(`- Dates: ${period(entry.period)}`),
        ),
        entry.employer,
      ).toBe(true);
    }
  });

  it("every project period, formatted, appears in info.md as written", () => {
    for (const candidate of projects) {
      if (candidate.period === undefined) continue;
      expect(infoMd, candidate.id).toContain(period(candidate.period));
    }
  });

  it("every visible string, typeset, has no straight quote or three dots (C11)", () => {
    const strings = Object.values(CONTENT).flatMap((values) =>
      stringLeafPaths(values).map((path) => at(values, path.split("."))),
    );
    expect(strings.length).toBeGreaterThan(200);
    expect(
      strings.filter(
        (value) =>
          typeof value === "string" && /["']|\.\.\./.test(typography(value)),
      ),
    ).toEqual([]);
  });

  it("the identity lines match info.md", () => {
    expect(infoLines).toContain(`- Name (résumé): ${identity.name}`);
    expect(infoMd).toContain(`**${identity.nativeName.text}**`);
    expect(infoMd).toContain(
      `${identity.englishName} in English, ${identity.brand} around here`,
    );
    expect(infoMd).toContain(
      `- Role / title (owner, answer.md): **${identity.role}**`,
    );
  });
});

/** "not-found.heading" → ["notFound", "heading"] */
function keyPath(key: string): string[] {
  return key
    .split(".")
    .map((segment) =>
      segment.replace(/-(\w)/g, (_, letter: string) => letter.toUpperCase()),
    );
}

function at(root: unknown, path: readonly string[]): unknown {
  return path.reduce<unknown>(
    (node, segment) =>
      typeof node === "object" && node !== null
        ? (node as Readonly<Record<string, unknown>>)[segment]
        : undefined,
    root,
  );
}

function stringLeafPaths(node: unknown, path: string[] = []): string[] {
  if (typeof node === "string") return [path.join(".")];
  if (typeof node !== "object" || node === null) return [];
  return Object.entries(node).flatMap(([key, child]) =>
    stringLeafPaths(child, [...path, key]),
  );
}

function numbered(steps: readonly string[]): string {
  return steps.map((step, index) => `${String(index + 1)}. ${step}`).join(" ");
}

describe("approved copy is in content verbatim (info.md → Approved copy; C6)", () => {
  const rows = approvedCopy(infoMd);
  const botmivivi = project("botmivivi");
  const usage = botmivivi.kind === "full" ? botmivivi.facts.usage : undefined;

  /** Rows that approve a depiction, a pattern or a scope rather than a string. */
  const NOT_STRINGS: Readonly<Record<string, string>> = {
    "depiction.bench":
      "what the bench shows; its labels are the owner's words (drawings.ts)",
    "depiction.cyberrock-drawing":
      "what the CyberRock drawing shows; its labels are in drawings.ts",
    "a11y.drawing-steps": "the pattern that the a11y.steps.* rows follow",
    "lists.scope":
      "implemented as skills.resumeOnly and interests.resumeOnly (next test)",
  };

  /** Rows stored as parts: each composes back to its row text, and claims those copy.ts leaves. */
  const COMPOSED: Readonly<
    Record<string, { text: () => string; claims: readonly string[] }>
  > = {
    "format.period": {
      text: () => `${copy.format.period.closed} · ${copy.format.period.open}`,
      claims: ["format.period.closed", "format.period.open"],
    },
    "botmivivi.facts": {
      text: () =>
        usage === undefined
          ? ""
          : [
              `${factTerms.users}: ${formatNumber(usage.users)}`,
              `${factTerms.customers}: ${formatNumber(usage.customers)}`,
              `${factTerms.orders}: ${formatNumber(usage.orders)}`,
              usage.window,
              `${factTerms.impact}: ${usage.impact}`,
            ].join(" · "),
      claims: ["botmivivi.facts.window", "botmivivi.facts.impact"],
    },
    "quest.drawing.carried": {
      text: () => drawings.quest.carried.join(", "),
      claims: [],
    },
    "botmivivi.drawing.replaced-label": {
      text: () => drawings.botmivivi.replaced.label,
      claims: [],
    },
    "a11y.steps.bench": {
      text: () => numbered(drawings.bench.steps),
      claims: [],
    },
    "a11y.steps.cyberrock": {
      text: () => numbered(drawings.cyberrock.steps),
      claims: [],
    },
    "a11y.steps.quest": {
      text: () => numbered(drawings.quest.steps),
      claims: [],
    },
    "a11y.steps.botmivivi": {
      text: () => numbered(drawings.botmivivi.steps),
      claims: [],
    },
  };

  const aliasOf = (text: string) => /^= ([\w.-]+)$/.exec(text)?.[1];

  /** The copy.ts leaves each row accounts for. */
  const claimed = new Set(
    [...rows.values()].flatMap((row) => {
      if (NOT_STRINGS[row.key] !== undefined) return [];
      return COMPOSED[row.key]?.claims ?? [keyPath(row.key).join(".")];
    }),
  );

  it.each([...rows.values()].map((row) => [row.key, row] as const))(
    "%s",
    (key, row) => {
      const composed = COMPOSED[key];
      const alias = aliasOf(row.text);

      if (NOT_STRINGS[key] !== undefined) {
        expect(NOT_STRINGS[key]).not.toBe("");
      } else if (composed !== undefined) {
        expect(composed.text()).toBe(row.text);
      } else if (alias !== undefined) {
        // "= hero.sentence": the same string as the named row.
        expect(at(copy, keyPath(key))).toBe(at(copy, keyPath(alias)));
      } else {
        expect(at(copy, keyPath(key))).toBe(row.text);
      }
    },
  );

  it("copy.ts holds nothing but approved rows", () => {
    expect(claimed.size).toBeGreaterThan(20);
    expect(stringLeafPaths(copy).filter((path) => !claimed.has(path))).toEqual(
      [],
    );
  });

  it("lists.scope: the site shows the five profile groups and the AFK list; the PDF adds only the approved extras", () => {
    const scope = rows.get("lists.scope")?.text ?? "";
    const pdfOnly = /PDF only: (.+)\.$/.exec(scope)?.[1]?.split(", ");
    expect(scope).toContain(
      "Site: the five profile skill groups and the profile AFK list.",
    );
    expect(skills.groups).toHaveLength(5);
    expect([...skills.resumeOnly, ...interests.resumeOnly]).toEqual(pdfOnly);
  });
});

describe("structural privacy: contact.ts holds exactly the opted-in channels and the location (O4; rulings 2 and 3)", () => {
  const shown = shownOnSite(infoMd);
  const optedIn = (channel: string) =>
    shown.find((entry) => entry.shown && entry.channel === channel)?.value;

  it("info.md's opt-ins are the email, Telegram, GitHub and the location", () => {
    expect(
      shown.filter((entry) => entry.shown).map((entry) => entry.channel),
    ).toEqual(["Email", "Telegram", "GitHub", "Location"]);
  });

  it("contact.ts has one entry per opt-in, and nothing else", () => {
    expect(Object.keys(contact)).toEqual([
      "email",
      "telegram",
      "github",
      "location",
    ]);
    expect(Object.keys(Contact.shape)).toEqual(Object.keys(contact));
  });

  it("each entry holds the opted-in value", () => {
    expect(contact.email.address).toBe(optedIn("Email"));
    expect(contact.telegram.handle).toBe(optedIn("Telegram"));
    expect(contact.location.text).toBe(optedIn("Location"));
    expect(infoLines).toContain(`- GitHub (résumé): ${contact.github.url}`);
    expect(infoLines).toContain(
      `- Telegram (profile): ${contact.telegram.handle}, ${contact.telegram.url}`,
    );
  });

  it("the Contact schema has no field for a phone number, a second email or a reference", () => {
    for (const key of ["phone", "secondEmail", "reference"]) {
      const result = Contact.safeParse({ ...contact, [key]: "x" });
      expect(result.error?.issues[0]?.code, key).toBe("unrecognized_keys");
    }
    expect(
      Contact.shape.email.shape.address.safeParse(["a@b.co", "c@d.co"]).success,
    ).toBe(false);
  });

  it("no content schema declares a phone, second-email or reference field", () => {
    const keys = Object.values(CONTENT)
      .flatMap((values) => Object.values(values))
      .flatMap((value) => {
        const schema = schemaOf(value);
        return schema === undefined ? [] : objectKeys(schema);
      });
    expect(keys.length).toBeGreaterThan(50);
    expect(
      keys.filter((key) =>
        /phone|mobile|^tel$|telephone|reference|(second|alt).*email/i.test(key),
      ),
    ).toEqual([]);
    expect(keys.filter((key) => /email/i.test(key))).toEqual(["email"]);
  });

  it("the location lives in contact.ts only (ruling 2)", () => {
    const leaves = Object.entries(CONTENT).flatMap(([module, values]) =>
      stringLeafPaths(values).map((path) => ({
        module,
        path,
        value: at(values, path.split(".")),
      })),
    );
    const mentions = leaves.filter(
      ({ value }) =>
        typeof value === "string" && value.includes("Ho Chi Minh City"),
    );
    expect(mentions.map(({ module, path }) => `${module}:${path}`)).toEqual([
      "contact:contact.location.text",
      "contact:contact.location.locality",
    ]);
  });
});

/** Every object key a schema declares, at any depth. */
function objectKeys(schema: z.ZodType): string[] {
  const def = schema._zod.def as unknown as {
    type: string;
    shape?: Readonly<Record<string, z.ZodType>>;
    element?: z.ZodType;
    innerType?: z.ZodType;
    options?: readonly z.ZodType[];
  };
  const children: z.ZodType[] = [
    ...Object.values(def.shape ?? {}),
    ...(def.element === undefined ? [] : [def.element]),
    ...(def.innerType === undefined ? [] : [def.innerType]),
    ...(def.options ?? []),
  ];
  return [...Object.keys(def.shape ?? {}), ...children.flatMap(objectKeys)];
}
