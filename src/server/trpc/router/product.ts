import { publicProcedure } from "./../trpc";
import { router } from "../trpc";
import { z } from "zod";

export const productRouter = router({
  getAllProducts: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.product.findMany();
  }),
  getProductsWithDetails: publicProcedure
    .input(z.array(z.number()))
    .query(async ({ ctx, input }) => {
      // return await input.map((item)=>{
      //   ctx.prisma.product.findFirst
      // })
      return await ctx.prisma.product.findMany({
        where: {
          pid: {
            in: input,
          },
        },
      });
    }),
  getProductwithDetails: publicProcedure
    .input(
      z.object({
        product_id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.product.findUnique({
        where: {
          pid: input?.product_id,
        },
      });
    }),
  getsimilarProducts: publicProcedure
    .input(
      z.object({
        category_id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.category.findUnique({
        where: {
          id: input?.category_id,
        },
        include: {
          product: true,
        },
      });
    }),
});
