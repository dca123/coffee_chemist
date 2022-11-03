import { CreateCoffeeInput } from "../../schema/coffee";
import { publicProcedure, router } from "../trpc";

export const coffeeRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.coffee.findMany();
  }),
  create: publicProcedure
    .input(CreateCoffeeInput)
    .mutation(({ ctx, input: data }) => {
      return ctx.prisma.coffee.create({
        data,
      });
    }),
});
