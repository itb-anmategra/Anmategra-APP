import { TRPCError } from '@trpc/server';
import { and, eq, inArray } from 'drizzle-orm';
import { createTRPCRouter, lembagaProcedure } from '~/server/api/trpc';
import {
  keanggotaan,
  kehimpunan,
  mahasiswa,
  nilaiProfilKegiatan,
  nilaiProfilLembaga,
  profilKegiatan,
  profilLembaga,
  users,
} from '~/server/db/schema';

import {
  GetAllNilaiProfilKegiatanInputSchema,
  GetAllNilaiProfilKegiatanOutputSchema,
  GetAllNilaiProfilLembagaInputSchema,
  GetAllNilaiProfilLembagaOutputSchema,
  GetNilaiKegiatanIndividuInputSchema,
  GetNilaiKegiatanIndividuOutputSchema,
  GetNilaiLembagaIndividuInputSchema,
  GetNilaiLembagaIndividuOutputSchema,
} from '../types/rapor.type';

export const raporRouter = createTRPCRouter({
  getAllNilaiProfilKegiatan: lembagaProcedure
    .input(GetAllNilaiProfilKegiatanInputSchema)
    .output(GetAllNilaiProfilKegiatanOutputSchema)
    .query(async ({ ctx, input }) => {
      try {
        const event = await ctx.db.query.events.findFirst({
          where: (event, { eq }) => eq(event.id, input.event_id),
          columns: { org_id: true },
        });

        if (!event || event.org_id !== ctx.session.user.lembagaId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied to this event.',
          });
        }

        const mahasiswaList = await ctx.db
          .select({
            user_id: keanggotaan.user_id,
            name: users.name,
            nim: mahasiswa.nim,
          })
          .from(keanggotaan)
          .innerJoin(mahasiswa, eq(mahasiswa.userId, keanggotaan.user_id))
          .innerJoin(users, eq(users.id, keanggotaan.user_id))
          .where(eq(keanggotaan.event_id, input.event_id));

        const mahasiswaIds = mahasiswaList.map((m) => m.user_id);

        const nilaiList = await ctx.db
          .select({
            user_id: nilaiProfilKegiatan.mahasiswaId,
            profil_id: nilaiProfilKegiatan.profilId,
            nilai: nilaiProfilKegiatan.nilai,
          })
          .from(nilaiProfilKegiatan)
          .innerJoin(
            profilKegiatan,
            eq(nilaiProfilKegiatan.profilId, profilKegiatan.id),
          )
          .where(
            and(
              eq(profilKegiatan.eventId, input.event_id),
              inArray(nilaiProfilKegiatan.mahasiswaId, mahasiswaIds),
            ),
          );

        const nilaiPerMahasiswa = new Map<
          string,
          { profil_id: string; nilai: number }[]
        >();
        for (const n of nilaiList) {
          if (!nilaiPerMahasiswa.has(n.user_id)) {
            nilaiPerMahasiswa.set(n.user_id, []);
          }
          nilaiPerMahasiswa.get(n.user_id)!.push({
            profil_id: n.profil_id,
            nilai: n.nilai ?? 0,
          });
        }

        const formattedMahasiswaList = mahasiswaList.map((m) => ({
          user_id: m.user_id,
          name: m.name ?? '',
          nim: m.nim.toString() ?? '',
          nilai: nilaiPerMahasiswa.get(m.user_id) ?? [],
        }));

        return { mahasiswa: formattedMahasiswaList };
      } catch (error) {
        console.error('Database Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengambil data nilai profil kegiatan',
        });
      }
    }),

  getNilaiKegiatanIndividu: lembagaProcedure
    .input(GetNilaiKegiatanIndividuInputSchema)
    .output(GetNilaiKegiatanIndividuOutputSchema)
    .query(async ({ ctx, input }) => {
      try {
        const event = await ctx.db.query.events.findFirst({
          where: (event, { eq }) => eq(event.id, input.event_id),
          columns: { org_id: true },
        });

        if (!event || event.org_id !== ctx.session.user.lembagaId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied to this event.',
          });
        }

        const mhs = await ctx.db
          .select({
            user_id: keanggotaan.user_id,
            name: users.name,
            nim: mahasiswa.nim,
            jurusan: mahasiswa.jurusan,
            lineId: mahasiswa.lineId,
            whatsapp: mahasiswa.whatsapp,
            division: keanggotaan.division,
            position: keanggotaan.position,
          })
          .from(keanggotaan)
          .innerJoin(mahasiswa, eq(mahasiswa.userId, keanggotaan.user_id))
          .innerJoin(users, eq(users.id, keanggotaan.user_id))
          .where(
            and(
              eq(keanggotaan.event_id, input.event_id),
              eq(keanggotaan.user_id, input.mahasiswa_id),
            ),
          )
          .limit(1);

        if (!mhs.length)
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Mahasiswa tidak ditemukan',
          });

        const dataMahasiswa = mhs[0]!;

        const nilaiList = await ctx.db
          .select({
            profil_id: nilaiProfilKegiatan.profilId,
            nilai: nilaiProfilKegiatan.nilai,
          })
          .from(nilaiProfilKegiatan)
          .innerJoin(
            profilKegiatan,
            eq(nilaiProfilKegiatan.profilId, profilKegiatan.id),
          )
          .where(
            and(
              eq(profilKegiatan.eventId, input.event_id),
              eq(nilaiProfilKegiatan.mahasiswaId, input.mahasiswa_id),
            ),
          );

        const formattedNilaiList = nilaiList.map(({ profil_id, nilai }) => ({
          profil_id,
          nilai: nilai ?? 0,
        }));

        return {
          user_id: dataMahasiswa.user_id,
          name: dataMahasiswa.name ?? '',
          nim: dataMahasiswa.nim.toString() ?? '',
          jurusan: dataMahasiswa.jurusan ?? '',
          lineId: dataMahasiswa.lineId ?? '',
          whatsapp: dataMahasiswa.whatsapp ?? '',
          division: dataMahasiswa.division ?? '',
          position: dataMahasiswa.position ?? '',
          nilai: formattedNilaiList,
        };
      } catch (error) {
        console.error('Database Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengambil nilai individu',
        });
      }
    }),

  getAllNilaiProfilLembaga: lembagaProcedure
    .input(GetAllNilaiProfilLembagaInputSchema)
    .output(GetAllNilaiProfilLembagaOutputSchema)
    .query(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.lembagaId !== input.lembaga_id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied to this lembaga.',
          });
        }

        const anggotaList = await ctx.db
          .select({
            user_id: users.id,
            name: users.name,
            nim: mahasiswa.nim,
          })
          .from(kehimpunan)
          .innerJoin(users, eq(kehimpunan.userId, users.id))
          .innerJoin(mahasiswa, eq(users.id, mahasiswa.userId))
          .where(eq(kehimpunan.lembagaId, input.lembaga_id));

        const anggotaIds = anggotaList.map((a) => a.user_id);

        const nilaiList = await ctx.db
          .select({
            user_id: nilaiProfilLembaga.mahasiswaId,
            profil_id: nilaiProfilLembaga.profilId,
            nilai: nilaiProfilLembaga.nilai,
          })
          .from(nilaiProfilLembaga)
          .innerJoin(
            profilLembaga,
            eq(nilaiProfilLembaga.profilId, profilLembaga.id),
          )
          .where(
            and(
              eq(profilLembaga.lembagaId, input.lembaga_id),
              inArray(nilaiProfilLembaga.mahasiswaId, anggotaIds),
            ),
          );

        const nilaiPerAnggota = new Map<
          string,
          { profil_id: string; nilai: number }[]
        >();
        for (const n of nilaiList) {
          if (!nilaiPerAnggota.has(n.user_id))
            nilaiPerAnggota.set(n.user_id, []);
          nilaiPerAnggota.get(n.user_id)!.push({
            profil_id: n.profil_id,
            nilai: n.nilai ?? 0,
          });
        }

        const formattedAnggotaList = anggotaList.map((a) => ({
          user_id: a.user_id,
          name: a.name ?? '',
          nim: a.nim.toString() ?? '',
          nilai: nilaiPerAnggota.get(a.user_id) ?? [],
        }));

        return { mahasiswa: formattedAnggotaList };
      } catch (error) {
        console.error('Database Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengambil data anggota lembaga',
        });
      }
    }),

  getNilaiLembagaIndividu: lembagaProcedure
    .input(GetNilaiLembagaIndividuInputSchema)
    .output(GetNilaiLembagaIndividuOutputSchema)
    .query(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.lembagaId !== input.lembaga_id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Access denied to this lembaga.',
          });
        }

        const mhs = await ctx.db
          .select({
            user_id: kehimpunan.userId,
            name: users.name,
            nim: mahasiswa.nim,
            jurusan: mahasiswa.jurusan,
            lineId: mahasiswa.lineId,
            whatsapp: mahasiswa.whatsapp,
            division: kehimpunan.division,
            position: kehimpunan.position,
          })
          .from(kehimpunan)
          .innerJoin(mahasiswa, eq(mahasiswa.userId, kehimpunan.userId))
          .innerJoin(users, eq(users.id, kehimpunan.userId))
          .where(
            and(
              eq(kehimpunan.lembagaId, input.lembaga_id),
              eq(kehimpunan.userId, input.mahasiswa_id),
            ),
          )
          .limit(1);

        if (!mhs.length)
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Mahasiswa tidak ditemukan',
          });

        const dataMahasiswa = mhs[0]!;

        const nilaiList = await ctx.db
          .select({
            profil_id: nilaiProfilLembaga.profilId,
            nilai: nilaiProfilLembaga.nilai,
          })
          .from(nilaiProfilLembaga)
          .innerJoin(
            profilLembaga,
            eq(nilaiProfilLembaga.profilId, profilLembaga.id),
          )
          .where(
            and(
              eq(profilLembaga.lembagaId, input.lembaga_id),
              eq(nilaiProfilLembaga.mahasiswaId, input.mahasiswa_id),
            ),
          );

        const formattedNilaiList = nilaiList.map(({ profil_id, nilai }) => ({
          profil_id,
          nilai: nilai ?? 0,
        }));

        return {
          user_id: dataMahasiswa.user_id,
          name: dataMahasiswa.name ?? '',
          nim: dataMahasiswa.nim.toString() ?? '',
          jurusan: dataMahasiswa.jurusan ?? '',
          lineId: dataMahasiswa.lineId ?? '',
          whatsapp: dataMahasiswa.whatsapp ?? '',
          division: dataMahasiswa.division ?? '',
          position: dataMahasiswa.position ?? '',
          nilai: formattedNilaiList,
        };
      } catch (error) {
        console.error('Database Error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Gagal mengambil nilai individu lembaga',
        });
      }
    }),
});
