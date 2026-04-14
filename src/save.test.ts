import { describe, it, expect, afterEach } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { saveResults } from "./save";

const outputDir = path.resolve("output");

async function cleanOutput() {
  try {
    await fs.rm(outputDir, { recursive: true });
  } catch {
    // directory may not exist
  }
}

describe("saveResults", () => {
  afterEach(cleanOutput);

  it("creates output directory and writes both files", async () => {
    const { jsonPath, mdPath } = await saveResults(
      "test-query",
      '{"data": true}',
      "# Test"
    );

    const jsonContent = await fs.readFile(jsonPath, "utf-8");
    const mdContent = await fs.readFile(mdPath, "utf-8");

    expect(jsonContent).toBe('{"data": true}');
    expect(mdContent).toBe("# Test");
    expect(jsonPath).toContain("test-query");
    expect(mdPath).toContain("test-query");
    expect(jsonPath).toMatch(/\.json$/);
    expect(mdPath).toMatch(/\.md$/);
  });

  it("sanitizes query with special characters", async () => {
    const { jsonPath } = await saveResults(
      "hello world!@#",
      "{}",
      ""
    );

    const basename = path.basename(jsonPath);
    expect(basename).not.toMatch(/[^a-zA-Z0-9._\-_]/);
  });
});
