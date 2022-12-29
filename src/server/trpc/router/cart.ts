// import { Input } from "postcss";
import { string, z } from "zod";
import { publicProcedure, router } from "./../trpc";

export const cartRouter = router({
  addtoCart: publicProcedure
    .input(
      z.object({
        uId: z.string(),
        pId: z.number(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.cart.create({
        data: {
          product_id: input?.pId,
          user_id: input?.uId,
          product_quantity: input?.quantity,
        },
      });
    }),
  getUserCart: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.cart.findMany({
        where: {
          user_id: input.user_id,
        },
      });
    }),
  AddOneToCart: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        product_id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.cart.update({
        where: {
          user_id_product_id: {
            user_id: input.user_id,
            product_id: input.product_id,
          },
        },
        data: {
          product_quantity: {
            increment: 1,
          },
        },
      });
    }),
  decrementFromCart: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        product_id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.cart.update({
        where: {
          user_id_product_id: {
            user_id: input.user_id,
            product_id: input.product_id,
          },
        },
        data: {
          product_quantity: {
            decrement: 1,
          },
        },
      });
    }),
  RemoveFromCart: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        product_id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.cart.delete({
        where: {
          user_id_product_id: {
            user_id: input.user_id,
            product_id: input.product_id,
          },
        },
      });
    }),
  emptyCart: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.cart.deleteMany({
        where: {
          user_id: input.user_id,
        },
      });
    }),
  getnumberofItemsInCart: publicProcedure
    .input(
      z.object({
        user_id: string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const cart = await ctx.prisma.cart.findMany({
        where: {
          user_id: input.user_id,
        },
      });
      const sum = cart
        .map((e) => {
          return e.product_quantity;
        })
        .reduce((nsum: number, x: number) => {
          return nsum + x;
        }, 0);
      //   const agg=sum.
      return sum as number;
      // const sum =cart.reduce((item)=>{
      //     return item.
      // })
    }),
  getCart: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.cart.findMany({
        where: {
          user_id: input.user_id,
        },
        include: {
          product: true,
        },
      });
    }),
});
