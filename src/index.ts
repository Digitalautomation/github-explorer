// Load .env file using Bun's built-in dotenv support
import "../.env";

import { summarizeReadme } from "./claude";
import { pickRepo } from "./cli";
import { fetchReadme, searchRepos } from "./github";
import { saveSummary } from "./storage";

const keyword = process.argv[2];
if (!keyword) {
	console.error("Usage: bun run start <keyword>");
	process.exit(1);
}

try {
	console.log(`Searching GitHub for: "${keyword}"...`);
	const repos = await searchRepos(keyword);
	if (repos.length === 0) {
		console.log("No repos found.");
		process.exit(0);
	}

	const selected = await pickRepo(repos);
	const [owner, repo] = selected.full_name.split("/");

	console.log(`\nFetching README for ${selected.full_name}...`);
	const readme = await fetchReadme(owner, repo);

	console.log("Generating summary with Claude...");
	const summary = await summarizeReadme(selected.full_name, readme);

	const filePath = await saveSummary(selected, summary);
	console.log(`\nSummary saved to: ${filePath}`);
} catch (err) {
	console.error("Error:", err instanceof Error ? err.message : err);
	process.exit(1);
}
