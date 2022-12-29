import { publicProcedure } from "./../trpc";
import { router } from "../trpc";
import { z } from "zod";

export const catergoriesRouter = router({
  getCatogoires: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.category.findMany();
  }),
  getProductbyCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      // return await ctx.prisma.product.findMany({
      //   where:{
      //     category_Id:{
      //       equals: await ctx.prisma.category.findFirst()
      //     }
      //   }
      // })
      return await ctx.prisma.category.findFirst({
        include: {
          product: true,
        },
        where: {
          category_name: {
            equals: input?.category,
          },
        },
      });
    }),
});
