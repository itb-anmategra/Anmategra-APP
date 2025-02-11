import {protectedProcedure} from "../../trpc";
import { z } from "zod";
import {db} from "~/server/db";
import {keanggotaan, mahasiswa, users} from "~/server/db/schema";
import {eq} from "drizzle-orm";
import {TRPCError} from "@trpc/server";

export const getEvent = protectedProcedure
    .input(
        z.object({
            id: z.string()
        })
    )
    .query(async ({ ctx, input }) => {
        const event = await ctx.db.query.events.findFirst({
        where: (event, {eq}) => (eq(event.id, input.id)),
        with: {
                lembaga: true,
            }
        });
        return event;
    })

export const getAllAnggota = protectedProcedure
    .input(
        z.object({
            event_id: z.string()
        })
    )
    .query(async ({ input }) => {
        try {
            const anggota = await db
                .select({
                    id: keanggotaan.id,
                    nama: users.name,
                    nim: mahasiswa.nim,
                    division: keanggotaan.division,
                    position: keanggotaan.position,
                })
                .from(keanggotaan)
                .innerJoin(users, eq(keanggotaan.user_id, users.id))
                .innerJoin(mahasiswa, eq(users.id, mahasiswa.userId))
                .where(eq(keanggotaan.event_id, input.event_id))

            const formatted_anggota = anggota.map((anggota) => {
                return {
                    id: anggota.id,
                    nama: anggota.nama ?? '',
                    nim: anggota.nim.toString() ?? '',
                    divisi: anggota.division ?? '',
                    posisi: anggota.position ?? '',
                    posisiColor: "blue"
                }
            })

            return formatted_anggota

        } catch (error) {
            console.error(error)
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error',
            })
        }
    })