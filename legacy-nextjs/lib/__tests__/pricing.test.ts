import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { usdToMxnWithMargin, applyMarginMxn } from "@/lib/pricing";

describe("lib/pricing", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("applyMarginMxn applies margin to MXN price", () => {
    // Con margen por defecto (0.3) 100 * 1.3 = 130
    const result = applyMarginMxn(100);
    expect(result).toBeGreaterThanOrEqual(129);
    expect(result).toBeLessThanOrEqual(131);
  });

  it("usdToMxnWithMargin converts USD and applies margin", () => {
    const result = usdToMxnWithMargin(10);
    expect(result).toBeGreaterThan(0);
    expect(typeof result).toBe("number");
  });
});
