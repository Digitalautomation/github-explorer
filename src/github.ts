import { execSync } from "node:child_process";

export type Repo = {
	full_name: string;
	html_url: string;
	description: string | null;
	stargazers_count: number;
};

const token = execSync("gh auth token").toString().trim();

const headers = {
	Accept: "application/vnd.github+json",
	"User-Agent": "github-repo-explorer",
	Authorization: `Bearer ${token}`,
};

export async function searchRepos(keyword: string): Promise<Repo[]> {
	const res = await fetch(
		`https://api.github.com/search/repositories?q=${encodeURIComponent(keyword)}&sort=stars&per_page=5`,
		{ headers },
	);
	if (!res.ok) {
		throw new Error(`GitHub search failed: ${res.status} ${res.statusText}`);
	}
	const data = (await res.json()) as { items: Repo[] };
	return data.items;
}

export async function fetchReadme(
	owner: string,
	repo: string,
): Promise<string> {
	const res = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/readme`,
		{ headers },
	);
	if (!res.ok) {
		throw new Error(
			`Failed to fetch README for ${owner}/${repo}: ${res.status} ${res.statusText}`,
		);
	}
	const data = (await res.json()) as { content: string };
	return Buffer.from(data.content, "base64").toString("utf-8");
}
