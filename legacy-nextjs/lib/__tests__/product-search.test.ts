import { describe, it, expect } from "vitest";
import { sanitizeQuery } from "@/lib/query-sanitizer";

describe("Product Search Query Sanitization", () => {
  it("should strip SKU: prefix in upper and lower case", () => {
    expect(sanitizeQuery("SKU: INKA-100")).toBe("INKA-100");
    expect(sanitizeQuery("sku: 38K253")).toBe("38K253");
    expect(sanitizeQuery("Sku:  DS-2CD2043G2-I ")).toBe("DS-2CD2043G2-I");
  });

  it("should strip trailing spaces, tabs, and newlines", () => {
    expect(sanitizeQuery("INKA-100 \n\t")).toBe("INKA-100");
    expect(sanitizeQuery("  38K253   ")).toBe("38K253");
  });

  it("should strip trailing punctuation like periods, colons, commas", () => {
    expect(sanitizeQuery("INKA-100.")).toBe("INKA-100");
    expect(sanitizeQuery("38K253,")).toBe("38K253");
    expect(sanitizeQuery("TL-WA850RE!")).toBe("TL-WA850RE");
  });

  it("should preserve dashes and slashes inside valid SKUs", () => {
    expect(sanitizeQuery("INKA-100-UNI")).toBe("INKA-100-UNI");
    expect(sanitizeQuery("DS-2CD2143G0-I/2.8MM")).toBe("DS-2CD2143G0-I/2.8MM");
  });

  it("should handle empty or null inputs gracefully", () => {
    expect(sanitizeQuery("")).toBe("");
    expect(sanitizeQuery("   ")).toBe("");
  });
});
