import {z} from "zod";
import {createTRPCRouter, publicProcedure,} from "~/server/api/trpc";
import {db} from "~/server/db";
import {events, keanggotaan, kehimpunan, lembaga, mahasiswa, users} from "~/server/db/schema";
import {and, desc, eq} from "drizzle-orm";
import {type Kepanitiaan} from "~/types/kepanitiaan";
import {TRPCError} from "@trpc/server";

export const profileRouter = createTRPCRouter({

    getMahasiswa: publicProcedure
        .input(z.object({mahasiswaId: z.string()}))
        .query(async ({input}) => {
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
                    name: item.event.name,
                    profilePicture: item.event.image,
                },
                id: item.event.id,
                name: item.event.name,
                description: item.event.description,
                quota: item.event.participant_count ?? 0,
                image: item.event.background_image,
                startDate: new Date(item.event.start_date),
                endDate: item.event.end_date ? new Date(item.event.end_date) : null,
            }));

            if (mahasiswaResult.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Kegiatan not found",
                })
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
                with: {
                    users: {
                        columns: {
                            image: true,
                        }
                    },
                },
                columns: {
                    id: true,
                    name: true,
                    description: true,
                    memberCount: true,
                    foundingDate: true,
                    endingDate: true,
                    type: true,
                },
            });

            if (!lembaga) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Kegiatan not found",
                })
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
                image: item.background_image,
                startDate: new Date(item.start_date),
                endDate: item.end_date ? new Date(item.end_date) : null,
            }));

            const highlightedEvent = await ctx.db.query.events.findMany({
                where: (events, {eq}) => and(eq(events.org_id, input.lembagaId), eq(events.is_highlighted, true)),
                orderBy: desc(events.start_date),
            });

            const anggota = await db
                .select({
                    id: users.id,
                    nama: users.name,
                    nim: mahasiswa.nim,
                    image: users.image,
                    jurusan: mahasiswa.jurusan,
                    divisi: kehimpunan.division,
                    posisi: kehimpunan.position,
                })
                .from(kehimpunan)
                .innerJoin(users, eq(kehimpunan.userId, users.id))
                .innerJoin(mahasiswa, eq(users.id, mahasiswa.userId))
                .where(eq(kehimpunan.lembagaId, input.lembagaId));

            const formattedAnggota = anggota.map((anggota) => ({
                id: anggota.id,
                nama: anggota.nama ?? 'john doe',
                nim: anggota.nim.toString(),
               jurusan: anggota.jurusan,
               image: anggota.image,
               divisi: anggota.divisi,
               posisi: anggota.posisi,
               posisiColor: "blue",
            }));

            return {
                lembagaData: lembaga,
                newestEvent: formattedEvents,
                highlightedEvent: highlightedEvent[0],
                anggota: formattedAnggota
            }
        }),

    getKegiatan: publicProcedure
        .input(z.object({kegiatanId: z.string()}))
        .query(async ({ input}) => {
            const kegiatan = await db
                .select()
                .from(events)
                .where(eq(events.id, input.kegiatanId))
                .limit(1)

            if (kegiatan.length === 0 || !kegiatan[0]) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Kegiatan not found",
                })
            }

            if (kegiatan[0].org_id === null) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Kegiatan not found",
                })
            }

            const lembagaRes = await db
                .select({
                    id: lembaga.id,
                    name: lembaga.name,
                    description: lembaga.description,
                    image: users.image,
                    memberCount: lembaga.memberCount,
                    foundingDate: lembaga.foundingDate,
                    endingDate: lembaga.endingDate,
                    type: lembaga.type,
                })
                .from(lembaga)
                .innerJoin(users, eq(lembaga.userId, users.id))
                .where(eq(lembaga.id, kegiatan[0].org_id))
                .limit(1)

            if (lembagaRes.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Kegiatan not found",
                })
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

            const formattedParticipants = participants.map((participant) => ({
                id: participant.userId,
                nama: participant.nama ?? 'john doe',
                nim: participant.nim.toString(),
                jurusan: participant.jurusan,
                image: participant.image,
                posisi: participant.position,
                divisi: participant.divisi,
                posisiColor: "blue",
            }));

            return {
                kegiatan: kegiatan[0],
                lembaga: lembagaRes[0],
                participant: formattedParticipants,
            }
        }),
});