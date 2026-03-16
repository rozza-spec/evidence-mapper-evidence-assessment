import { describe, it, expect } from "vitest";
import { sanitizeFilename } from "@/lib/file-validation";

describe("sanitizeFilename", () => {
  it("keeps alphanumeric, dot, hyphen, underscore", () => {
    expect(sanitizeFilename("report-2024.pdf")).toBe("report-2024.pdf");
  });

  it("replaces spaces with underscores", () => {
    expect(sanitizeFilename("my file name.pdf")).toBe("my_file_name.pdf");
  });

  it("strips special characters", () => {
    expect(sanitizeFilename("invoice@#$%^.pdf")).toBe("invoice_____.pdf");
  });

  it("truncates to 100 characters", () => {
    const longName = "a".repeat(150) + ".pdf";
    expect(sanitizeFilename(longName).length).toBe(100);
  });

  it("handles empty string", () => {
    expect(sanitizeFilename("")).toBe("");
  });

  it("replaces path traversal characters", () => {
    expect(sanitizeFilename("../../../etc/passwd")).toBe(".._.._.._etc_passwd");
  });
});
