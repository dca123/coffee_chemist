import { router } from "../trpc";
import { authRouter } from "./auth";
import { cafeRouter } from "./cafe";
import { coffeeRouter } from "./coffee";
import { reviewRouter } from "./review";

export const appRouter = router({
  auth: authRouter,
  review: reviewRouter,
  coffee: coffeeRouter,
  cafe: cafeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
