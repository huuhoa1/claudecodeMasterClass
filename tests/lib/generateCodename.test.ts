import { describe, it, expect } from "vitest";
import { generateCodename } from "@/lib/generateCodename";

describe("generateCodename", () => {
  it("returns a non-empty string", () => {
    expect(generateCodename()).toBeTruthy();
  });

  it("returns a PascalCase string with no spaces or separators", () => {
    const codename = generateCodename();
    expect(codename).toMatch(/^[A-Z][a-zA-Z]+$/);
  });

  it("returns different values across repeated calls", () => {
    const results = new Set(Array.from({ length: 20 }, generateCodename));
    expect(results.size).toBeGreaterThan(1);
  });
});
