import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {z} from "zod";

export const userRouter = createTRPCRouter({
    /*
    * Endpoint untuk tambah anggota pada suatu lembaga
     */
    tambahAnggotaLembagaData: protectedProcedure
        .input(z.object({lembagaId: z.string()}))
        .query(async ({ctx, input}) => {
            const user_hide_list = await ctx.db.query.kehimpunan.findMany({
                where: (kehimpunan, {eq}) => eq(kehimpunan.lembagaId, input.lembagaId),
                columns: {
                    userId: true,
                },
            });

            const user_hide_list_id = user_hide_list.map((item) => item.userId);
            const user_list = await ctx.db.query.users.findMany({
                where: (users, {notInArray}) => notInArray(users.id, user_hide_list_id),
                columns: {
                    id: true,
                    name: true,
                },
            });

            const formattedUserList = user_list.map((item) => ({
                value: item.id,
                label: item.name ?? "",
            }));

            return formattedUserList;
        })
})