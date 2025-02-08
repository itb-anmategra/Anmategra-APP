import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";
import {comboboxDataType} from "~/app/_components/anggota/TambahAnggotaForm";

export const userRouter = createTRPCRouter({
    /*
    * Endpoint untuk tambah anggota pada suatu lembaga
     */
    tambahAnggotaLembagaData: protectedProcedure
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

            const list_posisi_bidang = await ctx.db.query.kehimpunan.findMany({
                where: (kehimpunan, {eq}) => eq(kehimpunan.lembagaId, input.lembagaId),
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
        })
})