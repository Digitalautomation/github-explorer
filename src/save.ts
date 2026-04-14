import fs from "node:fs/promises";
import path from "node:path";

export async function saveResults(
  query: string,
  jsonContent: string,
  markdownContent: string
): Promise<{ jsonPath: string; mdPath: string }> {
  const outputDir = path.resolve("output");
  await fs.mkdir(outputDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const sanitizedQuery = query.replace(/[^a-zA-Z0-9-_]/g, "_");
  const baseName = `${sanitizedQuery}-${timestamp}`;

  const jsonPath = path.join(outputDir, `${baseName}.json`);
  const mdPath = path.join(outputDir, `${baseName}.md`);

  await fs.writeFile(jsonPath, jsonContent, "utf-8");
  await fs.writeFile(mdPath, markdownContent, "utf-8");

  return { jsonPath, mdPath };
}
