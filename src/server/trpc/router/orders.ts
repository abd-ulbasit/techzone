// import { Cart } from '@prisma/client';
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
// import Cart from '../../../pages/Cart';
// import { randomInt } from "crypto";

// const cartType=z.ZodType

export const ordersRouter = router({
  addNewOrder: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const orderdetail = await ctx.prisma.orders.create({
        data: {
          user_id: input.user_id,
          order_date: new Date(),
          delivered: 0,
          // order_detail:{
          //   createMany:{
          //     // data: input.
          //   }
          // }
          // order_id: randomInt(1000000),
        },
      });
      console.log(orderdetail);
      return orderdetail;
    }),
  getorderDetails: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.orders.findFirst({
        where: {
          user_id: input.user_id,
        },
      });
    }),
});
