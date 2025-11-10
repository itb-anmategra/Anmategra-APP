import { TRPCError } from '@trpc/server';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { type comboboxDataType } from '~/app/_components/form/tambah-anggota-form';
import {
  createTRPCRouter,
  lembagaProcedure,
  protectedProcedure,
} from '~/server/api/trpc';
import {
  associationRequests,
  associationRequestsLembaga,
  events,
  keanggotaan,
  kehimpunan,
  lembaga,
  mahasiswa,
  support,
  users,
} from '~/server/db/schema';

import { CreateEventOutputSchema } from '../types/event.type';
import {
  CreateDraftInputSchema,
  DeleteRequestAssociationInputSchema,
  DeleteRequestAssociationLembagaInputSchema,
  EditDraftInputSchema,
  EditProfilMahasiswaInputSchema,
  EditRequestAssociationOutputSchema,
  GetAllReportsUserInputSchema,
  GetAllReportsUserOutputSchema,
  GetAnggotaByIdInputSchema,
  GetAnggotaByNameInputSchema,
  GetAnggotaOutputSchema,
  GetMahasiswaByIdInputSchema,
  GetMahasiswaByNameInputSchema,
  GetMahasiswaByNimInputSchema,
  GetMahasiswaOutputSchema,
  GetMyRequestAssociationLembagaOutputSchema,
  GetMyRequestAssociationOutputSchema,
  GetPanitiaByIdInputSchema,
  GetPanitiaByNameInputSchema,
  GetPanitiaOutputSchema,
  GetTambahAnggotaKegiatanOptionsInputSchema,
  GetTambahAnggotaKegiatanOptionsOutputSchema,
  GetTambahAnggotaLembagaOptionsInputSchema,
  GetTambahAnggotaLembagaOptionsOutputSchema,
  ReportOutputSchema,
  RequestAssociationInputSchema,
  RequestAssociationLembagaInputSchema,
  RequestAssociationLembagaOutputSchema,
  RequestAssociationOutputSchema,
  SubmitReportInputSchema,
  SubmitReportOutputSchema,
} from '../types/user.type';

export const userRouter = createTRPCRouter({
  /*
   * Endpoint untuk mengambil data pilihan untuk tambah anggota pada suatu lembaga
   */
  getTambahAnggotaLembagaOptions: lembagaProcedure
    .input(GetTambahAnggotaLembagaOptionsInputSchema)
    .output(GetTambahAnggotaLembagaOptionsOutputSchema)
    .query(async ({ ctx, input }) => {
      const [mahasiswa_hide_list, lembaga_list] = await Promise.all([
        ctx.db.query.kehimpunan.findMany({
          where: (kehimpunan, { eq }) =>
            eq(kehimpunan.lembagaId, input.lembagaId),
          columns: {
            userId: true,
          },
        }),
        ctx.db.query.lembaga.findMany({
          columns: {
            userId: true,
          },
        }),
      ]);
      const mahasiswa_hide_list_id = mahasiswa_hide_list.map(
        (item) => item.userId,
      );
      const lembaga_list_id = lembaga_list.map((item) => item.userId);
      const hide_list_id = mahasiswa_hide_list_id.concat(lembaga_list_id);

      const [mahasiswa_list, nim_list, list_posisi_bidang] = await Promise.all([
        ctx.db.query.users.findMany({
          where: (users, { notInArray }) => notInArray(users.id, hide_list_id),
          columns: {
            id: true,
            name: true,
          },
          orderBy: (users, { asc }) => asc(users.id),
        }),
        ctx.db.query.mahasiswa.findMany({
          where: (mahasiswa, { notInArray }) =>
            notInArray(mahasiswa.userId, hide_list_id),
          columns: {
            userId: true,
            nim: true,
          },
          orderBy: (mahasiswa, { asc }) => asc(mahasiswa.userId),
        }),
        ctx.db.query.kehimpunan.findMany({
          where: (kehimpunan, { eq }) =>
            eq(kehimpunan.lembagaId, input.lembagaId),
          columns: {
            position: true,
            division: true,
          },
        }),
      ]);

      const formattedMahasiswaList = mahasiswa_list.map((item) => ({
        value: item.id,
        label: item.name ?? '',
      }));

      const formattedNimList = nim_list.map((item) => ({
        value: item.userId,
        label:
          item.nim !== undefined && item.nim !== null
            ? item.nim.toString()
            : '',
      }));

      const uniquePosisi = Array.from(
        new Set(list_posisi_bidang.map((item) => item.position)),
      );
      const posisi_list = uniquePosisi.map((position) => ({
        value: position,
        label: position ?? '',
      }));

      const uniqueBidang = Array.from(
        new Set(list_posisi_bidang.map((item) => item.division)),
      );
      const bidang_list = uniqueBidang.map((division) => ({
        value: division,
        label: division ?? '',
      }));

      return {
        mahasiswa: formattedMahasiswaList ?? ([] as comboboxDataType[]),
        nim: formattedNimList ?? ([] as comboboxDataType[]),
        posisi: posisi_list ?? ([] as comboboxDataType[]),
        bidang: bidang_list ?? ([] as comboboxDataType[]),
      };
    }),
  /*
   * Endpoint untuk mengambil data pilihan untuk tambah anggota pada suatu kegiatan
   */
  getTambahAnggotaKegiatanOptions: protectedProcedure
    .input(GetTambahAnggotaKegiatanOptionsInputSchema)
    .output(GetTambahAnggotaKegiatanOptionsOutputSchema)
    .query(async ({ ctx, input }) => {
      const [mahasiswa_hide_list, lembaga_list] = await Promise.all([
        ctx.db.query.keanggotaan.findMany({
          where: (keanggotaan, { eq }) =>
            eq(keanggotaan.event_id, input.kegiatanId),
          columns: {
            user_id: true,
          },
        }),
        ctx.db.query.lembaga.findMany({
          columns: {
            userId: true,
          },
        }),
      ]);
      const mahasiswa_hide_list_id = mahasiswa_hide_list.map(
        (item) => item.user_id,
      );
      const lembaga_list_id = lembaga_list.map((item) => item.userId);
      const hide_list_id = mahasiswa_hide_list_id.concat(lembaga_list_id);

      const [mahasiswa_list, nim_list, list_posisi_bidang] = await Promise.all([
        ctx.db.query.users.findMany({
          where: (users, { notInArray }) => notInArray(users.id, hide_list_id),
          columns: {
            id: true,
            name: true,
          },
          orderBy: (users, { asc }) => asc(users.id),
        }),
        ctx.db.query.mahasiswa.findMany({
          where: (mahasiswa, { notInArray }) =>
            notInArray(mahasiswa.userId, hide_list_id),
          columns: {
            userId: true,
            nim: true,
          },
          orderBy: (mahasiswa, { asc }) => asc(mahasiswa.userId),
        }),
        ctx.db.query.keanggotaan.findMany({
          where: (keanggotaan, { eq }) =>
            eq(keanggotaan.event_id, input.kegiatanId),
          columns: {
            position: true,
            division: true,
          },
        }),
      ]);

      const formattedMahasiswaList = mahasiswa_list.map((item) => ({
        value: item.id,
        label: item.name ?? '',
      }));

      const formattedNimList = nim_list.map((item) => ({
        value: item.userId,
        label:
          item.nim !== undefined && item.nim !== null
            ? item.nim.toString()
            : '',
      }));

      const uniquePosisi = Array.from(
        new Set(list_posisi_bidang.map((item) => item.position)),
      );
      const posisi_list = uniquePosisi.map((position) => ({
        value: position,
        label: position ?? '',
      }));

      const uniqueBidang = Array.from(
        new Set(list_posisi_bidang.map((item) => item.division)),
      );
      const bidang_list = uniqueBidang.map((division) => ({
        value: division,
        label: division ?? '',
      }));

      return {
        mahasiswa: formattedMahasiswaList ?? ([] as comboboxDataType[]),
        nim: formattedNimList ?? ([] as comboboxDataType[]),
        posisi: posisi_list ?? ([] as comboboxDataType[]),
        bidang: bidang_list ?? ([] as comboboxDataType[]),
      };
    }),

  /*
   * Endpoint untuk edit profil mahasiswa
   */
  editProfilMahasiswa: protectedProcedure
    .input(EditProfilMahasiswaInputSchema)
    .output(z.void())
    .mutation(async ({ ctx, input }) => {
      if (input.image) {
        await ctx.db
          .update(users)
          .set({
            image: input.image,
          })
          .where(eq(users.id, ctx.session.user.id));
      }
      await ctx.db
        .update(mahasiswa)
        .set({
          lineId: input.idLine,
          whatsapp: input.noWhatsapp,
        })
        .where(eq(mahasiswa.userId, ctx.session.user.id));
    }),

  /*
   * Endpoint untuk request association ke suatu lembaga
   */

  requestAssociation: protectedProcedure
    .input(RequestAssociationInputSchema)
    .output(RequestAssociationOutputSchema)
    .mutation(async ({ ctx, input }) => {
      // Input Sukses
      try {
        const existingRequest =
          await ctx.db.query.associationRequests.findFirst({
            where: (associationRequests, { eq, and }) =>
              and(
                eq(associationRequests.event_id, input.event_id),
                eq(associationRequests.user_id, ctx.session.user.id),
              ),
          });
        if (existingRequest) {
          return {
            success: false,
            message: 'Anda sudah pernah membuat permintaan untuk event ini',
          };
        }
        await ctx.db.insert(associationRequests).values({
          id: crypto.randomUUID(),
          event_id: input.event_id,
          user_id: ctx.session.user.id,
          division: input.division,
          position: input.position,
          status: 'Pending', // Pending Status
        });

        return { success: true };
      } catch (error) {
        console.error('Error creating association request:', error);
        return { success: false };
      }
    }),

  /*
   * Endpoint untuk melihat request association
   */

  getMyRequestAssociation: protectedProcedure
    .output(z.array(GetMyRequestAssociationOutputSchema))
    .query(async ({ ctx }) => {
      const result = await ctx.db
        .select({
          id: associationRequests.id,
          event_id: associationRequests.event_id,
          status: associationRequests.status,
          position: associationRequests.position,
          division: associationRequests.division,
          event_name: events.name,
        })
        .from(associationRequests)
        .leftJoin(events, eq(associationRequests.event_id, events.id))
        .where(eq(associationRequests.user_id, ctx.session.user.id));

      return result;
    }),

  /*
   * Endpoint untuk melihat request association lembaga
   */

  getMyRequestAssociationLembaga: protectedProcedure
    .output(z.array(GetMyRequestAssociationLembagaOutputSchema))
    .query(async ({ ctx }) => {
      const result = await ctx.db
        .select({
          id: associationRequestsLembaga.id,
          lembaga_id: associationRequestsLembaga.lembagaId,
          lembaga_name: lembaga.name,
          position: associationRequestsLembaga.position,
          division: associationRequestsLembaga.division,
          status: associationRequestsLembaga.status,
        })
        .from(associationRequestsLembaga)
        .leftJoin(lembaga, eq(associationRequestsLembaga.lembagaId, lembaga.id))
        .where(eq(associationRequestsLembaga.user_id, ctx.session.user.id));

      return result;
    }),

  /*
   * Endpoint untuk edit request association
   */

  editRequestAssociation: protectedProcedure
    .input(RequestAssociationInputSchema) // Input skema sama seperti RequestAssociationInputSchema (requestAssociation))
    .output(EditRequestAssociationOutputSchema)
    .mutation(async ({ ctx, input }) => {
      // Input Sukses
      try {
        const existingRequest =
          await ctx.db.query.associationRequests.findFirst({
            where: (associationRequests, { eq, and }) =>
              and(
                eq(associationRequests.event_id, input.event_id),
                eq(associationRequests.user_id, ctx.session.user.id),
              ),
          });
        if (!existingRequest) {
          return { success: false, message: 'Request not found' };
        }
        await ctx.db
          .update(associationRequests)
          .set({
            division: input.division,
            position: input.position,
            status: 'Pending', // Reset status to Pending
          })
          .where(
            and(
              eq(associationRequests.event_id, input.event_id),
              eq(associationRequests.user_id, ctx.session.user.id),
            ),
          );
        return { success: true, message: 'Request berhasil diubah' };
      } catch (error) {
        console.error('Error updating association request:', error);
        return { success: false, message: 'Failed to update request' };
      }
    }),

  /*
   * Endpoint untuk edit request association lembaga
   */

  editRequestAssociationLembaga: protectedProcedure
    .input(RequestAssociationLembagaInputSchema) // Input skema sama seperti RequestAssociationLembagaInputSchema (requestAssociationLembaga ada di issue sebelah)
    .output(EditRequestAssociationOutputSchema)
    .mutation(async ({ ctx, input }) => {
      // Input Sukses
      try {
        const existingRequest =
          await ctx.db.query.associationRequestsLembaga.findFirst({
            where: (associationRequestsLembaga, { eq, and }) =>
              and(
                eq(associationRequestsLembaga.lembagaId, input.lembaga_id),
                eq(associationRequestsLembaga.user_id, ctx.session.user.id),
              ),
          });
        if (!existingRequest) {
          return { success: false, message: 'Request not found' };
        }
        await ctx.db
          .update(associationRequestsLembaga)
          .set({
            division: input.division,
            position: input.position,
            status: 'Pending', // Reset status to Pending
          })
          .where(
            and(
              eq(associationRequestsLembaga.lembagaId, input.lembaga_id),
              eq(associationRequestsLembaga.user_id, ctx.session.user.id),
            ),
          );
        return { success: true, message: 'Request berhasil diubah' };
      } catch (error) {
        console.error('Error updating association request:', error);
        return { success: false, message: 'Failed to update request' };
      }
    }),

  /*
   * Endpoint untuk delete request association
   */

  deleteRequestAssociation: protectedProcedure
    .input(DeleteRequestAssociationInputSchema)
    .output(EditRequestAssociationOutputSchema) // Karena edit outputnya sama seperti delete
    .mutation(async ({ ctx, input }) => {
      try {
        const existingRequest =
          await ctx.db.query.associationRequests.findFirst({
            where: (associationRequests, { eq, and }) =>
              and(
                eq(associationRequests.event_id, input.event_id),
                eq(associationRequests.user_id, ctx.session.user.id),
              ),
          });
        if (!existingRequest) {
          return { success: false, message: 'Request not found' };
        }
        await ctx.db
          .delete(associationRequests)
          .where(
            and(
              eq(associationRequests.event_id, input.event_id),
              eq(associationRequests.user_id, ctx.session.user.id),
            ),
          );
        return { success: true, message: 'Request berhasil dihapus' };
      } catch (error) {
        console.error('Error deleting association request:', error);
        return { success: false, message: 'Failed to delete request' };
      }
    }),

  /*
   * Endpoint untuk delete request association lembaga
   */

  deleteRequestAssociationLembaga: protectedProcedure
    .input(DeleteRequestAssociationLembagaInputSchema)
    .output(EditRequestAssociationOutputSchema) //Karena edit outputnya sama seperti delete
    .mutation(async ({ ctx, input }) => {
      try {
        const existingRequest =
          await ctx.db.query.associationRequestsLembaga.findFirst({
            where: (associationRequestsLembaga, { eq, and }) =>
              and(
                eq(associationRequestsLembaga.lembagaId, input.lembaga_id),
                eq(associationRequestsLembaga.user_id, ctx.session.user.id),
              ),
          });
        if (!existingRequest) {
          return { success: false, message: 'Request not found' };
        }
        await ctx.db
          .delete(associationRequestsLembaga)
          .where(
            and(
              eq(associationRequestsLembaga.lembagaId, input.lembaga_id),
              eq(associationRequestsLembaga.user_id, ctx.session.user.id),
            ),
          );
        return { success: true, message: 'Request lembaga berhasil dihapus' };
      } catch (error) {
        console.error('Error deleting association request:', error);
        return { success: false, message: 'Failed to delete request' };
      }
    }),

  requestAssociationLembaga: protectedProcedure
    .input(RequestAssociationLembagaInputSchema)
    .output(RequestAssociationLembagaOutputSchema)
    .mutation(async ({ ctx, input }) => {
      // Input Sukses
      try {
        const existingRequest =
          await ctx.db.query.associationRequestsLembaga.findFirst({
            where: (associationRequestsLembaga, { eq, and }) =>
              and(
                eq(associationRequestsLembaga.lembagaId, input.lembaga_id),
                eq(associationRequestsLembaga.user_id, ctx.session.user.id),
              ),
          });
        if (existingRequest) {
          return {
            success: false,
            message: 'Anda sudah pernah membuat permintaan untuk lembaga ini',
          };
        }
        await ctx.db.insert(associationRequestsLembaga).values({
          id: crypto.randomUUID(),
          lembagaId: input.lembaga_id,
          user_id: ctx.session.user.id,
          division: input.division,
          position: input.position,
          status: 'Pending', // Pending Status
        });

        return { success: true };
      } catch (error) {
        console.error('Error creating association request:', error);
        return { success: false };
      }
    }),

  getMahasiswaById: protectedProcedure
    .input(GetMahasiswaByIdInputSchema)
    .output(GetMahasiswaOutputSchema)
    .query(async ({ ctx, input }) => {
      const mahasiswaResult = await ctx.db
        .select()
        .from(mahasiswa)
        .innerJoin(users, eq(mahasiswa.userId, users.id))
        .where(eq(users.id, input.userId))
        .limit(1);

      if (mahasiswaResult.length === 0 || !mahasiswaResult[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Mahasiswa not found',
        });
      }

      return {
        mahasiswaData: mahasiswaResult[0],
      };
    }),

  getMahasiswaByName: protectedProcedure
    .input(GetMahasiswaByNameInputSchema)
    .output(GetMahasiswaOutputSchema)
    .query(async ({ ctx, input }) => {
      const mahasiswaResult = await ctx.db
        .select()
        .from(mahasiswa)
        .innerJoin(users, eq(mahasiswa.userId, users.id))
        .where(eq(users.name, input.name))
        .limit(1);

      if (mahasiswaResult.length === 0 || !mahasiswaResult[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Mahasiswa not found',
        });
      }

      return {
        mahasiswaData: mahasiswaResult[0],
      };
    }),

  getMahasiswaByNim: protectedProcedure
    .input(GetMahasiswaByNimInputSchema)
    .output(GetMahasiswaOutputSchema)
    .query(async ({ ctx, input }) => {
      const mahasiswaResult = await ctx.db
        .select()
        .from(mahasiswa)
        .innerJoin(users, eq(mahasiswa.userId, users.id))
        .where(eq(mahasiswa.nim, Number(input.nim)))
        .limit(1);

      if (mahasiswaResult.length === 0 || !mahasiswaResult[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Mahasiswa not found',
        });
      }

      return {
        mahasiswaData: mahasiswaResult[0],
      };
    }),

  getAnggotaById: protectedProcedure
    .input(GetAnggotaByIdInputSchema)
    .output(GetAnggotaOutputSchema)
    .query(async ({ ctx, input }) => {
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
        .where(
          and(
            eq(kehimpunan.lembagaId, input.lembagaId),
            eq(users.id, input.userId),
          ),
        )
        .limit(1);

      if (anggota.length === 0 || !anggota[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Anggota not found',
        });
      }

      const result = anggota[0];

      return {
        id: result.id,
        nama: result.nama ?? 'Tidak Diketahui',
        nim: result.nim.toString(),
        divisi: result.divisi,
        posisi: result.posisi,
      };
    }),

  getAnggotaByName: protectedProcedure
    .input(GetAnggotaByNameInputSchema)
    .output(GetAnggotaOutputSchema)
    .query(async ({ ctx, input }) => {
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
        .where(
          and(
            eq(kehimpunan.lembagaId, input.lembagaId),
            eq(users.name, input.name),
          ),
        )
        .limit(1);

      if (anggota.length === 0 || !anggota[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Anggota not found',
        });
      }

      const result = anggota[0];

      return {
        id: result.id,
        nama: result.nama ?? 'Tidak Diketahui',
        nim: result.nim.toString(),
        divisi: result.divisi,
        posisi: result.posisi,
      };
    }),

  getPanitiaById: protectedProcedure
    .input(GetPanitiaByIdInputSchema)
    .output(GetPanitiaOutputSchema)
    .query(async ({ ctx, input }) => {
      const panitia = await ctx.db
        .select({
          id: users.id,
          nama: users.name,
          nim: mahasiswa.nim,
          divisi: keanggotaan.division,
          posisi: keanggotaan.position,
        })
        .from(keanggotaan)
        .innerJoin(users, eq(keanggotaan.user_id, users.id))
        .innerJoin(mahasiswa, eq(users.id, mahasiswa.userId))
        .where(
          and(
            eq(keanggotaan.event_id, input.kegiatanId),
            eq(users.id, input.userId),
          ),
        )
        .limit(1);

      if (panitia.length === 0 || !panitia[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Panitia not found',
        });
      }

      const result = panitia[0];

      return {
        id: result.id,
        nama: result.nama ?? 'Tidak Diketahui',
        nim: result.nim.toString(),
        divisi: result.divisi,
        posisi: result.posisi,
      };
    }),

  getPanitiaByName: protectedProcedure
    .input(GetPanitiaByNameInputSchema)
    .output(GetPanitiaOutputSchema)
    .query(async ({ ctx, input }) => {
      const panitia = await ctx.db
        .select({
          id: users.id,
          nama: users.name,
          nim: mahasiswa.nim,
          divisi: keanggotaan.division,
          posisi: keanggotaan.position,
        })
        .from(keanggotaan)
        .innerJoin(users, eq(keanggotaan.user_id, users.id))
        .innerJoin(mahasiswa, eq(users.id, mahasiswa.userId))
        .where(
          and(
            eq(keanggotaan.event_id, input.kegiatanId),
            eq(users.name, input.name),
          ),
        )
        .limit(1);

      if (panitia.length === 0 || !panitia[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Panitia not found',
        });
      }

      const result = panitia[0];

      return {
        id: result.id,
        nama: result.nama ?? 'Tidak Diketahui',
        nim: result.nim.toString(),
        divisi: result.divisi,
        posisi: result.posisi,
      };
    }),

  createDraft: protectedProcedure
    .input(CreateDraftInputSchema)
    .output(ReportOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const [createdDraft] = await ctx.db
          .insert(support)
          .values({
            id: crypto.randomUUID(),
            user_id: ctx.session.user.id,
            subject: input.subject,
            topic: input.topic,
            description: input.description,
            status: 'Draft',
            attachment: input.attachment,
          })
          .returning();

        if (!createdDraft) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create draft',
          });
        }

        return {
          id: createdDraft.id,
          subject: createdDraft.subject,
          topic: createdDraft.topic,
          description: createdDraft.description,
          status: createdDraft.status,
          attachment: createdDraft.attachment,
          created_at: createdDraft.created_at.toISOString(),
          updated_at: createdDraft.updated_at.toISOString(),
        };
      } catch (error) {
        console.error('Error creating draft:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create draft',
        });
      }
    }),

  editDraft: protectedProcedure
    .input(EditDraftInputSchema)
    .output(ReportOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const [updatedDraft] = await ctx.db
          .update(support)
          .set({
            subject: input.subject,
            topic: input.topic,
            description: input.description,
            attachment: input.attachment,
          })
          .where(
            and(
              eq(support.id, input.id),
              eq(support.user_id, ctx.session.user.id),
              eq(support.status, 'Draft'), // Only allow editing drafts
            ),
          )
          .returning();

        if (!updatedDraft) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Draft not found or not editable',
          });
        }

        return {
          id: updatedDraft.id,
          subject: updatedDraft.subject,
          topic: updatedDraft.topic,
          description: updatedDraft.description,
          status: updatedDraft.status,
          attachment: updatedDraft.attachment,
          created_at: updatedDraft.created_at.toISOString(),
          updated_at: updatedDraft.updated_at.toISOString(),
        };
      } catch (error) {
        console.error('Error updating draft:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update draft',
        });
      }
    }),

  submitReport: protectedProcedure
    .input(SubmitReportInputSchema)
    .output(SubmitReportOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const [submittedReport] = await ctx.db
          .update(support)
          .set({
            status: 'Backlog',
          })
          .where(
            and(
              eq(support.id, input.id),
              eq(support.user_id, ctx.session.user.id),
              eq(support.status, 'Draft'), // Only allow submitting drafts
            ),
          )
          .returning();

        if (!submittedReport) {
          return {
            success: false,
            message: 'Draft not found or already submitted',
          };
        }

        return {
          success: true,
          message: 'Report submitted successfully',
        };
      } catch (error) {
        console.error('Error submitting report:', error);
        return {
          success: false,
          message: 'Failed to submit report',
        };
      }
    }),

  deleteReport: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const [deletedReport] = await ctx.db
          .delete(support)
          .where(
            and(
              eq(support.id, input.id),
              eq(support.user_id, ctx.session.user.id),
              eq(support.status, 'Draft'), // Only allow deleting drafts
            ),
          )
          .returning({ id: support.id });

        return { success: !!deletedReport };
      } catch {
        return { success: false };
      }
    }),

  getAllReportsUser: protectedProcedure
    .input(GetAllReportsUserInputSchema)
    .output(GetAllReportsUserOutputSchema)
    .query(async ({ ctx, input }) => {
      try {
        const reports = await ctx.db
          .select()
          .from(support)
          .where(
            and(
              eq(support.user_id, ctx.session.user.id),
              input.search
                ? or(
                    ilike(support.topic, `%${input.search}%`),
                    ilike(support.subject, `%${input.search}%`),
                  )
                : undefined,
              input.status ? eq(support.status, input.status) : undefined,
            ),
          )
          .orderBy(desc(support.created_at));
        return {
          reports: reports.map((report) => ({
            id: report.id,
            subject: report.subject,
            topic: report.topic,
            description: report.description,
            status: report.status,
            attachment: report.attachment,
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
});
