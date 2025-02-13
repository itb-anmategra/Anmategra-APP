import {createTRPCRouter, protectedProcedure, publicProcedure,} from "~/server/api/trpc";
import {type Kepanitiaan} from "~/types/kepanitiaan";
import {z} from "zod";
import {mahasiswa, users} from "~/server/db/schema";
import {eq, ilike, or, sql} from "drizzle-orm";

export const landingRouter = createTRPCRouter({
    getRecentKepanitiaan: publicProcedure.query(async ({ctx}) => {
        const kepanitiaan = await ctx.db.query.lembaga.findMany({
            where: (lembaga, {eq}) => eq(lembaga.type, "Kepanitiaan"),
            orderBy: (lembaga, {desc}) => desc(lembaga.foundingDate),
            limit: 8,
            columns: {
                id: true,
                name: true,
                description: true,
                memberCount: true,
                foundingDate: true,
                endingDate: true,
                image: true,
            },
        });

        const formattedKepanitiaan: Kepanitiaan[] = kepanitiaan.map((item) => ({
            lembaga: {
                name: item.name,
                profilePicture: item.image,
            },
            id: item.id,
            name: item.name,
            description: item.description,
            quota: item.memberCount ?? 0,
            startDate: new Date(item.foundingDate),
            endDate: item.endingDate ? new Date(item.endingDate) : null,
        }));

        return formattedKepanitiaan;
    }),

    getRecentEvents: publicProcedure.query(async ({ctx}) => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const events = await ctx.db.query.events.findMany({
            where: (events, {gte}) => gte(events.start_date, oneMonthAgo),
            orderBy: (events, {desc}) => desc(events.start_date),
            with: {
                lembaga: {},
            },
            limit: 8,
            columns: {
                id: true,
                name: true,
                description: true,
                image: true,
                start_date: true,
                end_date: true,
                participant_count: true,
            },
        });

        const formattedEvents: Kepanitiaan[] = events.map((item) => ({
            lembaga: {
                name: item.lembaga?.name ?? "",
                profilePicture: item.lembaga?.image ?? "",
            },
            id: item.id,
            name: item.name,
            description: item.description,
            quota: item.participant_count ?? 0,
            startDate: new Date(item.start_date),
            endDate: item.end_date ? new Date(item.end_date) : null,
        }));

        return formattedEvents;
    }),

    getTopEvents: publicProcedure.query(async ({ctx}) => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const events = await ctx.db.query.events.findMany({
            where: (events, {gte}) => gte(events.start_date, sixMonthsAgo),
            orderBy: (events, {desc}) => desc(events.participant_count),
            with: {
                lembaga: {},
            },
            limit: 8,
            columns: {
                id: true,
                name: true,
                description: true,
                image: true,
                start_date: true,
                end_date: true,
                participant_count: true,
            },
        });

        const formattedEvents: Kepanitiaan[] = events.map((item) => ({
            lembaga: {
                name: item.lembaga?.name ?? "",
                profilePicture: item.lembaga?.image ?? "",
            },
            id: item.id,
            name: item.name,
            description: item.description,
            quota: item.participant_count ?? 0,
            startDate: new Date(item.start_date),
            endDate: item.end_date ? new Date(item.end_date) : null,
        }));

        return formattedEvents;
    }),

    getResults: protectedProcedure
        .input(z.object({query: z.string()}))
        .query(async ({ctx, input}) => {
            const {query} = input;
            const limit = 10;

            // Cek apakah query adalah angka (hanya digit 0-9)
            const isNumeric = /^\d+$/.test(query);

            // Inner join User dan Mahasiswa dengan kondisi pencarian
            const mahasiswaResults = await ctx.db
                .select({
                    userId: users.id,
                    nama: users.name,
                    nim: mahasiswa.nim,
                    jurusan: mahasiswa.jurusan,
                    image: users.image,
                })
                .from(users)
                .innerJoin(mahasiswa, eq(users.id, mahasiswa.userId))
                .where(
                    isNumeric
                        ? or(
                            // Jika query numerik: cari di kolom nim (integer) dan name (string)
                            // @ts-expect-error Mahasiswa.nim adalah integer
                            ilike(sql`${mahasiswa.nim}::text`, `%${query}%`), // Cast integer ke text untuk ilike
                            ilike(users.name, `%${query}%`)
                        )
                        : // Jika bukan numerik: cari hanya di kolom name
                        ilike(users.name, `%${query}%`)
                )
                .limit(limit);


            const lembaga = await ctx.db.query.lembaga.findMany({
                where: (lembaga, {ilike}) => ilike(lembaga.name, `%${query}%`),
                limit,
            });

            const formattedLembaga: Kepanitiaan[] = lembaga.map((item) => ({
                lembaga: {
                    id: item.id,
                    name: item.name,
                    profilePicture: item.image,
                },
                name: item.name,
                description: item.description,
                quota: item.memberCount ?? 0,
                startDate: new Date(item.foundingDate),
                endDate: item.endingDate ? new Date(item.endingDate) : null,
            }));


            const event = await ctx.db.query.events.findMany({
                where: (event, {ilike}) => ilike(event.name, `%${query}%`),
                with: {
                    lembaga: {},
                },
                limit,
            });

            const formattedKepanitiaan: Kepanitiaan[] = event.map((item) => ({
                lembaga: {
                    name: item.lembaga?.name ?? "",
                    profilePicture: item.lembaga?.image ?? "",
                },
                id: item.id,
                name: item.name,
                description: item.description,
                quota: item.participant_count ?? 0,
                startDate: new Date(item.start_date),
                endDate: item.end_date ? new Date(item.end_date) : null,
            }));

            return {
                "mahasiswa": mahasiswaResults,
                "lembaga": formattedLembaga,
                "kegiatan": formattedKepanitiaan,
            };
        }),
});
