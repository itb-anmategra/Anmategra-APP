import {createTRPCRouter, lembagaProcedure, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {type comboboxDataType} from "~/app/_components/anggota/TambahAnggotaForm";
import {mahasiswa, users} from "~/server/db/schema";
import {eq} from "drizzle-orm";

export const userRouter = createTRPCRouter({
    /*
    * Endpoint untuk tambah anggota pada suatu lembaga
     */
    tambahAnggotaLembagaData: lembagaProcedure
        .input(z.object({lembagaId: z.string()}))
        .query(async ({ctx, input}) => {
            const user_hide_list = await ctx.db.query.kehimpunan.findMany({
                columns: {
                    userId: true,
                },
            });

            const user_lembaga_hide_list = await ctx.db.query.lembaga.findMany({
                columns: {
                    userId: true,
                },
            });

            const user_hide_list_id = user_hide_list.map((item) => item.userId);
            const user_lembaga_hide_list_id = user_lembaga_hide_list.map((item) => item.userId);
            const user_hide_list_id_final = user_hide_list_id.concat(user_lembaga_hide_list_id);

            const user_list = await ctx.db.query.users.findMany({
                where: (users, {notInArray}) => notInArray(users.id, user_hide_list_id_final),
                columns: {
                    id: true,
                    name: true,
                },
            });

            const formattedUserList = user_list.map((item) => ({
                value: item.id,
                label: item.name ?? "",
            }));

            const lembaga_id = await ctx.db.query.lembaga.findFirst({
                where: (lembaga, {eq}) => eq(lembaga.userId, input.lembagaId),
                columns: {
                    id: true,
                },
            });

            if (!lembaga_id) {
                throw new Error("Lembaga tidak ditemukan");
            }

            const list_posisi_bidang = await ctx.db.query.kehimpunan.findMany({
                where: (kehimpunan, {eq}) => eq(kehimpunan.lembagaId, lembaga_id.id),
                columns: {
                    position: true,
                    division: true,
                },
            })

            const posisi_list = list_posisi_bidang.map((item) => ({
                value: item.position,
                label: item.position ?? "",
            }));

            const bidang_list = list_posisi_bidang.map((item) => ({
                value: item.division,
                label: item.division ?? "",
            }));

            return {
                mahasiswa: formattedUserList ?? [] as comboboxDataType[],
                posisi: posisi_list ?? [] as comboboxDataType[],
                bidang: bidang_list ?? [] as comboboxDataType[],
            };
        }),

    tambahAnggotaKegiatanData: protectedProcedure
        .input(z.object({kegiatanId: z.string()}))
        .query(async ({ctx, input}) => {

            const user_hide_list = await ctx.db.query.keanggotaan.findMany({
                where: (keanggotaan, {eq}) => eq(keanggotaan.event_id, input.kegiatanId),
                columns: {
                    user_id: true,
                },
            });

            const user_lembaga_hide_list = await ctx.db.query.lembaga.findMany({
                columns: {
                    userId: true,
                },
            });

            const formatted_user_hide_list = user_hide_list.map((item) => item.user_id);
            const formatted_user_lembaga_hide_list = user_lembaga_hide_list.map((item) => item.userId);
            const formatted_user_hide_list_final = formatted_user_hide_list.concat(formatted_user_lembaga_hide_list);

            const user_list = await ctx.db.query.users.findMany({
                where: (users, {notInArray}) => notInArray(users.id, formatted_user_hide_list_final),
                columns: {
                    id: true,
                    name: true,
                },
            });

            const formattedUserList = user_list.map((item) => ({
                value: item.id,
                label: item.name ?? "",
            }));

            const list_posisi_bidang = await ctx.db.query.keanggotaan.findMany({
                where: (keanggotaan, {eq}) => eq(keanggotaan.event_id, input.kegiatanId),
                columns: {
                    position: true,
                    division: true,
                },
            })

            const posisi_list = list_posisi_bidang.map((item) => ({
                value: item.position,
                label: item.position ?? "",
            }));

            const bidang_list = list_posisi_bidang.map((item) => ({
                value: item.division,
                label: item.division ?? "",
            }));

            return {
                mahasiswa: formattedUserList ?? [] as comboboxDataType[],
                posisi: posisi_list ?? [] as comboboxDataType[],
                bidang: bidang_list ?? [] as comboboxDataType[],
            }
        }),

    gantiProfile: protectedProcedure
    .input(z.object({
        image: z.string().optional(),
        idLine: z.string().min(3).max(30),
        noWhatsapp: z.string().regex(/^0\d{10,12}$/),
    }))
    .mutation(async ({ctx, input}) => {
        if (input.image) {
            await ctx.db.update(users).set({
                image: input.image,
            }).where(eq(users.id, ctx.session.user.id)).returning();
        }
        await ctx.db.update(mahasiswa).set({
            lineId: input.idLine,
            whatsapp: input.noWhatsapp,
        })
        .where(eq(mahasiswa.userId, ctx.session.user.id))
        .returning();
    }),
})