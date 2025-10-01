import { eq, ilike, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { mahasiswa, users } from '~/server/db/schema';
import { type Kepanitiaan } from '~/types/kepanitiaan';

import {
  GetRecentEventsOutputSchema,
  GetTopEventsOutputSchema,
  SearchAllOutputSchema,
  SearchAllQueryInputSchema,
} from '../types/landing.type';

export const landingRouter = createTRPCRouter({
  getRecentEvents: publicProcedure
    .input(z.void())
    .output(GetRecentEventsOutputSchema)
    .query(async ({ ctx }) => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const events = await ctx.db.query.events.findMany({
        where: (events, { gte }) => gte(events.start_date, oneMonthAgo),
        orderBy: (events, { desc }) => desc(events.start_date),
        with: {
          lembaga: {
            with: {
              users: {},
            },
          },
        },
        limit: 8,
        columns: {
          id: true,
          name: true,
          description: true,
          image: true,
          start_date: true,
          end_date: true,
          participant_count: true,
          background_image: true,
        },
      });

      const formattedEvents: Kepanitiaan[] = events.map((item) => ({
        lembaga: {
          name: item.lembaga?.name ?? '',
          profilePicture: item.lembaga?.users.image ?? '',
        },
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.background_image,
        quota: item.participant_count ?? 0,
        startDate: new Date(item.start_date),
        endDate: item.end_date ? new Date(item.end_date) : null,
      }));

      return formattedEvents;
    }),

  getTopEvents: publicProcedure
    .input(z.void())
    .output(GetTopEventsOutputSchema)
    .query(async ({ ctx }) => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const events = await ctx.db.query.events.findMany({
        where: (events, { gte }) => gte(events.start_date, sixMonthsAgo),
        orderBy: (events, { desc }) => desc(events.participant_count),
        with: {
          lembaga: {
            columns: {
              name: true,
            },
            with: {
              users: {},
            },
          },
        },
        limit: 8,
        columns: {
          id: true,
          name: true,
          description: true,
          image: true,
          start_date: true,
          end_date: true,
          participant_count: true,
          background_image: true,
        },
      });

      const formattedEvents: Kepanitiaan[] = events.map((item) => ({
        lembaga: {
          name: item.lembaga?.name ?? '',
          profilePicture: item.lembaga?.users.image ?? '',
        },
        id: item.id,
        name: item.name,
        description: item.description,
        quota: item.participant_count ?? 0,
        image: item.background_image,
        startDate: new Date(item.start_date),
        endDate: item.end_date ? new Date(item.end_date) : null,
      }));

      return formattedEvents;
    }),

  searchAll: protectedProcedure
    .input(SearchAllQueryInputSchema)
    .output(SearchAllOutputSchema)
    .query(async ({ ctx, input }) => {
      const { query } = input;
      const limit = 10;

      // Cek apakah query adalah angka (hanya digit 0-9)
      const isNumeric = /^\d+$/.test(query);

      const [mahasiswaResults, lembaga, event] = await Promise.all([
        // Mahasiswa query
        // Inner join User dan Mahasiswa dengan kondisi pencarian
        ctx.db
          .select({
            user_id: users.id,
            nama: users.name,
            nim: mahasiswa.nim,
            jurusan: mahasiswa.jurusan,
            image: users.image,
          })
          .from(users)
          .innerJoin(mahasiswa, eq(users.id, mahasiswa.user_id))
          .where(
            isNumeric
              ? or(
                  // Jika query numerik: cari di kolom nim (integer) dan name (string)
                  // @ts-expect-error Mahasiswa.nim adalah integer
                  ilike(sql`${mahasiswa.nim}::text`, `%${query}%`), // Cast integer ke text untuk ilike
                  ilike(users.name, `%${query}%`),
                )
              : // Jika bukan numerik: cari hanya di kolom name
                ilike(users.name, `%${query}%`),
          )
          .limit(limit),

        // Lembaga query
        ctx.db.query.lembaga.findMany({
          where: (lembaga, { ilike }) => ilike(lembaga.name, `%${query}%`),
          with: {
            users: {},
          },
          limit,
        }),

        // Events query
        ctx.db.query.events.findMany({
          where: (event, { ilike }) => ilike(event.name, `%${query}%`),
          with: {
            lembaga: {
              with: {
                users: {},
              },
            },
          },
          limit,
        }),
      ]);

      const formattedMahasiswa = mahasiswaResults.map((mahasiswa) => ({
        user_id: mahasiswa.user_id,
        nama: mahasiswa.nama ?? '',
        nim: mahasiswa.nim.toString(),
        jurusan: mahasiswa.jurusan,
        image: mahasiswa.image ?? undefined,
      }));

      const formattedLembaga: Kepanitiaan[] = lembaga.map((item) => ({
        lembaga: {
          id: item.id,
          name: item.name,
          profilePicture: item.users?.image ?? '',
        },
        name: item.name,
        description: item.description,
        quota: item.memberCount ?? 0,
        startDate: new Date(item.foundingDate),
        image: item.users?.image,
        endDate: item.endingDate ? new Date(item.endingDate) : null,
      }));

      const formattedKepanitiaan: Kepanitiaan[] = event.map((item) => ({
        lembaga: {
          name: item.lembaga?.name ?? '',
          profilePicture: item.lembaga?.users.image ?? '',
        },
        id: item.id,
        name: item.name,
        description: item.description,
        image: item.background_image,
        quota: item.participant_count ?? 0,
        startDate: new Date(item.start_date),
        endDate: item.end_date ? new Date(item.end_date) : null,
      }));

      return {
        mahasiswa: formattedMahasiswa,
        lembaga: formattedLembaga,
        kegiatan: formattedKepanitiaan,
      };
    }),
});
