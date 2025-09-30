import { TRPCError } from '@trpc/server';
import { set } from 'date-fns';
import { eq } from 'drizzle-orm';
import { and, desc, like, or } from 'drizzle-orm';
import { z } from 'zod';
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '~/server/api/trpc';
import {
  GetAllReportOutputSchema,
  GetAllReportsAdminInputSchema,
  SetReportStatusInputSchema,
  SetReportStatusOutputSchema,
} from '~/server/api/types/admin.type';
import { getServerAuthSession } from '~/server/auth';
import { users, verifiedUsers } from '~/server/db/schema';
import { support } from '~/server/db/schema';

export const adminRouter = createTRPCRouter({
  addVerifiedEmail: adminProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = await getServerAuthSession();
      if (session?.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const user = await ctx.db
        .insert(verifiedUsers)
        .values({
          email: input.email,
        })
        .returning();
      return user;
    }),

  deleteVerifiedEmail: adminProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = await getServerAuthSession();
      if (session?.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      const verified_user = await ctx.db.query.verifiedUsers.findFirst({
        where: eq(verifiedUsers.email, input.email),
      });
      let userVer;
      if (verified_user) {
        userVer = await ctx.db
          .delete(verifiedUsers)
          .where(eq(verifiedUsers.email, input.email))
          .returning();
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

  getAllReportsAdmin: adminProcedure
    .input(GetAllReportsAdminInputSchema)
    .output(GetAllReportOutputSchema)
    .query(async ({ ctx, input }) => {
      try {
        const reports = await ctx.db
          .select()
          .from(support)
          .where(
            and(
              input.search
                ? or(
                    like(support.subject, `%${input.search}%`),
                    like(support.topic, `%${input.search}%`),
                  )
                : undefined,
              input.status ? eq(support.status, input.status) : undefined,
            ),
          )
          .orderBy(desc(support.created_at));
        return reports.map((report) => ({
          id: report.id,
          subject: report.subject,
          topic: report.topic,
          description: report.description,
          status: report.status,
          attachment: report.attachment,
          created_at: report.created_at.toISOString(),
          updated_at: report.updated_at.toISOString(),
        }));
      } catch (error) {
        console.error('Error fetching reports:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch reports',
        });
      }
    }),

  setReportStatus: adminProcedure
    .input(SetReportStatusInputSchema)
    .output(SetReportStatusOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const report = await ctx.db
          .update(support)
          .set({ status: input.status, updated_at: new Date() })
          .where(eq(support.id, input.reportId))
          .returning();
        if (report.length === 0) {
          return { success: false, message: 'Report not found' };
        }
        return { success: true, message: 'Report status updated successfully' };
      } catch (error) {
        console.error('Error updating report status:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update report status',
        });
      }
    }),
});
