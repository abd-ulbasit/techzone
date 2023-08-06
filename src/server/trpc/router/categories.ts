import { publicProcedure } from "./../trpc";
import { router } from "../trpc";
import { z } from "zod";

export const catergoriesRouter = router({
  getCatogoires: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.category.findMany();
  }),
});
