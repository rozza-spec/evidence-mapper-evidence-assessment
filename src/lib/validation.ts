import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  qualification: z.string().min(1, "Qualification is required"),
  totalOwing: z.coerce.number().min(0, "Amount must be 0 or more").default(0),
});

export const createPaymentSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  note: z.string().max(500).optional().or(z.literal("")),
});

export const evidenceActionSchema = z.object({
  evidenceItemId: z.string().min(1, "Evidence item ID is required"),
  status: z.string().optional().default("uploaded"),
  assessorVerdict: z.string().nullable().optional(),
});

export const competencyActionSchema = z.object({
  unitCode: z.string().min(1, "Unit code is required"),
  status: z.string().min(1, "Status is required"),
  assessorId: z.string().optional(),
});

export const updateStudentSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  qualification: z.string().min(1).optional(),
  totalOwing: z.coerce.number().min(0).optional(),
});
