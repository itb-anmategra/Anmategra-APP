import { eq } from "drizzle-orm";

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { getServerAuthSession } from "~/server/auth";
import { users, verifiedUsers } from "~/server/db/schema";

export const adminRouter = createTRPCRouter({
  addVerifiedEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {

      const session = await getServerAuthSession()
      if (session?.user.role !== "admin") {
        throw new Error("Unauthorized")
      }

      const user = await ctx.db.insert(verifiedUsers).values({
        email: input.email,
      }).returning();
      return user;
    }),

  deleteVerifiedEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {

      const session = await getServerAuthSession()
      if (session?.user.role !== "admin") {
        throw new Error("Unauthorized")
      }

      const verified_user = await ctx.db.query.verifiedUsers.findFirst({
        where: eq(verifiedUsers.email, input.email),
      });
      let userVer;
      if (verified_user) {
        userVer = await ctx.db
          .delete(verifiedUsers)
          .where(eq(verifiedUsers.email, input.email)).returning();
      }
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });
      if (user) {
        await ctx.db.delete(users).where(eq(users.email, input.email));
        return user;
      }
      return userVer;
    }),
});
