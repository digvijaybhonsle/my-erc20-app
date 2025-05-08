// server/src/utils/validators.ts
import { z } from "zod";

export const TransferSchema = z.object({
  to:     z.string().length(42),      // Ethereum address
  amount: z.string().regex(/^\d+(\.\d+)?$/), // Decimal number as string
});

export const BalanceParamsSchema = z.object({
  address: z.string().length(42),
});
