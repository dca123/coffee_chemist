import { z } from "zod";

export const CreateReviewInput = z.object({
  aroma_quality: z.number().min(1).max(10),
  aroma_quantity: z.number().min(1).max(10),

  acidity_quality: z.number().min(1).max(10),
  acidity_quantity: z.number().min(1).max(10),

  sweetness_quality: z.number().min(1).max(10),
  sweetness_quantity: z.number().min(1).max(10),

  body_quality: z.number().min(1).max(10),
  body_quantity: z.number().min(1).max(10),

  finish_quality: z.number().min(1).max(10),
  finish_quantity: z.number().min(1).max(10),
});
export type CreateReviewInput = z.infer<typeof CreateReviewInput>;
