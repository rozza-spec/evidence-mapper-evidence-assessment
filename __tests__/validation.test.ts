import { describe, it, expect } from "vitest";
import {
  createStudentSchema,
  createPaymentSchema,
  evidenceActionSchema,
  competencyActionSchema,
  updateStudentSchema,
} from "@/lib/validation";

describe("createStudentSchema", () => {
  it("accepts valid student data", () => {
    const result = createStudentSchema.safeParse({
      name: "John Smith",
      email: "john@example.com",
      phone: "0412345678",
      qualification: "CPC40120",
      totalOwing: 7000,
    });
    expect(result.success).toBe(true);
  });

  it("accepts minimal required fields", () => {
    const result = createStudentSchema.safeParse({
      name: "Jane",
      qualification: "CPC50220",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.totalOwing).toBe(0);
    }
  });

  it("rejects empty name", () => {
    const result = createStudentSchema.safeParse({
      name: "",
      qualification: "CPC40120",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = createStudentSchema.safeParse({
      name: "Test",
      qualification: "CPC40120",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative totalOwing", () => {
    const result = createStudentSchema.safeParse({
      name: "Test",
      qualification: "CPC40120",
      totalOwing: -100,
    });
    expect(result.success).toBe(false);
  });

  it("coerces string totalOwing to number", () => {
    const result = createStudentSchema.safeParse({
      name: "Test",
      qualification: "CPC40120",
      totalOwing: "5000",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.totalOwing).toBe(5000);
    }
  });
});

describe("createPaymentSchema", () => {
  it("accepts valid payment", () => {
    const result = createPaymentSchema.safeParse({ amount: 3300, note: "First instalment" });
    expect(result.success).toBe(true);
  });

  it("rejects zero amount", () => {
    const result = createPaymentSchema.safeParse({ amount: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects negative amount", () => {
    const result = createPaymentSchema.safeParse({ amount: -50 });
    expect(result.success).toBe(false);
  });

  it("coerces string amount", () => {
    const result = createPaymentSchema.safeParse({ amount: "1500.50" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(1500.5);
    }
  });
});

describe("evidenceActionSchema", () => {
  it("accepts valid evidence action", () => {
    const result = evidenceActionSchema.safeParse({
      evidenceItemId: "ev-001",
      status: "uploaded",
    });
    expect(result.success).toBe(true);
  });

  it("accepts verdict update", () => {
    const result = evidenceActionSchema.safeParse({
      evidenceItemId: "ev-001",
      assessorVerdict: "verified",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty evidence item ID", () => {
    const result = evidenceActionSchema.safeParse({
      evidenceItemId: "",
    });
    expect(result.success).toBe(false);
  });

  it("defaults status to uploaded", () => {
    const result = evidenceActionSchema.safeParse({
      evidenceItemId: "ev-001",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("uploaded");
    }
  });
});

describe("competencyActionSchema", () => {
  it("accepts valid competency action", () => {
    const result = competencyActionSchema.safeParse({
      unitCode: "CPCCBC4001",
      status: "competent",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing unit code", () => {
    const result = competencyActionSchema.safeParse({
      unitCode: "",
      status: "competent",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing status", () => {
    const result = competencyActionSchema.safeParse({
      unitCode: "CPCCBC4001",
      status: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateStudentSchema", () => {
  it("accepts partial update", () => {
    const result = updateStudentSchema.safeParse({ name: "Updated Name" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = updateStudentSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects invalid email in update", () => {
    const result = updateStudentSchema.safeParse({ email: "bad" });
    expect(result.success).toBe(false);
  });
});
