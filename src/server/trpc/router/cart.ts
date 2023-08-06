import { z } from "zod";
import { protectedProcedure, router } from "./../trpc";

export const cartRouter = router({
  addtoCart: protectedProcedure
    .input(
      z.object({
        pId: z.number(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.cart.create({
        data: {
          product_id: input.pId,
          user_id: ctx.session.user.id,
          product_quantity: input.quantity,
        },
      });
    }),
  getUserCart: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.cart.findMany({
      where: {
        user_id: ctx.session.user.id,
      },
    });
  }),
  AddOneToCart: protectedProcedure
    .input(
      z.object({
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
            user_id: ctx.session.user.id,
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
            user_id: ctx.session.user.id,
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
  decrementFromCart: protectedProcedure
    .input(
      z.object({
        product_id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.cart.update({
        where: {
          user_id_product_id: {
            user_id: ctx.session.user.id,
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
  RemoveFromCart: protectedProcedure
    .input(
      z.object({
        product_id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.cart.delete({
        where: {
          user_id_product_id: {
            user_id: ctx.session.user.id,
            product_id: input.product_id,
          },
        },
      });
    }),
  emptyCart: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.cart.deleteMany({
      where: {
        user_id: ctx.session.user.id,
      },
    });
  }),
  getCartWithProducts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.cart.findMany({
      where: {
        user_id: ctx.session.user.id,
      },
      include: {
        product: true,
      },
    });
  }),
});
