import { Brew } from "@prisma/client";
import { z } from "zod";

const ReviewSchema = z.object({
  aroma_quality: z.number().min(1).max(10),
  aroma_intensity: z.number().min(1).max(10),
  aroma_notes: z.string().optional(),

  acidity_quality: z.number().min(1).max(10),
  acidity_intensity: z.number().min(1).max(10),
  acidity_notes: z.string().optional(),

  sweetness_quality: z.number().min(1).max(10),
  sweetness_intensity: z.number().min(1).max(10),
  sweetness_notes: z.string().optional(),

  body_quality: z.number().min(1).max(10),
  body_intensity: z.number().min(1).max(10),
  body_notes: z.string().optional(),

  finish_quality: z.number().min(1).max(10),
  finish_intensity: z.number().min(1).max(10),
  finish_notes: z.string().optional(),

  overall_score: z.number().min(1).max(10),

  brew: z.nativeEnum(Brew),
  flavor_notes: z.string().optional(),
});

const CafeReview = ReviewSchema.extend({
  cafeId: z.string(),
  type: z.literal("cafe"),
});

const HomeReview = ReviewSchema.extend({
  coffeeId: z.string(),
  type: z.literal("home"),
});

export const CreateReviewInput = z.discriminatedUnion("type", [
  CafeReview,
  HomeReview,
]);
export type CreateReviewInput = z.infer<typeof CreateReviewInput>;
