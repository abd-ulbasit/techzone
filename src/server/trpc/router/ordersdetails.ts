import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const ordersDetailsRouter = router({
  addOrderDetails: publicProcedure
    .input(
      z.object({
        order_id: z.number(),
        product_id: z.number(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.order_detail.create({
        data: {
          order_id: input.order_id,
          product_id: input.product_id,
          product_quantity: input.quantity,
        },
      });
    }),
});
