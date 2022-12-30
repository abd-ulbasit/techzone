import { userDetailRouter } from "./userDetail";
import { ordersDetailsRouter } from "./ordersdetails";
import { productRouter } from "./product";
import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { catergoriesRouter } from "./categories";
import { cartRouter } from "./cart";
import { ordersRouter } from "./orders";
export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  categories: catergoriesRouter,
  products: productRouter,
  cart: cartRouter,
  orderdetail: ordersDetailsRouter,
  orders: ordersRouter,
  userdetail: userDetailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
