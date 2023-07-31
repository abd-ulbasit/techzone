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
      //chech if product count in cart is less than product count in product table
      const product = await ctx.prisma.product.findUnique({
        where: {
          pid: input.product_id,
        },
      });
      const cart = await ctx.prisma.cart.findUnique({
        where: {
          user_id_product_id: {
            user_id: input.user_id,
            product_id: input.product_id,
          },
        },
      });
      if (cart?.product_quantity == product?.quanity_in_inventory) {
        return cart;
      }

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
      if (input.user_id == "") {
        return 0;
      }
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
  getCartWithProducts: publicProcedure
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
