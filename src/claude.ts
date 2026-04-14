import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function summarizeReadme(
	repoName: string,
	readme: string,
): Promise<string> {
	const response = await client.messages.create({
		model: "claude-sonnet-4-6",
		max_tokens: 2048,
		temperature: 0.3,
		messages: [
			{
				role: "user",
				content: `You are summarizing the GitHub repository '${repoName}'.
Write a summary using exactly these four sections with prose paragraphs under each heading:

## What it does
## Tech stack
## How to install
## Why it is interesting

README:
${readme.slice(0, 8000)}`,
			},
		],
	});
	return (response.content[0] as { type: "text"; text: string }).text;
}
