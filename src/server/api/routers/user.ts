import { TRPCError } from '@trpc/server';
import { and, desc, eq, like } from 'drizzle-orm';
import { z } from 'zod';
import { type comboboxDataType } from '~/app/_components/form/tambah-anggota-form';
import {
  createTRPCRouter,
  lembagaProcedure,
  protectedProcedure,
} from '~/server/api/trpc';
import {
  associationRequests,
  keanggotaan,
  kehimpunan,
  mahasiswa,
  support,
  users,
} from '~/server/db/schema';

import { CreateEventOutputSchema } from '../types/event.type';
import {
  CreateReportInputSchema,
  CreateReportOutputSchema,
  EditProfilMahasiswaInputSchema,
  EditReportInputSchema,
  GetAllReportsUserInputSchema,
  GetAnggotaByIdInputSchema,
  GetAnggotaByNameInputSchema,
  GetAnggotaOutputSchema,
  GetMahasiswaByIdInputSchema,
  GetMahasiswaByNameInputSchema,
  GetMahasiswaByNimInputSchema,
  GetMahasiswaOutputSchema,
  GetPanitiaByIdInputSchema,
  GetPanitiaByNameInputSchema,
  GetPanitiaOutputSchema,
  GetTambahAnggotaKegiatanOptionsInputSchema,
  GetTambahAnggotaKegiatanOptionsOutputSchema,
  GetTambahAnggotaLembagaOptionsInputSchema,
  GetTambahAnggotaLembagaOptionsOutputSchema,
  RequestAssociationInputSchema,
  RequestAssociationOutputSchema,
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

  createReport: protectedProcedure
    .input(CreateReportInputSchema)
    .output(CreateReportOutputSchema)
    .mutation(async ({ ctx, input }) => {
      // Input Sukses
      try {
        await ctx.db.insert(support).values({
          id: crypto.randomUUID(),
          user_id: ctx.session.user.id,
          subject: input.subject,
          topic: input.topic,
          description: input.description,
          status: input.status,
          attachment: input.attachment,
          created_at: new Date(),
          updated_at: new Date(),
        });
        const createdReport = await ctx.db
          .select()
          .from(support)
          .where(eq(support.user_id, ctx.session.user.id))
          .orderBy(desc(support.created_at))
          .limit(1);
        if (createdReport.length === 0 || !createdReport[0]) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Report not found after creation',
          });
        }
        const result = createdReport[0];
        return {
          id: result.id,
          subject: result.subject,
          topic: result.topic,
          description: result.description,
          status: result.status,
          attachment: result.attachment,
          created_at: result.created_at.toISOString(),
          updated_at: result.updated_at.toISOString(),
        };
      } catch (error) {
        console.error('Error creating report:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create report',
        });
      }
    }),

  editReport: protectedProcedure
    .input(EditReportInputSchema)
    .output(CreateReportOutputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db
          .update(support)
          .set({
            id: input.id,
            subject: input.subject,
            topic: input.topic,
            description: input.description,
            status: input.status,
            attachment: input.attachment,
            updated_at: new Date(),
          })
          .where(
            and(
              eq(support.id, input.id),
              eq(support.user_id, ctx.session.user.id),
            ),
          );

        const updatedReport = await ctx.db
          .select()
          .from(support)
          .where(
            and(
              eq(support.id, input.id),
              eq(support.user_id, ctx.session.user.id),
            ),
          )
          .limit(1);
        if (updatedReport.length === 0 || !updatedReport[0]) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Report not found after update',
          });
        }

        const result = updatedReport[0];
        return {
          id: result.id,
          subject: result.subject,
          topic: result.topic,
          description: result.description,
          status: result.status,
          attachment: result.attachment,
          created_at: result.created_at.toISOString(),
          updated_at: result.updated_at.toISOString(),
        };
      } catch (error) {
        console.error('Error updating report:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update report',
        });
      }
    }),

  deleteReport: protectedProcedure
    .input(z.object({ id: z.string() })) //Ngga bikin type soalnya cuma butuh id doang
    .output(z.object({ success: z.boolean() })) // sama kaya input, cuma butuh message doang
    .mutation(async ({ ctx, input }) => {
      try {
        const reportToDelete = await ctx.db
          .select()
          .from(support)
          .where(
            and(
              eq(support.id, input.id),
              eq(support.user_id, ctx.session.user.id),
            ),
          )
          .limit(1);
        if (reportToDelete.length === 0 || !reportToDelete[0]) {
          return { success: false };
        }
        await ctx.db
          .delete(support)
          .where(
            and(
              eq(support.id, input.id),
              eq(support.user_id, ctx.session.user.id),
            ),
          );
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    }),

  getAllReportsUser: protectedProcedure
    .input(GetAllReportsUserInputSchema)
    .output(z.array(CreateReportOutputSchema))
    .query(async ({ ctx, input }) => {
      try {
        const queryConditions = [eq(support.user_id, ctx.session.user.id)];
        if (input.search) {
          queryConditions.push(like(support.topic, `%${input.search}%`)); // Ini maksudnya apa? (by subject, topic)
        }
        if (input.status) {
          queryConditions.push(eq(support.status, input.status));
        }
        const reports = await ctx.db
          .select()
          .from(support)
          .where(and(...queryConditions))
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
});
