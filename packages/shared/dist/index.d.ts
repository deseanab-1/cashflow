import { z } from "zod";
export declare const MoneyCentsSchema: z.ZodNumber;
export declare const IsoDateSchema: z.ZodString;
export declare const UuidSchema: z.ZodString;
export declare const CreateCategorySchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export declare const CreateAccountSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        checking: "checking";
        savings: "savings";
        credit: "credit";
        cash: "cash";
    }>;
}, z.core.$strip>;
export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
export declare const CreateTransactionSchema: z.ZodObject<{
    accountId: z.ZodString;
    categoryId: z.ZodString;
    date: z.ZodString;
    amountCents: z.ZodNumber;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
