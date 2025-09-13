import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { get } from 'http';
import { toNamespacedPath } from 'path/posix';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import {
  keanggotaan,
  kehimpunan,
  lembaga,
  mahasiswa,
  users,
} from '~/server/db/schema';

import {
  AddAnggotaLembagaInputSchema,
  AddAnggotaLembagaOutputSchema,
  EditProfilLembagaInputSchema,
  EditProfilLembagaOutputSchema,
  GetAllAnggotaLembagaInputSchema,
  GetAllAnggotaLembagaOutputSchema,
  GetInfoLembagaInputSchema,
  GetInfoLembagaOutputSchema,
  GetLembagaEventsInputSchema,
  GetLembagaEventsOutputSchema,
  GetLembagaHighlightedEventInputSchema,
  GetLembagaHighlightedEventOutputSchema,
  RemoveAnggotaLembagaInputSchema,
  RemoveAnggotaLembagaOutputSchema,
  getBestStaffOptionsInputSchema,
  getBestStaffOptionsOutputSchema,
} from '../types/lembaga.type';

export const lembagaRouter = createTRPCRouter({
  // Fetch lembaga general information
  getInfo: protectedProcedure
    .input(GetInfoLembagaInputSchema)
    .output(GetInfoLembagaOutputSchema)
    .query(async ({ ctx, input }) => {
      const lembaga = await ctx.db.query.lembaga.findFirst({
        where: (lembaga, { eq }) => eq(lembaga.id, input.lembagaId),
        with: {
          users: {},
        },
      });

      if (!lembaga) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Lembaga not found',
        });
      }

      return {
        id: lembaga.id,
        nama: lembaga.name,
        foto: lembaga.users.image,
        deskripsi: lembaga.description,
        tanggal_berdiri: lembaga.foundingDate,
        tipe_lembaga: lembaga.type,
        detail_tambahan: {
          jurusan: lembaga.type === 'Himpunan' ? lembaga.major : null,
          bidang: lembaga.type === 'UKM' ? lembaga.field : null,
          jumlah_anggota: lembaga.memberCount,
        },
      };
    }),

  getAllAnggota: protectedProcedure
    .input(GetAllAnggotaLembagaInputSchema)
    .output(GetAllAnggotaLembagaOutputSchema)
    .query(async ({ ctx, input }) => {
      try {
        const anggota = await ctx.db
          .select({
            id: users.id,
            nama: users.name,
            nim: mahasiswa.nim,
            divisi: kehimpunan.division,
            posisi: kehimpunan.position,
          })
          .from(kehimpunan)
          .innerJoin(users, eq(kehimpunan.userId, users.id))
          .innerJoin(mahasiswa, eq(users.id, mahasiswa.userId))
          .where(eq(kehimpunan.lembagaId, input.lembagaId));

        return anggota.map((anggota) => ({
          id: anggota.id,
          nama: anggota.nama ?? 'Tidak Diketahui',
          nim: anggota.nim.toString(),
          divisi: anggota.divisi,
          posisi: anggota.posisi,
          posisiColor: 'blue',
        }));
      } catch (error) {
        console.error('Database Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database Error',
        });
      }
    }),

  // Fetch highlighted/pinned event
  getHighlightedEvent: protectedProcedure
    .input(GetLembagaHighlightedEventInputSchema)
    .output(GetLembagaHighlightedEventOutputSchema)
    .query(async ({ ctx, input }) => {
      const highlightedEvent = await ctx.db.query.events.findFirst({
        where: (event, { eq, and }) =>
          and(
            eq(event.org_id, input.lembagaId),
            eq(event.is_highlighted, true),
          ),
      });

      if (!highlightedEvent) return null;

      return {
        id: highlightedEvent.id,
        nama: highlightedEvent.name,
        deskripsi: highlightedEvent.description,
        poster: highlightedEvent.image,
      };
    }),

  // Fetch paginated list of events
  getEvents: protectedProcedure
    .input(GetLembagaEventsInputSchema)
    .output(GetLembagaEventsOutputSchema)
    .query(async ({ ctx, input }) => {
      const limit = 10;
      const offset = (input.page - 1) * limit;

      const [events, totalEvents] = await Promise.all([
        ctx.db.query.events.findMany({
          where: (event, { eq }) => eq(event.org_id, input.lembagaId),
          orderBy: (event, { desc }) => [desc(event.start_date)],
          limit,
          offset,
        }),
        ctx.db.query.events
          .findMany({
            where: (event, { eq }) => eq(event.org_id, input.lembagaId),
            columns: { id: true },
          })
          .then((events) => events.length),
      ]);

      return {
        events: events.map((event) => ({
          id: event.id,
          nama: event.name,
          deskripsi: event.description,
          poster: event.image,
          start_date: event.start_date,
        })),
        totalPages: Math.ceil(totalEvents / limit),
      };
    }),

  // Add new anggota to lembaga
  addAnggota: protectedProcedure
    .input(AddAnggotaLembagaInputSchema)
    .output(AddAnggotaLembagaOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const lembagaUserId = ctx.session.user.id;

        if (!ctx.session.user.lembagaId) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }

        await ctx.db.insert(kehimpunan).values({
          id: input.user_id + '_' + lembagaUserId,
          lembagaId: ctx.session.user.lembagaId,
          userId: input.user_id,
          division: input.division,
          position: input.position,
        });

        return {
          success: true,
        };
      } catch (error) {
        console.error('Database Error:', error);
        return {
          success: false,
          error: 'Database Error',
        };
      }
    }),

  removeAnggota: protectedProcedure
    .input(RemoveAnggotaLembagaInputSchema)
    .output(RemoveAnggotaLembagaOutputSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      await ctx.db
        .delete(kehimpunan)
        .where(
          and(
            eq(kehimpunan.userId, input.user_id),
            eq(kehimpunan.lembagaId, ctx.session.user.lembagaId),
          ),
        );

      return {
        success: true,
      };
    }),

  editProfil: protectedProcedure
    .input(EditProfilLembagaInputSchema)
    .output(EditProfilLembagaOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const user_id = ctx.session.user.id;

      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      if (input.gambar) {
        await ctx.db
          .update(users)
          .set({
            image: input.gambar,
          })
          .where(eq(users.id, user_id));
      }

      await ctx.db
        .update(lembaga)
        .set({
          name: input.nama,
          description: input.deskripsi,
        })
        .where(eq(lembaga.id, ctx.session.user.lembagaId));

      return {
        success: true,
      };
    }),

  getBestStaffOptions: protectedProcedure
    .input(getBestStaffOptionsInputSchema)
    .output(getBestStaffOptionsOutputSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const staffOptions = await ctx.db
        .select({
          id: users.id,
          nama: users.name,
        })
        .from(keanggotaan)
        .where(
          and(
            eq(keanggotaan.event_id, input.eventId),
            eq(keanggotaan.division, input.division),
          ),
        );

      return {
        staff_options: staffOptions.map((staff) => ({
          user_id: staff.id,
          name: staff.nama,
        })),
      };
    }),
});
