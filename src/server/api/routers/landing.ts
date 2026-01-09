import { and, eq, ilike, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { events, lembaga, mahasiswa, users } from '~/server/db/schema';
import { type Kepanitiaan } from '~/types/kepanitiaan';

import {
  GetRecentEventsOutputSchema,
  GetTopEventsOutputSchema,
  SearchAllOutputSchema,
  SearchAllQueryInputSchema,
  searchPreviewInputSchema,
  searchPreviewOutputSchema,
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
        anggotaCount: item.participant_count ?? 0,
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
        anggotaCount: item.participant_count ?? 0,
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
            userId: users.id,
            nama: users.name,
            nim: mahasiswa.nim,
            jurusan: mahasiswa.jurusan,
            image: users.image,
          })
          .from(users)
          .innerJoin(mahasiswa, eq(users.id, mahasiswa.userId))
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
        userId: mahasiswa.userId,
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
        anggotaCount: item.memberCount ?? 0,
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
        anggotaCount: item.participant_count ?? 0,
        startDate: new Date(item.start_date),
        endDate: item.end_date ? new Date(item.end_date) : null,
      }));

      return {
        mahasiswa: formattedMahasiswa,
        lembaga: formattedLembaga,
        kegiatan: formattedKepanitiaan,
      };
    }),

  searchPreview: protectedProcedure
    .input(searchPreviewInputSchema)
    .output(searchPreviewOutputSchema)
    .query(async ({ ctx, input }) => {
      const { query } = input;
      const q = query.trim();

      if (q.length < 2) {
        return {
          mahasiswa: [],
          lembaga: [],
          kegiatan: [],
        };
      }
      const isNumeric = /^[0-9]+$/.test(q);

      // nim search
      if (isNumeric) {
        let mahasiswaRes = await ctx.db
          .select({
            userId: mahasiswa.userId,
            nama: mahasiswa.nama,
            nim: sql<string>`${mahasiswa.nim}::text`,
          })
          .from(mahasiswa)
          .where(sql`${mahasiswa.nim}::text LIKE ${q + '%'}`)
          .limit(2);

        if (mahasiswaRes.length === 0) {
          mahasiswaRes = await ctx.db
            .select({
              userId: mahasiswa.userId,
              nama: mahasiswa.nama,
              nim: sql<string>`${mahasiswa.nimTpb}::text`,
            })
            .from(mahasiswa)
            .where(
              and(
                sql`${mahasiswa.nimTpb} IS NOT NULL`,
                sql`${mahasiswa.nimTpb}::text LIKE ${q + '%'}`,
              ),
            )
            .limit(2);
        }

        return {
          mahasiswa: mahasiswaRes.map((m) => ({
            userId: m.userId,
            nama: m.nama ?? '',
            nim: m.nim,
          })),
          lembaga: [],
          kegiatan: [],
        };
      }

      // name search
      const [mahasiswaRes, lembagaRes, kegiatanRes] = await Promise.all([
        // Mahasiswa
        ctx.db
          .select({
            userId: mahasiswa.userId,
            nama: mahasiswa.nama,
            nim: sql<string>`${mahasiswa.nim}::text`,
          })
          .from(mahasiswa)
          .where(sql`${mahasiswa.nama} ILIKE ${'%' + q + '%'}`)
          .limit(2),

        // Lembaga
        ctx.db
          .select({
            lembagaId: lembaga.id,
            name: lembaga.name,
          })
          .from(lembaga)
          .where(sql`${lembaga.name} ILIKE ${'%' + q + '%'}`)
          .limit(2),

        // Events / Kegiatan
        ctx.db
          .select({
            id: events.id,
            name: events.name,
          })
          .from(events)
          .where(sql`${events.name} ILIKE ${'%' + q + '%'}`)
          .limit(2),
      ]);

      return {
        mahasiswa: mahasiswaRes.map((m) => ({
          userId: m.userId,
          nama: m.nama ?? '',
          nim: m.nim,
        })),
        lembaga: lembagaRes,
        kegiatan: kegiatanRes,
      };
    }),
});
