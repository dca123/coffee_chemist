import { CreateReviewInput } from "../../schema/review";
import { publicProcedure, router } from "../trpc";

export const reviewRouter = router({
  reviews: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.review.findMany();
  }),
  create: publicProcedure
    .input(CreateReviewInput)
    .mutation(({ input, ctx }) => {
      const { coffee_id, ...data } = input;
      return ctx.prisma.review.create({
        data: {
          ...data,
          coffee: {
            connect: {
              id: coffee_id,
            },
          },
          author: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
        },
      });
    }),
});
