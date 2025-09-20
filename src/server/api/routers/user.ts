import { and, eq } from 'drizzle-orm';
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
  lembaga,
  mahasiswa,
  users,
} from '~/server/db/schema';

import {
  DeleteRequestAssociationInputSchema,
  DeleteRequestAssociationLembagaInputSchema,
  EditProfilMahasiswaInputSchema,
  GetMyRequestAssociationLembagaOutputSchema,
  GetMyRequestAssociationOutputSchema,
  GetTambahAnggotaKegiatanOptionsInputSchema,
  GetTambahAnggotaKegiatanOptionsOutputSchema,
  GetTambahAnggotaLembagaOptionsInputSchema,
  GetTambahAnggotaLembagaOptionsOutputSchema,
  RequestAssociationInputSchema,
  RequestAssociationLembagaInputSchema,
  RequestAssociationOutputSchema,
  editRequestAssociationOutputSchema,
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

      const [mahasiswa_list, list_posisi_bidang] = await Promise.all([
        ctx.db.query.users.findMany({
          where: (users, { notInArray }) => notInArray(users.id, hide_list_id),
          columns: {
            id: true,
            name: true,
          },
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

      const [mahasiswa_list, list_posisi_bidang] = await Promise.all([
        ctx.db.query.users.findMany({
          where: (users, { notInArray }) => notInArray(users.id, hide_list_id),
          columns: {
            id: true,
            name: true,
          },
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
    .output(editRequestAssociationOutputSchema)
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
    .output(editRequestAssociationOutputSchema)
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
    .output(editRequestAssociationOutputSchema) // Karena edit outputnya sama seperti delete
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
    .output(editRequestAssociationOutputSchema) //Karena edit outputnya sama seperti delete
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
});
