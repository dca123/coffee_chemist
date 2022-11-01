import { publicProcedure, router } from "../trpc";

export const reviewRouter = router({
  reviews: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.review.findMany();
  }),
});
