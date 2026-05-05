import { z } from "zod";

export const MoneyCentsSchema = z
  .number()
  .int()
  .safe()
  .describe("Amount in cents (e.g. $12.34 => 1234)");

export const IsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .describe("ISO date in YYYY-MM-DD");

export const UuidSchema = z.string().uuid();

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(64),
});
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;

export const CreateAccountSchema = z.object({
  name: z.string().min(1).max(64),
  type: z.enum(["checking", "savings", "credit", "cash"]),
});
export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;

export const CreateTransactionSchema = z.object({
  accountId: UuidSchema,
  categoryId: UuidSchema,
  date: IsoDateSchema,
  amountCents: MoneyCentsSchema,
  note: z.string().max(280).optional(),
});
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;

