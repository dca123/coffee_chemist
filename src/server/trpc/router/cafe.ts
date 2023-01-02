import { publicProcedure, router } from "../trpc";

export const cafeRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.cafe.findMany();
  })
})