import { productRouter } from "./product";
import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { catergoriesRouter } from "./categories";
import { cartRouter } from "./cart";
export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  categories: catergoriesRouter,
  products: productRouter,
  cart: cartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
