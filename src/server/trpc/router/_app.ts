import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { reviewRouter } from "./review";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  review: reviewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
