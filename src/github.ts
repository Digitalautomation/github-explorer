import https from "node:https";

export interface GitHubRepo {
  name: string;
  owner: string;
  description: string | null;
  stars: number;
  language: string | null;
  lastUpdated: string;
  url: string;
}

interface SearchResponse {
  total_count: number;
  items: Array<{
    name: string;
    owner: { login: string };
    description: string | null;
    stargazers_count: number;
    language: string | null;
    updated_at: string;
    html_url: string;
  }>;
}

/**
 * Search GitHub repositories by query string.
 *
 * @param query - The search term to query GitHub repositories.
 * @param limit - Maximum number of results to return (default: 10). Note: GitHub
 *   API caps `per_page` at 100, so at most 100 results are returned regardless of
 *   the value passed.
 * @param token - GitHub Personal Access Token for authenticated API access.
 * @returns A promise resolving to an array of matching {@link GitHubRepo} objects.
 */
export async function searchRepositories(
  query: string,
  limit: number,
  token: string
): Promise<GitHubRepo[]> {
  const perPage = Math.min(limit, 100);
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${perPage}`;

  const data = await makeRequest<SearchResponse>(url, token);

  return data.items.slice(0, limit).map((item) => ({
    name: item.name,
    owner: item.owner.login,
    description: item.description,
    stars: item.stargazers_count,
    language: item.language,
    lastUpdated: item.updated_at,
    url: item.html_url,
  }));
}

function makeRequest<T>(url: string, token: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": "github-explorer-cli",
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${token}`,
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk: Buffer) => {
          body += chunk.toString();
        });
        res.on("error", reject);
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(
              new Error(
                `GitHub API error (${res.statusCode}): ${body}`
              )
            );
            return;
          }
          try {
            resolve(JSON.parse(body) as T);
          } catch {
            reject(new Error(`Failed to parse GitHub API response: ${body}`));
          }
        });
      }
    );
    req.on("error", reject);
  });
}
