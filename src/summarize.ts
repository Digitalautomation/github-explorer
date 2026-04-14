import { GitHubRepo } from "./github";

export function summarizeAsJson(repos: GitHubRepo[]): string {
  return JSON.stringify(repos, null, 2);
}

export function summarizeAsMarkdown(query: string, repos: GitHubRepo[]): string {
  const lines: string[] = [
    `# GitHub Search Results: "${query}"`,
    "",
    `**Found ${repos.length} repositories**`,
    "",
    `*Generated on ${new Date().toISOString()}*`,
    "",
    "---",
    "",
  ];

  for (const repo of repos) {
    lines.push(`## ${repo.owner}/${repo.name}`);
    lines.push("");
    if (repo.description) {
      lines.push(`> ${repo.description}`);
      lines.push("");
    }
    lines.push(`| Field | Value |`);
    lines.push(`|-------|-------|`);
    lines.push(`| **Stars** | ${repo.stars.toLocaleString()} |`);
    lines.push(`| **Language** | ${repo.language ?? "N/A"} |`);
    lines.push(`| **Last Updated** | ${new Date(repo.lastUpdated).toLocaleDateString()} |`);
    lines.push(`| **URL** | ${repo.url} |`);
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}
