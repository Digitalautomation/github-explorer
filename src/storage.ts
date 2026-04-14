import fs from "node:fs";
import type { Repo } from "./github";

export async function saveSummary(
	repo: Repo,
	summary: string,
): Promise<string> {
	fs.mkdirSync("saved-repos", { recursive: true });

	const filename = `${repo.full_name.replace("/", "-")}.md`;
	const filePath = `saved-repos/${filename}`;

	const content = `# ${repo.full_name}

**URL**: ${repo.html_url}
**Stars**: ${repo.stargazers_count}
**Description**: ${repo.description ?? "N/A"}

## Summary

${summary}
`;

	fs.writeFileSync(filePath, content, "utf-8");
	return filePath;
}
