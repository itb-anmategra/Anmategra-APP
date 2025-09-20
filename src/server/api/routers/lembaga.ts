import { TRPCError } from '@trpc/server';
import { and, eq, gte, lte, or } from 'drizzle-orm';
import {
  createTRPCRouter,
  lembagaProcedure,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import {
  associationRequests,
  bestStaffKegiatan,
  bestStaffLembaga,
  events,
  keanggotaan,
  kehimpunan,
  lembaga,
  mahasiswa,
  users,
} from '~/server/db/schema';

import {
  AcceptRequestAssociationInputSchema,
  AcceptRequestAssociationOutputSchema,
  AddAnggotaLembagaInputSchema,
  AddAnggotaLembagaOutputSchema,
  ChooseBestStaffKegiatanInputSchema,
  ChooseBestStaffKegiatanOutputSchema,
  ChooseBestStaffLembagaInputSchema,
  ChooseBestStaffLembagaOutputSchema,
  DeclineRequestAssociationInputSchema,
  DeclineRequestAssociationOutputSchema,
  EditProfilLembagaInputSchema,
  EditProfilLembagaOutputSchema,
  GetAllAnggotaLembagaInputSchema,
  GetAllAnggotaLembagaOutputSchema,
  GetAllRequestAssociationOutputSchema,
  GetBestStaffLembagaOptionsInputSchema,
  GetBestStaffLembagaOptionsOutputSchema,
  GetBestStaffOptionsInputSchema,
  GetBestStaffOptionsOutputSchema,
  GetInfoLembagaInputSchema,
  GetInfoLembagaOutputSchema,
  GetLembagaEventsInputSchema,
  GetLembagaEventsOutputSchema,
  GetLembagaHighlightedEventInputSchema,
  GetLembagaHighlightedEventOutputSchema,
  RemoveAnggotaLembagaInputSchema,
  RemoveAnggotaLembagaOutputSchema,
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

  // Fetch all associated events with lembaga
  getAllRequestAssociation: lembagaProcedure
    .output(GetAllRequestAssociationOutputSchema)
    .query(async ({ ctx }) => {
      const requests = await ctx.db
        .select({
          event_id: associationRequests.event_id,
          event_name: events.name,
          user_id: associationRequests.user_id,
          mahasiswa_name: users.name,
          division: associationRequests.division,
          position: associationRequests.position,
        })
        .from(associationRequests)
        .innerJoin(users, eq(associationRequests.user_id, users.id))
        .innerJoin(events, eq(associationRequests.event_id, events.id))
        .where(eq(events.org_id, ctx.session?.user?.lembagaId ?? ''));

      return requests.map((req) => ({
        event_id: req.event_id ?? '',
        event_name: req.event_name ?? '',
        user_id: req.user_id ?? '',
        mahasiswa_name: req.mahasiswa_name ?? '',
        division: req.division ?? '',
        position: req.position ?? '',
      }));
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

  acceptRequestAssociation: lembagaProcedure
    .input(AcceptRequestAssociationInputSchema)
    .output(AcceptRequestAssociationOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        if (!ctx.session.user.lembagaId) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        const isExistAndAuthorized = await ctx.db
          .select({ id: associationRequests.id })
          .from(associationRequests)
          .innerJoin(
            events,
            and(
              eq(associationRequests.event_id, events.id),
              eq(events.org_id, ctx.session.user.lembagaId),
            ),
          )
          .where(
            and(
              eq(associationRequests.event_id, input.event_id),
              eq(associationRequests.user_id, input.user_id),
              eq(associationRequests.status, 'Pending'),
            ),
          )
          .limit(1);

        if (isExistAndAuthorized.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Association request not found.',
          });
        }

        const isUserAlreadyParticipant = await ctx.db
          .select({ id: keanggotaan.id })
          .from(keanggotaan)
          .where(
            and(
              eq(keanggotaan.event_id, input.event_id),
              eq(keanggotaan.user_id, input.user_id),
            ),
          )
          .limit(1);
        if (isUserAlreadyParticipant.length > 0) {
          return {
            success: false,
            error:
              'User sudah terdaftar di dalam kegiatan, silahkan edit posisi dan divisi di halaman kegiatan tersebut.',
          };
        }

        const eventToUpdate = await ctx.db.query.events.findFirst({
          where: and(
            eq(events.id, input.event_id),
            eq(events.org_id, ctx.session.user.lembagaId),
          ),
          columns: {
            id: true,
            participant_count: true,
          },
        });

        if (!eventToUpdate) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
          });
        }

        await ctx.db.transaction(async (tx) => {
          await tx.insert(keanggotaan).values({
            id: input.event_id + '_' + input.user_id,
            event_id: input.event_id,
            user_id: input.user_id,
            position: input.position,
            division: input.division,
          });

          await tx
            .update(events)
            .set({
              participant_count: eventToUpdate.participant_count + 1,
            })
            .where(eq(events.id, eventToUpdate.id));

          await tx
            .update(associationRequests)
            .set({
              status: 'Accepted',
            })
            .where(
              and(
                eq(associationRequests.event_id, input.event_id),
                eq(associationRequests.user_id, input.user_id),
              ),
            );
        });

        return {
          success: true,
        };
      } catch (error) {
        console.error('Database Error:', error);
        return {
          success: false,
        };
      }
    }),

  declineRequestAssociation: lembagaProcedure
    .input(DeclineRequestAssociationInputSchema)
    .output(DeclineRequestAssociationOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        if (!ctx.session.user.lembagaId) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        const isExistAndAuthorized = await ctx.db
          .select({ id: associationRequests.id })
          .from(associationRequests)
          .innerJoin(
            events,
            and(
              eq(associationRequests.event_id, events.id),
              eq(events.org_id, ctx.session.user.lembagaId),
            ),
          )
          .where(
            and(
              eq(associationRequests.event_id, input.event_id),
              eq(associationRequests.user_id, input.user_id),
              eq(associationRequests.status, 'Pending'),
            ),
          )
          .limit(1);

        if (isExistAndAuthorized.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Association request not found.',
          });
        }

        await ctx.db
          .update(associationRequests)
          .set({
            status: 'Declined',
          })
          .where(
            and(
              eq(associationRequests.event_id, input.event_id),
              eq(associationRequests.user_id, input.user_id),
            ),
          );

        return {
          success: true,
        };
      } catch (error) {
        console.error('Database Error:', error);
        return {
          success: false,
        };
      }
    }),

  getBestStaffOptions: protectedProcedure
    .input(GetBestStaffOptionsInputSchema)
    .output(GetBestStaffOptionsOutputSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const staffOptions = await ctx.db
        .select({
          user_id: users.id,
          name: users.name,
        })
        .from(keanggotaan)
        .innerJoin(users, eq(keanggotaan.user_id, users.id))
        .where(
          and(
            eq(keanggotaan.event_id, input.event_id),
            eq(keanggotaan.division, input.division),
          ),
        );

      return {
        staff_options: staffOptions.map((staff) => ({
          user_id: staff.user_id,
          name: staff.name ?? 'Tidak Diketahui',
        })),
      };
    }),

  chooseBestStaffKegiatan: lembagaProcedure
    .input(ChooseBestStaffKegiatanInputSchema)
    .output(ChooseBestStaffKegiatanOutputSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      // Verify that the event belongs to the lembaga
      const eventOrg = await ctx.db.query.events.findFirst({
        where: eq(events.id, input.event_id),
        columns: { org_id: true },
      });

      if (ctx.session.user.lembagaId !== eventOrg?.org_id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      // Verify the start date and end date is valid
      if (new Date(input.start_date) > new Date(input.end_date)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Start date tidak boleh lebih besar dari end date',
        });
      }

      const existing = await ctx.db.query.bestStaffKegiatan.findMany({
        where: and(
          eq(bestStaffKegiatan.eventId, input.event_id),
          // overlap condition:
          or(
            and(
              lte(bestStaffKegiatan.startDate, new Date(input.end_date)),
              gte(bestStaffKegiatan.endDate, new Date(input.start_date)),
            ),
          ),
        ),
      });

      if (existing.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Tanggal bentrok dengan Best Staff lain di divisi ini.',
        });
      }

      // insert to tabel bestStaffKegiatan
      await ctx.db.insert(bestStaffKegiatan).values(
        input.best_staff_list.map((staff) => ({
          id: crypto.randomUUID(),
          eventId: input.event_id,
          mahasiswaId: staff.user_id,
          division: staff.division,
          startDate: new Date(input.start_date),
          endDate: new Date(input.end_date),
        })),
      );

      return {
        success: true,
      };
    }),

  getBestStaffLembagaOptions: protectedProcedure
    .input(GetBestStaffLembagaOptionsInputSchema)
    .output(GetBestStaffLembagaOptionsOutputSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const staffOptions = await ctx.db
        .select({
          user_id: users.id,
          name: users.name,
        })
        .from(kehimpunan)
        .innerJoin(users, eq(kehimpunan.userId, users.id))
        .where(
          and(
            eq(kehimpunan.lembagaId, input.lembaga_id),
            eq(kehimpunan.division, input.division),
          ),
        );

      return {
        staff_options: staffOptions.map((staff) => ({
          user_id: staff.user_id,
          name: staff.name ?? 'Tidak Diketahui',
        })),
      };
    }),

  chooseBestStaffLembaga: lembagaProcedure
    .input(ChooseBestStaffLembagaInputSchema)
    .output(ChooseBestStaffLembagaOutputSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      // Verify that lembaga id matches
      if (ctx.session.user.lembagaId !== input.lembaga_id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      // Verify the start date and end date is valid
      if (new Date(input.start_date) > new Date(input.end_date)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Start date tidak boleh lebih besar dari end date',
        });
      }

      const existing = await ctx.db.query.bestStaffLembaga.findMany({
        where: and(
          eq(bestStaffLembaga.lembagaId, input.lembaga_id),
          // overlap condition:
          or(
            and(
              lte(bestStaffLembaga.startDate, new Date(input.end_date)),
              gte(bestStaffLembaga.endDate, new Date(input.start_date)),
            ),
          ),
        ),
      });

      if (existing.length > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Tanggal bentrok dengan Best Staff lain di divisi ini.',
        });
      }

      // insert to tabel bestStaffKegiatan
      await ctx.db.insert(bestStaffLembaga).values(
        input.best_staff_list.map((staff) => ({
          id: crypto.randomUUID(),
          lembagaId: input.lembaga_id,
          mahasiswaId: staff.user_id,
          division: staff.division,
          startDate: new Date(input.start_date),
          endDate: new Date(input.end_date),
        })),
      );

      return {
        success: true,
      };
    }),
});
