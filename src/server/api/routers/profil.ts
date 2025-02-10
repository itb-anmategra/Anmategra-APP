import {z} from "zod";
import {createTRPCRouter, publicProcedure,} from "~/server/api/trpc";
import {db} from "~/server/db";
import {events, keanggotaan, lembaga, mahasiswa, users} from "~/server/db/schema";
import {and, desc, eq} from "drizzle-orm";
import {Kepanitiaan} from "~/types/kepanitiaan";

export const profileRouter = createTRPCRouter({

    getMahasiswa: publicProcedure
        .input(z.object({mahasiswaId: z.string()}))
        .query(async ({ctx, input}) => {
            const mahasiswaResult = await db
                .select()
                .from(mahasiswa)
                .innerJoin(users, eq(mahasiswa.userId, users.id))
                .where(eq(users.id, input.mahasiswaId))
                .limit(1)

            const newestEvent = await db
                .select()
                .from(events)
                .innerJoin(keanggotaan, eq(events.id, keanggotaan.event_id))
                .where(eq(keanggotaan.user_id, input.mahasiswaId))
                .orderBy(desc(events.start_date))

            const formattedKepanitiaan: Kepanitiaan[] = newestEvent.map((item) => ({
                lembaga: {
                    id: item.event.id,
                    name: item.event.name,
                    profilePicture: item.event.image,
                },
                name: item.event.name,
                description: item.event.description,
                quota: item.event.participant_count ?? 0,
                startDate: new Date(item.event.start_date),
                endDate: item.event.end_date ? new Date(item.event.end_date) : null,
            }));

            if (mahasiswaResult.length === 0) {
                return {
                    error: "Mahasiswa not found",
                }
            }

            return {
                mahasiswaData: mahasiswaResult[0],
                newestEvent: formattedKepanitiaan,
            }
        }),

    getLembaga: publicProcedure
        .input(z.object({lembagaId: z.string()}))
        .query(async ({ctx, input}) => {
            const lembaga = await ctx.db.query.lembaga.findFirst({
                where: (lembaga, {eq}) => eq(lembaga.id, input.lembagaId),
                columns: {
                    id: true,
                    name: true,
                    description: true,
                    image: true,
                    memberCount: true,
                    foundingDate: true,
                    endingDate: true,
                    type: true,
                },
            });

            if (!lembaga) {
                return {
                    error: "Lembaga not found",
                }
            }

            const newestEvent = await ctx.db.query.events.findMany({
                where: (events, {eq}) => eq(events.org_id, input.lembagaId) && eq(events.is_highlighted, false),
                orderBy: desc(events.start_date),
            });

            const formattedEvents: Kepanitiaan[] = newestEvent.map((item) => ({
                lembaga: {
                    id: item.id,
                    name: item.name,
                    profilePicture: item.image,
                },
                id: item.id,
                name: item.name,
                description: item.description,
                quota: item.participant_count ?? 0,
                startDate: new Date(item.start_date),
                endDate: item.end_date ? new Date(item.end_date) : null,
            }));

            const highlightedEvent = await ctx.db.query.events.findMany({
                where: (events, {eq}) => eq(events.org_id, input.lembagaId) && eq(events.is_highlighted, true),
                orderBy: desc(events.start_date),
            });

            return {
                lembagaData: lembaga,
                newestEvent: formattedEvents,
                highlightedEvent: highlightedEvent[0],
            }

        }),

    getKegiatan: publicProcedure
        .input(z.object({kegiatanId: z.string()}))
        .query(async ({ctx, input}) => {
            const kegiatan = await db
                .select()
                .from(events)
                .where(eq(events.id, input.kegiatanId))
                .limit(1)

            if (kegiatan.length === 0 || !kegiatan[0]) {
                return {
                    error: "Kegiatan not found",
                }
            }

            if (kegiatan[0].org_id === null) {
                return {
                    error: "Lembaga not defined",
                }
            }

            const lembagaRes = await db
                .select()
                .from(lembaga)
                .where(eq(lembaga.id, kegiatan[0].org_id))
                .limit(1)

            if (lembagaRes.length === 0) {
                return {
                    error: "Lembaga not found",
                }
            }

            const participants = await db
                .select({
                    userId: mahasiswa.userId,
                    nama: users.name,
                    nim: mahasiswa.nim,
                    jurusan: mahasiswa.jurusan,
                    image: users.image,
                    position: keanggotaan.position,
                    divisi: keanggotaan.division,
                })
                .from(keanggotaan)
                .innerJoin(mahasiswa, eq(keanggotaan.user_id, mahasiswa.userId))
                .innerJoin(users, eq(mahasiswa.userId, users.id))
                .where(eq(keanggotaan.event_id, input.kegiatanId));

            return {
                kegiatan: kegiatan[0],
                lembaga: lembagaRes[0],
                participant: participants,
            }
        }),
});