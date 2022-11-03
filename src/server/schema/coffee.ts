import { z } from "zod";

export const CreateCoffeeInput = z.object({
  name: z.string(),
  roast: z.string(),
});
export type CreateCoffeeInput = z.infer<typeof CreateCoffeeInput>;
