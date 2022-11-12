import { Brew } from "@prisma/client";
import { z } from "zod";

export const CreateReviewInput = z.object({
  aroma_quality: z.number().min(1).max(10),
  aroma_intensity: z.number().min(1).max(10),

  acidity_quality: z.number().min(1).max(10),
  acidity_intensity: z.number().min(1).max(10),

  sweetness_quality: z.number().min(1).max(10),
  sweetness_intensity: z.number().min(1).max(10),

  body_quality: z.number().min(1).max(10),
  body_intensity: z.number().min(1).max(10),

  finish_quality: z.number().min(1).max(10),
  finish_intensity: z.number().min(1).max(10),

  coffee_id: z.string(),
  notes: z.string().optional(),
  brew: z.nativeEnum(Brew),
});
export type CreateReviewInput = z.infer<typeof CreateReviewInput>;
