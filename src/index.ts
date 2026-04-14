import "dotenv/config";
import { searchRepositories } from "./github";
import { summarizeAsJson, summarizeAsMarkdown } from "./summarize";
import { saveResults } from "./save";

function parseArgs(args: string[]): { query: string; limit: number } {
  let query = "";
  let limit = 10;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--query" && args[i + 1]) {
      query = args[i + 1];
      i++;
    } else if (args[i] === "--limit" && args[i + 1]) {
      limit = parseInt(args[i + 1], 10);
      i++;
    }
  }

  if (!query) {
    console.error("Error: --query is required.\nUsage: npm run search -- --query <search-term> [--limit <number>]");
    process.exit(1);
  }

  if (isNaN(limit) || limit < 1) {
    console.error("Error: --limit must be a positive number.");
    process.exit(1);
  }

  return { query, limit };
}

async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error(
      "Error: GITHUB_TOKEN environment variable is not set.\n" +
        "Create a personal access token at https://github.com/settings/tokens\n" +
        "Then set it: export GITHUB_TOKEN=your_token_here\n" +
        "Or add it to a .env file: GITHUB_TOKEN=your_token_here"
    );
    process.exit(1);
  }

  const { query, limit } = parseArgs(process.argv.slice(2));

  console.log(`Searching GitHub for "${query}" (limit: ${limit})...`);

  const repos = await searchRepositories(query, limit, token);

  if (repos.length === 0) {
    console.log("No repositories found.");
    return;
  }

  console.log(`Found ${repos.length} repositories.`);

  const jsonContent = summarizeAsJson(repos);
  const markdownContent = summarizeAsMarkdown(query, repos);
  const { jsonPath, mdPath } = await saveResults(query, jsonContent, markdownContent);

  console.log(`\nResults saved:`);
  console.log(`  JSON:     ${jsonPath}`);
  console.log(`  Markdown: ${mdPath}`);
}

main().catch((err: Error) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
