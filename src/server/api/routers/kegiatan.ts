import {z} from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    lembagaProcedure,
} from "~/server/api/trpc";

export const kegiatanRouter = createTRPCRouter({
    // Public Procedures
    getAllPublic: publicProcedure.query(async ({ctx}) => {
        const kegiatan = await ctx.db.query.events.findMany({
            orderBy: (events, {desc}) => desc(events.start_date),
            columns: {
                org_id: false,
            },
        });
        return kegiatan;
    }),

    getByIdPublic: publicProcedure
        .input(z.object({event_id: z.string()}))
        .query(async ({ctx, input}) => {
            const kegiatan = await ctx.db.query.events.findFirst({
                where: (events, {eq}) => eq(events.id, input.event_id),
                with: {
                    lembaga: {
                        columns: {
                            id: true,
                            name: true,
                            description: true,
                        },
                        with: {
                            users: {
                                columns: {
                                    image: true,
                                }
                            }
                        }
                    },
                },
                columns: {},
            });
            return kegiatan;
        }),

    // lembaga procedure
    getAllByLembaga: lembagaProcedure
        .query(async ({ctx}) => {
            const userLembaga = await ctx.db.query.lembaga.findFirst({
                where: (lembaga, {eq}) => eq(lembaga.userId, ctx.session.user.id),
            });
            if (!userLembaga) {
                throw new Error("Lembaga not found");
            }
            const kegiatan = await ctx.db.query.events.findMany({
                where: (events, {eq}) => eq(events.org_id, userLembaga.id),
                orderBy: (events, {desc}) => desc(events.start_date),
                columns: {
                    org_id: false,
                },
            });
            return kegiatan;
        }),

});
