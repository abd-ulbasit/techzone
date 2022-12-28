import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    // return await ctx.prisma
    //   .$queryRaw`select * from Session where expires > "2022-02-02"`;

    return await ctx.prisma.session.findMany({
      where: { expires: { gt: new Date("2022-02-02") } },
    });
  }),
  getUser: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
  getuserwithname: publicProcedure
    .input(
      z
        .object({
          name: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx }) => {
      return await ctx.prisma.account.findMany();
    }),
});
