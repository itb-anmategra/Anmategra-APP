import {z} from "zod";
import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import {db} from "~/server/db";
import {kehimpunan, lembaga, mahasiswa, users} from "~/server/db/schema";
import {and, eq} from "drizzle-orm";
import {TRPCError} from "@trpc/server";

export const lembagaRouter = createTRPCRouter({
    // Fetch lembaga general information
    getInfo: protectedProcedure
        .input(z.object({lembagaId: z.string().nonempty()}))
        .query(async ({input}) => {
            const lembaga = await db.query.lembaga.findFirst({
                where: (lembaga, {eq}) => eq(lembaga.id, input.lembagaId),
            });

            if (!lembaga) {
                throw new Error("Lembaga not found");
            }

            return {
                id: lembaga.id,
                nama: lembaga.name,
                foto: lembaga.image,
                deskripsi: lembaga.description,
                tanggal_berdiri: lembaga.foundingDate,
                tipe_lembaga: lembaga.type,
                detail_tambahan: {
                    jurusan: lembaga.type === "Himpunan" ? lembaga.major : undefined,
                    bidang: lembaga.type === "UKM" ? lembaga.field : undefined,
                    jumlah_anggota: lembaga.memberCount,
                },
            };
        }),

    getAllAnggota: protectedProcedure
        .input(z.object({lembagaId: z.string().nonempty()}))
        .query(async ({input}) => {
            try {
                const user_lembaga_id = await db.select({
                    id: lembaga.id,
                }).from(lembaga).where(eq(lembaga.userId, input.lembagaId))
                    .limit(1);

                if (!user_lembaga_id || user_lembaga_id.length === 0 || !user_lembaga_id[0]) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Lembaga not found",
                    })
                }

                const anggota = await db
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
                    .where(eq(kehimpunan.lembagaId, user_lembaga_id[0].id));

                return anggota.map((anggota) => ({
                    id: anggota.id,
                    nama: anggota.nama ?? 'Tidak Diketahui',
                    nim: anggota.nim.toString(),
                    divisi: anggota.divisi,
                    posisi: anggota.posisi,
                    posisiColor: "blue",
                }));
            } catch (error) {
                console.error("Database Error:", error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Database Error",
                })
            }
        }),

    // Fetch highlighted/pinned event
    getHighlightedEvent: protectedProcedure
        .input(z.object({lembagaId: z.string().nonempty()}))
        .query(async ({input}) => {
            const highlightedEvent = await db.query.events.findFirst({
                where: (event, {eq, and}) =>
                    and(
                        eq(event.org_id, input.lembagaId),
                        eq(event.is_highlighted, true)
                    ),
            });

            if (!highlightedEvent) return null;

            return {
                id: highlightedEvent.id,
                nama: highlightedEvent.name,
                deskripsi: highlightedEvent.description,
                poster: highlightedEvent.image,
            };
        }),

    // Fetch paginated list of events
    getEvents: protectedProcedure
        .input(
            z.object({
                lembagaId: z.string().nonempty(),
                page: z.number().min(1).default(1),
            })
        )
        .query(async ({input}) => {
            const limit = 10;
            const offset = (input.page - 1) * limit;

            const events = await db.query.events.findMany({
                where: (event, {eq}) => eq(event.org_id, input.lembagaId),
                orderBy: (event, {desc}) => [desc(event.start_date)],
                limit,
                offset,
            });

            const totalEvents = await db.query.events.findMany({
                where: (event, {eq}) => eq(event.org_id, input.lembagaId),
            }).then(events => events.length);

            return {
                events: events.map(event => ({
                    id: event.id,
                    nama: event.name,
                    deskripsi: event.description,
                    poster: event.image,
                    start_date: event.start_date,
                })),
                totalPages: Math.ceil(totalEvents / limit),
            };
        }),

    // Add new anggota to lembaga
    addAnggota: protectedProcedure
        .input(z.object({
            user_id: z.string().nonempty(),
            division: z.string().nonempty(),
            position: z.string().nonempty(),
        }))
        .mutation(async ({ctx, input}) => {
            try {
                const requester = ctx.session.user.id
                const lembaga_id = await db.select({
                    id: lembaga.id,
                }).from(lembaga).where(eq(lembaga.userId, requester))
                    .limit(1);

                if (!lembaga_id || lembaga_id.length === 0 || !lembaga_id[0]) {
                    return {
                        success: false,
                        error: "Lembaga not found",
                    };
                }

                await db
                    .insert(kehimpunan)
                    .values({
                        id: input.user_id + '_' + requester,
                        lembagaId: lembaga_id[0].id,
                        userId: input.user_id,
                        division: input.division,
                        position: input.position,
                    })

                return {
                    success: true,
                };
            } catch (error) {
                console.error("Database Error:", error);
                return {
                    success: false,
                    error: "Database Error",
                };
            }
        }),

    removeAnggota: protectedProcedure
        .input(z.object({
            user_id: z.string().nonempty(),
        }))
        .mutation(async ({ctx, input}) => {
            const user_lembaga_id = ctx.session.user.id;
            const lembaga_id = await db.select({
                id: lembaga.id,
            }).from(lembaga).where(eq(lembaga.userId, user_lembaga_id))
                .limit(1);

            if (!lembaga_id || lembaga_id.length === 0 || !lembaga_id[0]) {
                return {
                    success: false,
                    error: "Lembaga not found",
                };
            }

            await db
                .delete(kehimpunan)
                .where(and(eq(kehimpunan.userId, input.user_id), eq(kehimpunan.lembagaId, lembaga_id[0].id)));

            return {
                success: true,
            }
        }),

    editProfil: protectedProcedure
        .input(z.object({
            nama: z.string().nonempty(),
            deskripsi: z.string().nonempty(),
            gambar: z.string().optional(),
        }))
        .mutation(async ({ctx, input}) => {
            const user_id = ctx.session.user.id;
            const lembaga_id = await db.select({
                id: lembaga.id,
            }).from(lembaga).where(eq(lembaga.userId, user_id))
                .limit(1);

            if (!lembaga_id || lembaga_id.length === 0 || !lembaga_id[0]) {
                return {
                    success: false,
                    error: "Lembaga not found",
                };
            }

            await db
                .update(lembaga)
                .set({
                    name: input.nama,
                    description: input.deskripsi,
                    image: input.gambar,
                })
                .where(eq(lembaga.id, lembaga_id[0].id));

            return {
                success: true,
            };
        }),
});
