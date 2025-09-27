import { desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import {
  createTRPCRouter,
  lembagaProcedure,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { events, lembaga, users } from '~/server/db/schema';

import {
  GetMostViewedKegiatanOutputSchema,
  IncrementKegiatanViewInputSchema,
} from '../types/event.type';

export const kegiatanRouter = createTRPCRouter({
  // Public Procedures
  getAllPublic: publicProcedure.query(async ({ ctx }) => {
    const kegiatan = await ctx.db.query.events.findMany({
      orderBy: (events, { desc }) => desc(events.start_date),
      columns: {
        org_id: false,
      },
    });
    return kegiatan;
  }),

  getByIdPublic: publicProcedure
    .input(z.object({ event_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const kegiatan = await ctx.db.query.events.findFirst({
        where: (events, { eq }) => eq(events.id, input.event_id),
        with: {
          lembaga: {
            columns: {
              id: true,
              name: true,
              description: true,
            },
            with: {
              users: {
                columns: {
                  image: true,
                },
              },
            },
          },
        },
        columns: {},
      });
      return kegiatan;
    }),

  // lembaga procedure
  getAllByLembaga: lembagaProcedure.query(async ({ ctx }) => {
    const userLembaga = await ctx.db.query.lembaga.findFirst({
      where: (lembaga, { eq }) => eq(lembaga.userId, ctx.session.user.id),
    });
    if (!userLembaga) {
      throw new Error('Lembaga not found');
    }
    const kegiatan = await ctx.db.query.events.findMany({
      where: (events, { eq }) => eq(events.org_id, userLembaga.id),
      orderBy: (events, { desc }) => desc(events.start_date),
      columns: {
        org_id: false,
      },
    });
    return kegiatan;
  }),

  getMostViewedKegiatan: lembagaProcedure
    .input(z.void())
    .output(GetMostViewedKegiatanOutputSchema)
    .query(async ({ ctx }) => {
      const kegiatanData = await ctx.db
        .select({
          lembagaName: lembaga.name,
          profilePicture: users.image,
          id: events.id,
          name: events.name,
          description: events.description,
          image: events.image,
          start_date: events.start_date,
          end_date: events.end_date,
          quota: events.participant_count,
        })
        .from(events)
        .leftJoin(lembaga, eq(events.org_id, lembaga.id))
        .leftJoin(users, eq(lembaga.userId, users.id))
        .orderBy(desc(events.view_count))
        .limit(3);

      return {
        event: kegiatanData.map((item) => ({
          lembaga: {
            name: item.lembagaName ?? '',
            profilePicture: item.profilePicture ?? '',
          },
          id: item.id,
          name: item.name,
          description: item.description ?? '',
          image: item.image ?? '',
          start_date: item.start_date,
          end_date: item.end_date ?? new Date(),
          quota: item.quota ?? 0,
        })),
      };
    }),

  incrementKegiatanView: protectedProcedure
    .input(IncrementKegiatanViewInputSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const kegiatan = await ctx.db
        .update(events)
        .set({ view_count: sql`${events.view_count} + 1` })
        .where(eq(events.id, input.event_id))
        .returning();
      if (kegiatan.length !== 0) {
        return { success: true };
      } else {
        return { success: false };
      }
    }),
});
