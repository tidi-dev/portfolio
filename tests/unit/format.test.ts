import { describe, expect, it } from "vitest";
import { formatNumber } from "@/lib/format/number";
import { formatPeriod } from "@/lib/format/period";
import { typography } from "@/lib/format/typography";
import { approvedCopy, readInfoMd } from "../support/info-md";

describe("formatNumber: en-US grouping (ruling: numbers use Intl.NumberFormat, 2,951)", () => {
  it.each([
    [0, "0"],
    [10, "10"],
    [646, "646"],
    [2951, "2,951"],
    [107786, "107,786"],
    [1234567, "1,234,567"],
  ])("%d → %s", (value, expected) => {
    expect(formatNumber(value)).toBe(expected);
  });
});

describe("formatPeriod: the approved format (info.md → Approved copy, format.period)", () => {
  const row = approvedCopy(readInfoMd()).get("format.period");
  // The approved text holds both templates; content.test.ts checks that
  // copy.ts stores them verbatim.
  const [closed = "", open = ""] = (row?.text ?? "").split(" · ");
  const templates = { closed, open };
  const examples = [
    ...(row?.note ?? "").matchAll(/"(\d{4}-\d{2}) to (\d{4}-\d{2}|present)"/g),
  ].map(([text = "", start = "", end = ""]) => ({
    text: text.slice(1, -1),
    period: { start, end },
  }));

  it("the approval gives three examples", () => {
    expect(examples.map((example) => example.text)).toEqual([
      "2024-03 to present",
      "2020-12 to 2024-03",
      "2026-08 to present",
    ]);
  });

  it("reads the two approved templates", () => {
    expect(templates).toEqual({
      closed: "{YYYY-MM} to {YYYY-MM}",
      open: "{YYYY-MM} to present",
    });
  });

  it("renders each approved example from its period, with the approved templates", () => {
    for (const { text, period } of examples) {
      expect(formatPeriod(period, templates)).toBe(text);
    }
  });

  it("fills a closed period with both months, in order", () => {
    expect(formatPeriod({ start: "2020-03", end: "2020-12" }, templates)).toBe(
      "2020-03 to 2020-12",
    );
  });

  it("refuses a template without exactly the placeholders it needs", () => {
    expect(() =>
      formatPeriod(
        { start: "2020-03", end: "present" },
        {
          closed: "{YYYY-MM} to {YYYY-MM}",
          open: "since {YYYY-MM} to {YYYY-MM}",
        },
      ),
    ).toThrow("needs 1 {YYYY-MM} placeholder, found 2");
    expect(() =>
      formatPeriod(
        { start: "2020-03", end: "2020-12" },
        { closed: "{YYYY-MM}", open: "{YYYY-MM} to present" },
      ),
    ).toThrow("needs 2 {YYYY-MM} placeholders, found 1");
  });
});

describe("typography: stored text stays as in info.md; quotes and the ellipsis are set at render (contrib-engineering §3.1)", () => {
  it("curls double quotes by position", () => {
    expect(
      typography('Tech gossip and "how would you design this?" debates'),
    ).toBe("Tech gossip and “how would you design this?” debates");
    expect(typography('"Quoted" first')).toBe("“Quoted” first");
  });

  it("sets apostrophes as ’ and pairs single quotes", () => {
    expect(typography("I'm sure it's 'fine'")).toBe("I’m sure it’s ‘fine’");
    expect(typography("I'll bring the trade-offs.")).toBe(
      "I’ll bring the trade-offs.",
    );
  });

  it("replaces three dots with an ellipsis", () => {
    expect(typography("replace manual step from ...")).toBe(
      "replace manual step from …",
    );
  });

  it("binds a number to its unit with a no-break space", () => {
    expect(typography("~5 min of downtime")).toBe("~5\u00A0min of downtime");
    expect(typography("13 services")).toBe("13 services");
  });

  it("keeps the owner's em dashes, arrows, URLs and emails", () => {
    const text =
      "DynamoDB → MySQL — https://t.me/tidi1321 · tidi.dev1321@gmail.com";
    expect(typography(text)).toBe(text);
  });

  it("is idempotent", () => {
    const once = typography(
      `Got a pain point? Bring the constraints — I'll bring the "trade-offs"...`,
    );
    expect(typography(once)).toBe(once);
  });
});
