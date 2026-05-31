import { describe, it, expect } from "vitest";
import {
  SYSCOM_CATEGORIES,
  getCategoryParam,
  CATEGORY_LINKS,
} from "@/lib/categories";

describe("lib/categories", () => {
  it("exports 11 categories", () => {
    expect(SYSCOM_CATEGORIES).toHaveLength(11);
  });

  it("getCategoryParam returns syscomId when present", () => {
    const videovigilancia = SYSCOM_CATEGORIES.find((c) => c.slug === "videovigilancia");
    expect(videovigilancia).toBeDefined();
    expect(getCategoryParam(videovigilancia!)).toBe("22");
  });

  it("getCategoryParam returns slug when syscomId is undefined", () => {
    const audio = SYSCOM_CATEGORIES.find((c) => c.slug === "audio-y-video");
    expect(audio).toBeDefined();
    expect(getCategoryParam(audio!)).toBe("audio-y-video");
  });

  it("CATEGORY_LINKS has href and categoryParam for each", () => {
    expect(CATEGORY_LINKS).toHaveLength(11);
    CATEGORY_LINKS.forEach((link) => {
      expect(link).toHaveProperty("label");
      expect(link).toHaveProperty("href");
      expect(link).toHaveProperty("categoryParam");
      expect(link.href).toContain(link.categoryParam);
    });
  });
});
