import { TRPCError } from '@trpc/server';
import { and, desc, eq, gte, lte, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import {
  createTRPCRouter,
  lembagaProcedure,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import {
  associationRequests,
  associationRequestsLembaga,
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
  AcceptRequestAssociationLembagaInputSchema,
  AcceptRequestAssociationLembagaOutputSchema,
  AcceptRequestAssociationOutputSchema,
  AddAnggotaLembagaInputSchema,
  AddAnggotaLembagaOutputSchema,
  ChooseBestStaffKegiatanInputSchema,
  ChooseBestStaffKegiatanOutputSchema,
  ChooseBestStaffLembagaInputSchema,
  ChooseBestStaffLembagaOutputSchema,
  DeclineRequestAssociationInputSchema,
  DeclineRequestAssociationLembagaInputSchema,
  DeclineRequestAssociationLembagaOutputSchema,
  DeclineRequestAssociationOutputSchema,
  EditProfilLembagaInputSchema,
  EditProfilLembagaOutputSchema,
  GetAllAnggotaLembagaInputSchema,
  GetAllAnggotaLembagaOutputSchema,
  GetAllDivisionOutputSchema,
  GetAllHistoryBestStaffKegiatanInputSchema,
  GetAllHistoryBestStaffKegiatanOutputSchema,
  GetAllHistoryBestStaffLembagaInputSchema,
  GetAllHistoryBestStaffLembagaOutputSchema,
  GetAllHistoryBestStaffMahasiswaInputSchema,
  GetAllHistoryBestStaffMahasiswaOutputSchema,
  GetAllKegiatanDivisionInputSchema,
  GetAllLembagaDivisionInputSchema,
  GetAllRequestAssociationLembagaOutputSchema,
  GetAllRequestAssociationOutputSchema,
  GetBestStaffLembagaOptionsInputSchema,
  GetBestStaffLembagaOptionsOutputSchema,
  GetBestStaffOptionsInputSchema,
  GetBestStaffOptionsOutputSchema,
  GetInfoLembagaInputSchema,
  GetInfoLembagaOutputSchema,
  GetLatestBestStaffKegiatanInputSchema,
  GetLatestBestStaffKegiatanOutputSchema,
  GetLatestBestStaffLembagaInputSchema,
  GetLatestBestStaffLembagaOutputSchema,
  GetLembagaEventsInputSchema,
  GetLembagaEventsOutputSchema,
  GetLembagaHighlightedEventInputSchema,
  GetLembagaHighlightedEventOutputSchema,
  GetMostViewedLembagaOutputSchema,
  IncrementLembagaViewInputSchema,
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

  getAllLembagaDivision: protectedProcedure
    .input(GetAllLembagaDivisionInputSchema)
    .output(GetAllDivisionOutputSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      if (ctx.session.user.lembagaId !== input.lembaga_id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const divisionsRaw = await ctx.db
        .select({ division: kehimpunan.division })
        .from(kehimpunan)
        .where(eq(kehimpunan.lembagaId, input.lembaga_id));

      const uniqueDivisions = Array.from(
        new Set(divisionsRaw.map((row) => row.division)),
      );

      return { divisions: uniqueDivisions };
    }),

  getAllKegiatanDivision: protectedProcedure
    .input(GetAllKegiatanDivisionInputSchema)
    .output(GetAllDivisionOutputSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const orgId = await ctx.db.query.events.findFirst({
        where: eq(events.id, input.event_id),
        columns: { org_id: true },
      });

      if (!orgId) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
      }

      if (orgId.org_id !== ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const divisionsRaw = await ctx.db
        .select({ division: keanggotaan.division })
        .from(keanggotaan)
        .where(eq(keanggotaan.event_id, input.event_id));

      const uniqueDivisions = Array.from(
        new Set(divisionsRaw.map((row) => row.division)),
      );

      return { divisions: uniqueDivisions };
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

  getAllRequestAssociationLembaga: lembagaProcedure
    .output(GetAllRequestAssociationLembagaOutputSchema)
    .query(async ({ ctx }) => {
      const requests = await ctx.db
        .select({
          user_id: associationRequestsLembaga.user_id,
          mahasiswa_name: users.name,
          division: associationRequestsLembaga.division,
          position: associationRequestsLembaga.position,
        })
        .from(associationRequestsLembaga)
        .where(
          eq(
            associationRequestsLembaga.lembagaId,
            ctx.session?.user?.lembagaId ?? '',
          ),
        )
        .innerJoin(users, eq(associationRequestsLembaga.user_id, users.id));
      return {
        requests: requests.map((req) => ({
          user_id: req.user_id ?? '',
          mahasiswa_name: req.mahasiswa_name ?? '',
          division: req.division ?? '',
          position: req.position ?? '',
        })),
      };
    }),

  acceptRequestAssociationLembaga: lembagaProcedure
    .input(AcceptRequestAssociationLembagaInputSchema)
    .output(AcceptRequestAssociationLembagaOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        if (!ctx.session.user.lembagaId) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        // Check if the request exists and is pending
        console.log('Checking request for:', {
          lembagaId: ctx.session.user.lembagaId,
          user_id: input.user_id,
        });

        const isExistAndAuthorized = await ctx.db
          .select({ id: associationRequestsLembaga.id })
          .from(associationRequestsLembaga)
          .where(
            and(
              eq(
                associationRequestsLembaga.lembagaId,
                ctx.session.user.lembagaId,
              ),
              eq(associationRequestsLembaga.user_id, input.user_id),
              eq(associationRequestsLembaga.status, 'Pending'),
            ),
          )
          .limit(1);

        if (isExistAndAuthorized.length === 0) {
          return {
            success: false,
            message: 'Association request tidak ditemukan atau sudah diproses.',
          };
        }

        // Check if user is already a member of the lembaga
        const isUserAlreadyMember = await ctx.db
          .select({ id: kehimpunan.id })
          .from(kehimpunan)
          .where(
            and(
              eq(kehimpunan.lembagaId, ctx.session.user.lembagaId),
              eq(kehimpunan.userId, input.user_id),
            ),
          )
          .limit(1);

        if (isUserAlreadyMember.length > 0) {
          return {
            success: false,
            message:
              'User sudah terdaftar di dalam lembaga, silahkan edit posisi dan divisi di halaman anggota.',
          };
        }

        try {
          await ctx.db.transaction(async (tx) => {
            // Add user to kehimpunan
            await tx.insert(kehimpunan).values({
              lembagaId: ctx.session.user.lembagaId!,
              userId: input.user_id,
              position: input.position,
              division: input.division,
            });

            // Update the association request status to 'Accepted'
            await tx
              .update(associationRequestsLembaga)
              .set({
                status: 'Accepted',
              })
              .where(
                and(
                  eq(
                    associationRequestsLembaga.lembagaId,
                    ctx.session.user.lembagaId!,
                  ),
                  eq(associationRequestsLembaga.user_id, input.user_id),
                ),
              );

            // Increment lembaga member count
            const currentLembaga = await tx.query.lembaga.findFirst({
              where: eq(lembaga.id, ctx.session.user.lembagaId!),
              columns: { memberCount: true },
            });

            await tx
              .update(lembaga)
              .set({
                memberCount: (currentLembaga?.memberCount ?? 0) + 1,
              })
              .where(eq(lembaga.id, ctx.session.user.lembagaId!));
          });
        } catch (dbError) {
          console.error('Transaction Error:', dbError);
          return {
            success: false,
            message: 'Failed to process request. Please try again.',
          };
        }

        return {
          success: true,
          message: 'Request berhasil diterima.',
        };
      } catch (error) {
        console.error('Database Error:', error);
        return {
          success: false,
          message: 'Database Error',
        };
      }
    }),

  declineRequestAssociationLembaga: lembagaProcedure
    .input(DeclineRequestAssociationLembagaInputSchema)
    .output(DeclineRequestAssociationLembagaOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        if (!ctx.session.user.lembagaId) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        // Check if the request exists and is pending
        const isExistAndAuthorized = await ctx.db
          .select({ id: associationRequestsLembaga.id })
          .from(associationRequestsLembaga)
          .where(
            and(
              eq(
                associationRequestsLembaga.lembagaId,
                ctx.session.user.lembagaId,
              ),
              eq(associationRequestsLembaga.user_id, input.user_id),
              eq(associationRequestsLembaga.status, 'Pending'),
            ),
          )
          .limit(1);

        if (isExistAndAuthorized.length === 0) {
          return {
            success: false,
            message: 'Association request tidak ditemukan atau sudah diproses.',
          };
        }

        // Update the association request status to 'Declined'
        await ctx.db
          .update(associationRequestsLembaga)
          .set({
            status: 'Declined',
          })
          .where(
            and(
              eq(
                associationRequestsLembaga.lembagaId,
                ctx.session.user.lembagaId,
              ),
              eq(associationRequestsLembaga.user_id, input.user_id),
            ),
          );

        return {
          success: true,
          message: 'Request berhasil ditolak.',
        };
      } catch (error) {
        console.error('Database Error:', error);
        return {
          success: false,
          message: 'Database Error',
        };
      }
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

  getLatestBestStaffKegiatan: protectedProcedure
    .input(GetLatestBestStaffKegiatanInputSchema)
    .output(GetLatestBestStaffKegiatanOutputSchema)
    .query(async ({ ctx, input }) => {
      const latestRecord = await ctx.db.query.bestStaffKegiatan.findFirst({
        where: eq(bestStaffKegiatan.eventId, input.event_id),
        orderBy: (bs, { desc }) => [desc(bs.startDate)],
      });

      if (!latestRecord) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const staffList = await ctx.db
        .select({
          user_id: users.id,
          name: users.name,
          nim: mahasiswa.nim,
          jurusan: mahasiswa.jurusan,
          division: bestStaffKegiatan.division,
        })
        .from(bestStaffKegiatan)
        .innerJoin(
          mahasiswa,
          eq(bestStaffKegiatan.mahasiswaId, mahasiswa.userId),
        )
        .innerJoin(users, eq(mahasiswa.userId, users.id))
        .where(
          and(
            eq(bestStaffKegiatan.eventId, input.event_id),
            eq(bestStaffKegiatan.startDate, latestRecord.startDate),
            eq(bestStaffKegiatan.endDate, latestRecord.endDate),
          ),
        );

      return {
        start_date: latestRecord.startDate.toISOString(),
        end_date: latestRecord.endDate.toISOString(),
        best_staff_list: staffList.map((staff) => ({
          user_id: staff.user_id,
          name: staff.name ?? 'Tidak Diketahui',
          nim: staff.nim ? staff.nim.toString() : '-',
          jurusan: staff.jurusan ?? 'Tidak Diketahui',
          division: staff.division ?? '',
        })),
      };
    }),

  getLatestBestStaffLembaga: protectedProcedure
    .input(GetLatestBestStaffLembagaInputSchema)
    .output(GetLatestBestStaffLembagaOutputSchema)
    .query(async ({ ctx, input }) => {
      const latestRecord = await ctx.db.query.bestStaffLembaga.findFirst({
        where: eq(bestStaffLembaga.lembagaId, input.lembaga_id),
        orderBy: (bs, { desc }) => [desc(bs.startDate)],
      });

      if (!latestRecord) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const staffList = await ctx.db
        .select({
          user_id: users.id,
          name: users.name,
          nim: mahasiswa.nim,
          jurusan: mahasiswa.jurusan,
          division: bestStaffLembaga.division,
        })
        .from(bestStaffLembaga)
        .innerJoin(
          mahasiswa,
          eq(bestStaffLembaga.mahasiswaId, mahasiswa.userId),
        )
        .innerJoin(users, eq(mahasiswa.userId, users.id))
        .where(
          and(
            eq(bestStaffLembaga.lembagaId, input.lembaga_id),
            eq(bestStaffLembaga.startDate, latestRecord.startDate),
            eq(bestStaffLembaga.endDate, latestRecord.endDate),
          ),
        );

      return {
        start_date: latestRecord.startDate.toISOString(),
        end_date: latestRecord.endDate.toISOString(),
        best_staff_list: staffList.map((staff) => ({
          user_id: staff.user_id,
          name: staff.name ?? 'Tidak Diketahui',
          nim: staff.nim ? staff.nim.toString() : '-',
          jurusan: staff.jurusan ?? 'Tidak Diketahui',
          division: staff.division ?? '',
        })),
      };
    }),

  getAllHistoryBestStaffKegiatan: lembagaProcedure
    .input(GetAllHistoryBestStaffKegiatanInputSchema)
    .output(GetAllHistoryBestStaffKegiatanOutputSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const eventOrg = await ctx.db.query.events.findFirst({
        where: eq(events.id, input.event_id),
        columns: { org_id: true },
      });

      if (ctx.session.user.lembagaId !== eventOrg?.org_id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const records = await ctx.db
        .select({
          id: bestStaffKegiatan.id,
          startDate: bestStaffKegiatan.startDate,
          endDate: bestStaffKegiatan.endDate,
          user_id: users.id,
          name: users.name,
          nim: mahasiswa.nim,
          jurusan: mahasiswa.jurusan,
          division: bestStaffKegiatan.division,
        })
        .from(bestStaffKegiatan)
        .innerJoin(
          mahasiswa,
          eq(bestStaffKegiatan.mahasiswaId, mahasiswa.userId),
        )
        .innerJoin(users, eq(mahasiswa.userId, users.id))
        .where(eq(bestStaffKegiatan.eventId, input.event_id))
        .orderBy(desc(bestStaffKegiatan.startDate));

      const grouped = new Map<
        string,
        {
          startDate: Date;
          endDate: Date;
          staffList: {
            user_id: string;
            name: string;
            nim: string;
            jurusan: string;
            division: string;
          }[];
        }
      >();

      for (const record of records) {
        const key =
          record.startDate.toISOString() + '_' + record.endDate.toISOString();

        if (!grouped.has(key)) {
          grouped.set(key, {
            startDate: record.startDate,
            endDate: record.endDate,
            staffList: [],
          });
        }

        grouped.get(key)!.staffList.push({
          user_id: record.user_id,
          name: record.name ?? 'Tidak Diketahui',
          nim: record.nim ? record.nim.toString() : '-',
          jurusan: record.jurusan ?? 'Tidak Diketahui',
          division: record.division ?? '',
        });
      }

      return {
        periode: Array.from(grouped.values()).map((group) => ({
          start_date: group.startDate.toISOString(),
          end_date: group.endDate.toISOString(),
          best_staff_list: group.staffList,
        })),
      };
    }),

  getAllHistoryBestStaffLembaga: lembagaProcedure
    .input(GetAllHistoryBestStaffLembagaInputSchema)
    .output(GetAllHistoryBestStaffLembagaOutputSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      if (ctx.session.user.lembagaId !== input.lembaga_id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const records = await ctx.db
        .select({
          id: bestStaffLembaga.id,
          startDate: bestStaffLembaga.startDate,
          endDate: bestStaffLembaga.endDate,
          user_id: users.id,
          name: users.name,
          nim: mahasiswa.nim,
          jurusan: mahasiswa.jurusan,
          division: bestStaffLembaga.division,
        })
        .from(bestStaffLembaga)
        .innerJoin(
          mahasiswa,
          eq(bestStaffLembaga.mahasiswaId, mahasiswa.userId),
        )
        .innerJoin(users, eq(mahasiswa.userId, users.id))
        .where(eq(bestStaffLembaga.lembagaId, input.lembaga_id))
        .orderBy(desc(bestStaffKegiatan.startDate));

      const grouped = new Map<
        string,
        {
          startDate: Date;
          endDate: Date;
          staffList: {
            user_id: string;
            name: string;
            nim: string;
            jurusan: string;
            division: string;
          }[];
        }
      >();

      for (const record of records) {
        const key =
          record.startDate.toISOString() + '_' + record.endDate.toISOString();

        if (!grouped.has(key)) {
          grouped.set(key, {
            startDate: record.startDate,
            endDate: record.endDate,
            staffList: [],
          });
        }

        grouped.get(key)!.staffList.push({
          user_id: record.user_id,
          name: record.name ?? 'Tidak Diketahui',
          nim: record.nim ? record.nim.toString() : '-',
          jurusan: record.jurusan ?? 'Tidak Diketahui',
          division: record.division ?? '',
        });
      }

      return {
        periode: Array.from(grouped.values()).map((group) => ({
          start_date: group.startDate.toISOString(),
          end_date: group.endDate.toISOString(),
          best_staff_list: group.staffList,
        })),
      };
    }),

  getAllHistoryBestStaffMahasiswa: protectedProcedure
    .input(GetAllHistoryBestStaffMahasiswaInputSchema)
    .output(GetAllHistoryBestStaffMahasiswaOutputSchema)
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const kegiatanRecords = await ctx.db
        .select({
          event_id: events.id,
          name: events.name,
          start_date: bestStaffKegiatan.startDate,
          end_date: bestStaffKegiatan.endDate,
          division: bestStaffKegiatan.division,
        })
        .from(bestStaffKegiatan)
        .innerJoin(events, eq(bestStaffKegiatan.eventId, events.id))
        .where(eq(bestStaffKegiatan.mahasiswaId, input.mahasiswa_id))
        .orderBy(desc(bestStaffKegiatan.startDate));

      const lembagaRecords = await ctx.db
        .select({
          lembaga_id: lembaga.id,
          event_name: lembaga.name,
          start_date: bestStaffLembaga.startDate,
          end_date: bestStaffLembaga.endDate,
          division: bestStaffLembaga.division,
        })
        .from(bestStaffLembaga)
        .innerJoin(lembaga, eq(bestStaffLembaga.lembagaId, lembaga.id))
        .where(eq(bestStaffLembaga.mahasiswaId, ctx.session.user.id))
        .orderBy(desc(bestStaffKegiatan.startDate));

      return {
        best_staff_kegiatan: kegiatanRecords.map((record) => ({
          event_id: record.event_id ?? '',
          name: record.name ?? '',
          start_date: record.start_date.toISOString(),
          end_date: record.end_date.toISOString(),
          division: record.division ?? '',
        })),
        best_staff_lembaga: lembagaRecords.map((record) => ({
          lembaga_id: record.lembaga_id ?? '',
          event_name: record.event_name ?? '',
          start_date: record.start_date.toISOString(),
          end_date: record.end_date.toISOString(),
          division: record.division ?? '',
        })),
      };
    }),

  getMostViewedLembaga: lembagaProcedure
    .input(z.void())
    .output(GetMostViewedLembagaOutputSchema)
    .query(async ({ ctx }) => {
      const topLembagaData = await ctx.db
        .select({
          lembagaName: lembaga.name,
          profilePicture: users.image,
          id: lembaga.id,
          name: lembaga.name,
          description: lembaga.description,
          image: users.image,
          start_date: lembaga.foundingDate,
          end_date: lembaga.endingDate,
          quota: lembaga.memberCount,
          type: lembaga.type,
        })
        .from(lembaga)
        .leftJoin(users, eq(lembaga.userId, users.id))
        .orderBy(desc(lembaga.viewCount))
        .limit(3);

      return {
        lembaga: topLembagaData.map((item) => ({
          lembaga: {
            id: item.id ?? '',
            name: item.lembagaName ?? '',
            profilePicture: item.profilePicture ?? '',
            type: item.type ?? '',
          },
          id: item.id,
          name: item.name ?? '',
          description: item.description ?? '',
          image: item.image ?? '',
          start_date: item.start_date ?? new Date(),
          end_date: item.end_date ?? new Date(),
          quota: item.quota ?? 0,
        })),
      };
    }),

  incrementLembagaView: protectedProcedure
    .input(IncrementLembagaViewInputSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const updatedLembaga = await ctx.db
        .update(lembaga)
        .set({ viewCount: sql`${lembaga.viewCount} + 1` })
        .where(eq(lembaga.id, input.lembaga_id))
        .returning();
      if (updatedLembaga.length !== 0) {
        return { success: true };
      } else {
        return { success: false };
      }
    }),
});
