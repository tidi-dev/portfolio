import type { Page, Request } from "@playwright/test";

export interface NetworkEntry {
  readonly url: string;
  readonly resourceType: string;
  readonly status: number;
  /** Response body as transferred (gzip under `next start`). */
  readonly encodedBodyBytes: number;
  readonly contentEncoding: string | null;
}

export interface NetworkLog {
  readonly entries: readonly NetworkEntry[];
  readonly thirdPartyRequests: number;
}

/**
 * Records every finished request, and counts requests to other origins
 * (whether or not they finish). Call `settle()` after the page is idle.
 */
export function recordNetwork(page: Page, origin: string) {
  const pending: Promise<NetworkEntry>[] = [];
  let thirdPartyRequests = 0;

  const describe = async (request: Request): Promise<NetworkEntry> => {
    const response = await request.response();
    const sizes = await request.sizes();
    return {
      url: request.url(),
      resourceType: request.resourceType(),
      status: response?.status() ?? 0,
      encodedBodyBytes: sizes.responseBodySize,
      contentEncoding:
        (await response?.headerValue("content-encoding")) ?? null,
    };
  };

  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.protocol.startsWith("http") && url.origin !== origin) {
      thirdPartyRequests += 1;
    }
  });
  page.on("requestfinished", (request) => {
    pending.push(describe(request));
  });

  return {
    settle: async (): Promise<NetworkLog> => ({
      entries: await Promise.all(pending),
      thirdPartyRequests,
    }),
  };
}

interface TypeTotal {
  bytes: number;
  count: number;
  uncompressedCount: number;
}

function totalOf(log: NetworkLog, resourceType: string): TypeTotal {
  const entries = log.entries.filter(
    (entry) => entry.resourceType === resourceType,
  );
  return {
    bytes: entries.reduce((total, entry) => total + entry.encodedBodyBytes, 0),
    count: entries.length,
    uncompressedCount: entries.filter((entry) => entry.contentEncoding === null)
      .length,
  };
}

export function summariseNetwork(log: NetworkLog) {
  return {
    script: totalOf(log, "script"),
    stylesheet: totalOf(log, "stylesheet"),
    font: totalOf(log, "font"),
    document: totalOf(log, "document"),
    thirdPartyRequests: log.thirdPartyRequests,
    files: log.entries.map((entry) => ({
      url: entry.url,
      type: entry.resourceType,
      status: entry.status,
      bytes: entry.encodedBodyBytes,
      encoding: entry.contentEncoding,
    })),
  };
}
