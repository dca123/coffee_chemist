import { CreateReviewInput } from "../../schema/review";
import { publicProcedure, router } from "../trpc";
import type { Prisma } from "@prisma/client";

export const reviewRouter = router({
  reviews: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.review.findMany({
      include: {
        cafeReview: {
          include: {
            cafe: true,
          },
        },
        homeReview: true,
      },
    });
  }),
  create: publicProcedure
    .input(CreateReviewInput)
    .mutation(async ({ input, ctx }) => {
      const { type, ...data } = input;
      const review:
        | Prisma.ReviewCreateNestedOneWithoutCafeReviewInput
        | Prisma.ReviewCreateNestedOneWithoutHomeReviewInput = {
        create: {
          ...data,
          author: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
        },
      };

      if (type === "cafe") {
        return await ctx.prisma.cafeReview.create({
          data: {
            cafe: {
              connect: {
                id: input.cafeId,
              },
            },
            review,
          },
        });
      } else {
        return await ctx.prisma.homeReview.create({
          data: {
            coffee: {
              connect: {
                id: input.coffeeId,
              },
            },
            review,
          },
        });
      }
    }),
});
