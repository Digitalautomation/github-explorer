import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const MAX_README_CHARS = 8000;

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
${readme.slice(0, MAX_README_CHARS)}`,
			},
		],
	});
	const textBlock = response.content.find((block) => block.type === "text");
	if (!textBlock || textBlock.type !== "text") {
		throw new Error("Claude returned no text content");
	}
	return textBlock.text;
}
