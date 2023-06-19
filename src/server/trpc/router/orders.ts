// import { Cart } from '@prisma/client';
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import type { Cart } from "@prisma/client";
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
  addOrder: publicProcedure
    .input(
      z.unknown().refine((data): data is Cart[] => {
        return Array.isArray(data);
      }) as z.ZodType<Cart[]>
    )
    .mutation(async ({ ctx, input }) => {
      //first register an order in orders table
      const order = await ctx.prisma.orders.create({
        data: {
          user_id: input[0]?.user_id as string,
          order_date: new Date(),
        },
      });
      const order_id = order.order_id;
      const order_detail = input.map((item) => {
        return {
          order_id: order_id,
          product_id: item.product_id,
          product_quantity: item.product_quantity,
        };
      });
      //add all theses items in order_details table
      await ctx.prisma.order_detail.createMany({
        data: order_detail,
      });
    }),
});
