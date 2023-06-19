// import { prisma } from "./../../db/client";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const userDetailRouter = router({
  addUserDetail: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        address: z.string(),
        city: z.string(),
        province: z.string(),
        phoneNo: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user_details.create({
        data: {
          user_id: input.user_id,
          address: input.address,
          city: input.city,
          province: input.province,
          // phoneNo: input.phoneNo,
          phoneNo: input.phoneNo,
        },
      });
    }),
  getUserDetail: publicProcedure
    .input(z.object({ user_id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user_details.findFirst({
        where: {
          user_id: input.user_id,
        },
      });
    }),
  updateUserDetail: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        address: z.string(),
        city: z.string(),
        province: z.string(),
        phoneNo: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user_details.update({
        where: {
          user_id: input.user_id,
        },
        data: {
          address: input.address,
          city: input.city,
          province: input.province,
          phoneNo: input.phoneNo,
        },
      });
    }),
});
