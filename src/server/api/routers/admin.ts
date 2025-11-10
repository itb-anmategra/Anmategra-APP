import { TRPCError } from '@trpc/server';
import { eq, ilike, inArray } from 'drizzle-orm';
import { and, desc, or } from 'drizzle-orm';
import { z } from 'zod';
import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import {
  GetAllReportsAdminInputSchema,
  GetAllReportsAdminOutputSchema,
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
    .output(GetAllReportsAdminOutputSchema)
    .query(async ({ ctx, input }) => {
      try {
        const reports = await ctx.db
          .select()
          .from(support)
          .where(
            and(
              inArray(support.status, ['In Progress', 'Resolved', 'Backlog']), // Only include non-draft reports
              input.status ? eq(support.status, input.status) : undefined,
              input.search
                ? or(
                    ilike(support.subject, `%${input.search}%`),
                    ilike(support.description, `%${input.search}%`),
                  )
                : undefined,
            ),
          )
          .orderBy(desc(support.created_at));
        return {
          reports: reports.map((report) => ({
            id: report.id,
            subject: report.subject,
            urgent: report.urgent,
            description: report.description,
            status: report.status,
            attachment: report.attachment ?? undefined,
            created_at: report.created_at.toISOString(),
            updated_at: report.updated_at.toISOString(),
          })),
        };
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
          .set({ status: input.status })
          .where(eq(support.id, input.id))
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
