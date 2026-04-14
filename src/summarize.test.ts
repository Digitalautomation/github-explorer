import { describe, it, expect } from "vitest";
import { summarizeAsJson, summarizeAsMarkdown } from "./summarize";
import { GitHubRepo } from "./github";

const sampleRepos: GitHubRepo[] = [
  {
    name: "react",
    owner: "facebook",
    description: "A JavaScript library for building user interfaces",
    stars: 200000,
    language: "JavaScript",
    lastUpdated: "2026-04-10T12:00:00Z",
    url: "https://github.com/facebook/react",
  },
  {
    name: "vue",
    owner: "vuejs",
    description: null,
    stars: 150000,
    language: null,
    lastUpdated: "2026-04-09T08:00:00Z",
    url: "https://github.com/vuejs/vue",
  },
];

describe("summarizeAsJson", () => {
  it("returns valid JSON with all repo fields", () => {
    const result = summarizeAsJson(sampleRepos);
    const parsed = JSON.parse(result);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe("react");
    expect(parsed[0].owner).toBe("facebook");
    expect(parsed[0].stars).toBe(200000);
  });

  it("handles empty array", () => {
    const result = summarizeAsJson([]);
    expect(JSON.parse(result)).toEqual([]);
  });
});

describe("summarizeAsMarkdown", () => {
  it("includes query in title", () => {
    const result = summarizeAsMarkdown("react", sampleRepos);
    expect(result).toContain('# GitHub Search Results: "react"');
  });

  it("includes repo count", () => {
    const result = summarizeAsMarkdown("react", sampleRepos);
    expect(result).toContain("Found 2 repositories");
  });

  it("includes repo details", () => {
    const result = summarizeAsMarkdown("react", sampleRepos);
    expect(result).toContain("facebook/react");
    expect(result).toContain("A JavaScript library for building user interfaces");
    expect(result).toContain("200,000");
    expect(result).toContain("JavaScript");
  });

  it("shows N/A for null language", () => {
    const result = summarizeAsMarkdown("vue", sampleRepos);
    expect(result).toContain("N/A");
  });

  it("handles empty repos array", () => {
    const result = summarizeAsMarkdown("nothing", []);
    expect(result).toContain("Found 0 repositories");
  });
});
