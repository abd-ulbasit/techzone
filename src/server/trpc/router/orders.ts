// import { Cart } from '@prisma/client';
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import type { Cart, Product } from "@prisma/client";
// import { pid } from "process";

export const ordersRouter = router({
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
      //update the no of items remaining for each item when an order is placed
      const products = await ctx.prisma.product.findMany({
        where: {
          pid: {
            in: input.map((item) => item.product_id),
          },
        },
      });
      const updatedProducts = products.map((item) => {
        const product = input.find(
          (product) => product.product_id === item.pid
        );
        return {
          ...item,
          quanity_in_inventory:
            item.quanity_in_inventory -
            (product?.product_quantity ? product?.product_quantity : 0),
        } as Product;
      });
      // await ctx.prisma.product.updateMany({
      //   where: {
      //     pid: {
      //       in: updatedProducts.map((item) => item.pid),
      //     },
      //   },
      //   data: {
      //     quanity_in_inventory:{
      //       set:updatedProducts.map((item) => {
      //         where :{pid: item.pid},
      //         data: {quanity_in_inventory: item.quanity_in_inventory}
      //       }),
      //     }
      //   },
      // });
      console.log(updatedProducts);
      await Promise.all(
        updatedProducts.map(async (item) => {
          return await ctx.prisma.product.update({
            where: {
              pid: item.pid,
            },
            data: {
              quanity_in_inventory: item.quanity_in_inventory,
            },
          });
        })
      );
      return order;
    }),
});
