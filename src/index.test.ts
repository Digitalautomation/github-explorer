import { describe, it, expect, vi, afterEach } from "vitest";
import { parseArgs } from "./index";

describe("parseArgs", () => {
  const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`process.exit(${code})`);
  });

  afterEach(() => exitSpy.mockClear());

  it("parses --query and uses default limit of 10", () => {
    const result = parseArgs(["--query", "typescript"]);
    expect(result).toEqual({ query: "typescript", limit: 10 });
  });

  it("parses --query and explicit --limit", () => {
    const result = parseArgs(["--query", "react", "--limit", "25"]);
    expect(result).toEqual({ query: "react", limit: 25 });
  });

  it("exits with code 1 when --query is missing", () => {
    expect(() => parseArgs([])).toThrow("process.exit(1)");
  });

  it("exits with code 1 when --limit is not a number", () => {
    expect(() =>
      parseArgs(["--query", "react", "--limit", "abc"])
    ).toThrow("process.exit(1)");
  });

  it("exits with code 1 when --limit is zero", () => {
    expect(() =>
      parseArgs(["--query", "react", "--limit", "0"])
    ).toThrow("process.exit(1)");
  });

  it("exits with code 1 when --limit is negative", () => {
    expect(() =>
      parseArgs(["--query", "react", "--limit", "-5"])
    ).toThrow("process.exit(1)");
  });
});
