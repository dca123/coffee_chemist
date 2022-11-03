import { CreateReviewInput } from "../../schema/review";
import { publicProcedure, router } from "../trpc";

export const reviewRouter = router({
  reviews: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.review.findMany();
  }),
  create: publicProcedure
    .input(CreateReviewInput)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.review.create({
        data: {
          ...input,
          author: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
        },
      });
    }),
});
