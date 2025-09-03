import {createTRPCRouter, lembagaProcedure, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {type comboboxDataType} from "~/app/_components/anggota/TambahAnggotaForm";
import {mahasiswa, users} from "~/server/db/schema";
import {eq} from "drizzle-orm";
import { EditProfilMahasiswaInputSchema, GetTambahAnggotaKegiatanOptionsInputSchema, GetTambahAnggotaKegiatanOptionsOutputSchema, GetTambahAnggotaLembagaOptionsInputSchema, GetTambahAnggotaLembagaOptionsOutputSchema } from "../types/user.type";

export const userRouter = createTRPCRouter({
    /*
    * Endpoint untuk mengambil data pilihan untuk tambah anggota pada suatu lembaga
    */
    getTambahAnggotaLembagaOptions: lembagaProcedure
        .input(GetTambahAnggotaLembagaOptionsInputSchema)
        .output(GetTambahAnggotaLembagaOptionsOutputSchema)
        .query(async ({ctx, input}) => {
            const [mahasiswa_hide_list, lembaga_list] = await Promise.all([
                ctx.db.query.kehimpunan.findMany({
                    where: (kehimpunan, {eq}) => eq(kehimpunan.lembagaId, input.lembagaId),
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
            const mahasiswa_hide_list_id = mahasiswa_hide_list.map((item) => item.userId);
            const lembaga_list_id = lembaga_list.map((item) => item.userId);
            const hide_list_id = mahasiswa_hide_list_id.concat(lembaga_list_id);

            const [mahasiswa_list, list_posisi_bidang] = await Promise.all([
                ctx.db.query.users.findMany({
                    where: (users, {notInArray}) => notInArray(users.id, hide_list_id),
                    columns: {
                        id: true,
                        name: true,
                    },
                }),
                ctx.db.query.kehimpunan.findMany({
                    where: (kehimpunan, {eq}) => eq(kehimpunan.lembagaId, input.lembagaId),
                    columns: {
                        position: true,
                        division: true,
                    },
                }),
            ]);

            const formattedMahasiswaList = mahasiswa_list.map((item) => ({
                value: item.id,
                label: item.name ?? "",
            }));

            const uniquePosisi = Array.from(new Set(list_posisi_bidang.map(item => item.position)));
            const posisi_list = uniquePosisi.map(position => ({
                value: position,
                label: position ?? "",
            }));

            const uniqueBidang = Array.from(new Set(list_posisi_bidang.map(item => item.division)));
            const bidang_list = uniqueBidang.map(division => ({
                value: division,
                label: division ?? "",
            }));

            return {
                mahasiswa: formattedMahasiswaList ?? [] as comboboxDataType[],
                posisi: posisi_list ?? [] as comboboxDataType[],
                bidang: bidang_list ?? [] as comboboxDataType[],
            };
        }),
    /*
    * Endpoint untuk mengambil data pilihan untuk tambah anggota pada suatu kegiatan
    */
    getTambahAnggotaKegiatanOptions: protectedProcedure
        .input(GetTambahAnggotaKegiatanOptionsInputSchema)
        .output(GetTambahAnggotaKegiatanOptionsOutputSchema)
        .query(async ({ctx, input}) => {
            const [mahasiswa_hide_list, lembaga_list] = await Promise.all([
                ctx.db.query.keanggotaan.findMany({
                    where: (keanggotaan, {eq}) => eq(keanggotaan.event_id, input.kegiatanId),
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
            const mahasiswa_hide_list_id = mahasiswa_hide_list.map((item) => item.user_id);
            const lembaga_list_id = lembaga_list.map((item) => item.userId);
            const hide_list_id = mahasiswa_hide_list_id.concat(lembaga_list_id);

            const [mahasiswa_list, list_posisi_bidang] = await Promise.all([
                ctx.db.query.users.findMany({
                    where: (users, {notInArray}) => notInArray(users.id, hide_list_id),
                    columns: {
                        id: true,
                        name: true,
                    },
                }),
                ctx.db.query.keanggotaan.findMany({
                    where: (keanggotaan, {eq}) => eq(keanggotaan.event_id, input.kegiatanId),
                    columns: {
                        position: true,
                        division: true,
                    },
                }),
            ]);

            const formattedMahasiswaList = mahasiswa_list.map((item) => ({
                value: item.id,
                label: item.name ?? "",
            }));

            const uniquePosisi = Array.from(new Set(list_posisi_bidang.map(item => item.position)));
            const posisi_list = uniquePosisi.map(position => ({
                value: position,
                label: position ?? "",
            }));

            const uniqueBidang = Array.from(new Set(list_posisi_bidang.map(item => item.division)));
            const bidang_list = uniqueBidang.map(division => ({
                value: division,
                label: division ?? "",
            }));

            return {
                mahasiswa: formattedMahasiswaList ?? [] as comboboxDataType[],
                posisi: posisi_list ?? [] as comboboxDataType[],
                bidang: bidang_list ?? [] as comboboxDataType[],
            }
        }),

    /*
    * Endpoint untuk edit profil mahasiswa
    */
    editProfilMahasiswa: protectedProcedure
        .input(EditProfilMahasiswaInputSchema)
        .output(z.void())
        .mutation(async ({ctx, input}) => {
            if (input.image) {
                await ctx.db.update(users).set({
                    image: input.image,
                }).where(eq(users.id, ctx.session.user.id));
            }
            await ctx.db.update(mahasiswa).set({
                lineId: input.idLine,
                whatsapp: input.noWhatsapp,
            }).where(eq(mahasiswa.userId, ctx.session.user.id));
        }),
})