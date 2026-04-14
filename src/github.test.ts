import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("node:https", () => {
  const mockGet = vi.fn();
  return { default: { get: mockGet } };
});

import https from "node:https";
import { searchRepositories } from "./github";

const mockGet = https.get as ReturnType<typeof vi.fn>;

function makeHttpsMock(statusCode: number, body: string) {
  const mockRes = {
    statusCode,
    on: vi.fn((event: string, cb: (arg?: Buffer | Error) => void) => {
      if (event === "data") cb(Buffer.from(body));
      if (event === "end") cb();
    }),
  };
  const mockReq = { on: vi.fn() };
  mockGet.mockImplementation(
    (_url: string, _opts: object, cb: (res: typeof mockRes) => void) => {
      cb(mockRes);
      return mockReq;
    }
  );
}

const apiResponse = {
  total_count: 1,
  items: [
    {
      name: "react",
      owner: { login: "facebook" },
      description: "A JS library",
      stargazers_count: 200000,
      language: "JavaScript",
      updated_at: "2026-04-10T12:00:00Z",
      html_url: "https://github.com/facebook/react",
    },
  ],
};

describe("searchRepositories", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("maps API response to GitHubRepo shape correctly", async () => {
    makeHttpsMock(200, JSON.stringify(apiResponse));
    const repos = await searchRepositories("react", 10, "token123");
    expect(repos).toHaveLength(1);
    expect(repos[0]).toEqual({
      name: "react",
      owner: "facebook",
      description: "A JS library",
      stars: 200000,
      language: "JavaScript",
      lastUpdated: "2026-04-10T12:00:00Z",
      url: "https://github.com/facebook/react",
    });
  });

  it("rejects on 4xx API error", async () => {
    makeHttpsMock(401, "Unauthorized");
    await expect(
      searchRepositories("react", 10, "bad-token")
    ).rejects.toThrow("GitHub API error (401)");
  });

  it("rejects on invalid JSON response", async () => {
    makeHttpsMock(200, "not json");
    await expect(
      searchRepositories("react", 10, "token")
    ).rejects.toThrow("Failed to parse GitHub API response");
  });

  it("clamps perPage to 100 when limit > 100", async () => {
    makeHttpsMock(200, JSON.stringify({ total_count: 0, items: [] }));
    await searchRepositories("react", 150, "token");
    const callUrl = mockGet.mock.calls[0][0] as string;
    expect(callUrl).toContain("per_page=100");
  });

  it("returns empty array when API returns no items", async () => {
    makeHttpsMock(200, JSON.stringify({ total_count: 0, items: [] }));
    const repos = await searchRepositories("nothing", 10, "token");
    expect(repos).toEqual([]);
  });
});
