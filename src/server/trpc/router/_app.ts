import { router } from "../trpc";
import { authRouter } from "./auth";
import { coffeeRouter } from "./coffee";
import { reviewRouter } from "./review";

export const appRouter = router({
  auth: authRouter,
  review: reviewRouter,
  coffee: coffeeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
