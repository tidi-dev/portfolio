import type { Page } from "@playwright/test";

export interface Guard {
  /** Problems recorded so far. */
  problems: () => readonly string[];
  /** Throws with every recorded problem. The fixture calls it at teardown. */
  assertClean: () => void;
  /** Forgets recorded problems. For the guard's own self-tests only. */
  clear: () => void;
}

export interface GuardOptions {
  /** Origin of the site under test; any other origin is a third party. */
  readonly origin: string;
  /** Same-origin paths allowed to answer 400 or more (a deliberate 404 probe). */
  readonly allowedErrorPaths?: readonly string[];
}

const LOCAL_SCHEMES = new Set(["about:", "blob:", "data:"]);

/**
 * contrib-verification §1.3 guards: a console error or warning, an uncaught
 * page error, a hydration message, a same-origin response of 400 or more, and
 * a request to another origin.
 */
export function createGuard(
  page: Page,
  { origin, allowedErrorPaths = [] }: GuardOptions,
): Guard {
  const problems: string[] = [];

  page.on("console", (message) => {
    const type = message.type();
    const text = message.text();
    if (type === "error" || type === "warning") {
      problems.push(`console ${type}: ${text}`);
    } else if (/hydrat/i.test(text)) {
      problems.push(`hydration message (console ${type}): ${text}`);
    }
  });

  page.on("pageerror", (error) => {
    problems.push(`page error: ${error.name}: ${error.message}`);
  });

  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!LOCAL_SCHEMES.has(url.protocol) && url.origin !== origin) {
      problems.push(`third-party request: ${url.href}`);
    }
  });

  page.on("response", (response) => {
    const url = new URL(response.url());
    if (
      url.origin === origin &&
      response.status() >= 400 &&
      !allowedErrorPaths.includes(url.pathname)
    ) {
      problems.push(`HTTP ${String(response.status())}: ${url.pathname}`);
    }
  });

  return {
    problems: () => [...problems],
    assertClean: () => {
      if (problems.length > 0) {
        throw new Error(
          [
            `guard: ${String(problems.length)} problem(s)`,
            ...problems.map((problem) => `- ${problem}`),
          ].join("\n"),
        );
      }
    },
    clear: () => {
      problems.length = 0;
    },
  };
}
