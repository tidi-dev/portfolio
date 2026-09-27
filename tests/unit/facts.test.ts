import { describe, expect, it } from "vitest";
import { contact } from "@/content/contact";
import { projects } from "@/content/projects";
import type { FullProject } from "@/content/schema/projects";
import { contactFacts, projectFacts } from "@/lib/content/facts";

function fullSheet(id: string): FullProject {
  const project = projects.find((candidate) => candidate.id === id);
  if (project?.kind !== "full") throw new Error(`no full sheet "${id}"`);
  return project;
}

describe("projectFacts: facts-list rows for present fields only (contrib-engineering §3.3)", () => {
  it("a fixture without team or scale yields no Team or Scale rows", () => {
    const fixture: FullProject = {
      ...fullSheet("cyberrock"),
      facts: { role: "Built end to end", stack: ["NestJS", "Prisma"] },
    };

    expect(projectFacts(fixture)).toEqual([
      { term: "My role", value: { kind: "text", text: "Built end to end" } },
      { term: "Stack", value: { kind: "list", items: ["NestJS", "Prisma"] } },
    ]);
  });

  it("a fixture with only a role yields only the role row", () => {
    const fixture: FullProject = {
      ...fullSheet("cyberrock"),
      facts: { role: ["Backend", "auth"] },
    };

    expect(projectFacts(fixture)).toEqual([
      { term: "My role", value: { kind: "list", items: ["Backend", "auth"] } },
    ]);
  });

  it("CyberRock: the role as an inline list, then team, scale and stack", () => {
    const { facts } = fullSheet("cyberrock");

    expect(projectFacts(fullSheet("cyberrock"))).toEqual([
      {
        term: "My role",
        value: { kind: "list", items: ["Backend", "auth", "solution design"] },
      },
      { term: "Team", value: { kind: "text", text: facts.team } },
      { term: "Scale", value: { kind: "text", text: facts.scale } },
      { term: "Stack", value: { kind: "list", items: facts.stack } },
    ]);
  });

  it("botmivivi: the approved compact set, with en-US figures and the qualifier on customers and orders", () => {
    const { facts } = fullSheet("botmivivi");

    expect(projectFacts(fullSheet("botmivivi"))).toEqual([
      { term: "My role", value: { kind: "text", text: "Built end to end" } },
      { term: "Users", value: { kind: "text", text: "10" } },
      {
        term: "Customers",
        value: { kind: "text", text: "646" },
        qualifier: "in the first 2 months",
      },
      {
        term: "Orders",
        value: { kind: "text", text: "2,951" },
        qualifier: "in the first 2 months",
      },
      {
        term: "Impact",
        value: { kind: "text", text: "90% less time, 80% fewer errors" },
      },
      { term: "Stack", value: { kind: "list", items: facts.stack } },
    ]);
  });

  it("Quest @ NFQ Asia: role, team and the approved users line; no Stack row, because info.md lists none", () => {
    expect(projectFacts(fullSheet("quest"))).toEqual([
      { term: "My role", value: { kind: "text", text: "Tech lead" } },
      { term: "Team", value: { kind: "text", text: "8 juniors" } },
      {
        term: "Users",
        value: {
          kind: "text",
          text: "~300 users in Ha Noi, Da Nang, Sai Gon, Can Tho",
        },
      },
    ]);
  });

  it("never yields an empty term or value", () => {
    const rows = projects.flatMap((project) =>
      project.kind === "full" ? projectFacts(project) : [],
    );

    expect(rows.length).toBeGreaterThan(0);
    for (const { term, value } of rows) {
      expect(term).not.toBe("");
      expect(
        value.kind === "list" ? value.items.length : value.text.length,
      ).toBeGreaterThan(0);
    }
  });
});

describe("contactFacts: the Contact facts list (DESIGN.md → Contact)", () => {
  it("lists the opted-in channels as links, then the location as plain text", () => {
    expect(contactFacts(contact)).toEqual([
      {
        term: "Email",
        value: {
          kind: "link",
          text: "tidi.dev1321@gmail.com",
          href: "mailto:tidi.dev1321@gmail.com",
        },
      },
      {
        term: "Telegram",
        value: {
          kind: "link",
          text: "@tidi1321",
          href: "https://t.me/tidi1321",
        },
      },
      {
        term: "GitHub",
        value: {
          kind: "link",
          text: "github.com/tidi-dev",
          href: "https://github.com/tidi-dev",
        },
      },
      {
        term: "Location",
        value: { kind: "text", text: "Ho Chi Minh City, Vietnam" },
      },
    ]);
  });
});
