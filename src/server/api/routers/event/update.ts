import {protectedProcedure} from "../../trpc";
import {z} from "zod";
import {events, keanggotaan, lembaga} from "~/server/db/schema";
import {TRPCError} from "@trpc/server";
import {and, eq} from "drizzle-orm";
import {db} from "~/server/db";

export const updateEvent = protectedProcedure
    .input(
        z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            image: z.string().url().optional(),
            background_image: z.string().url().optional(),
            start_date: z.string().datetime().optional(),
            end_date: z.string().datetime().nullable().optional(),
            status: z.enum(["Coming Soon", "On going", "Ended"]),
            oprec_link: z.string().url().or(z.literal("")).optional(),
            location: z.string(),
            participant_limit: z.number().int(),
            participant_count: z.number().int(),
            is_highlighted: z.boolean(),
            is_organogram: z.boolean()
        })
    )
    .mutation(async ({ctx, input}) => {
        try {
            const requester = ctx.session.user.id
            const org_id = await ctx.db.query.lembaga.findFirst({
                where: eq(lembaga.userId, requester),
                columns: {
                    id: true
                }
            })

            if (!org_id) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Organization not found."
                });
            }

            const eventToUpdate = await ctx.db.query.events.findFirst({
                where: and(
                    eq(events.id, input.id),
                    eq(events.org_id, org_id.id)
                ),
                columns: {
                    id: true
                }
            });

            if (!eventToUpdate) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: "Event not found."
                });
            }

            const updatedEvent = await ctx.db.update(events)
              .set({
                org_id: org_id.id,
                ...input,
                start_date: input.start_date ? new Date(input.start_date) : undefined,
                end_date: input.end_date ? new Date(input.end_date) : undefined,
              })
              .where(eq(events.id, eventToUpdate.id))
              .returning();

            return updatedEvent[0];
        } catch (error) {
            console.error("Database Error:", error);

            if (error instanceof Error) {
                const pgError = error as { code?: string };

                switch (pgError.code) {
                    case '23505':
                        throw new TRPCError({
                            code: 'CONFLICT',
                            message: "A record with the same unique field already exists."
                        });
                    case '23503':
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: "Invalid reference to another table."
                        });
                    case '23514':
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: "Input values violate database constraints."
                        });
                }
            }

            // Generic error handling
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "An unexpected error occurred during event creation."
            });
        }
    })

export const addNewPanitia = protectedProcedure
    .input(
        z.object({
            event_id: z.string(),
            user_id: z.string(),
            position: z.string(),
            division: z.string(),
        })
    )
    .mutation(async ({ctx, input}) => {
        try {
            const requester = ctx.session.user.id
            const requester_org_id = await db
                .select({
                    org_id: lembaga.id
                })
                .from(lembaga)
                .where(eq(lembaga.userId, requester))
                .limit(1)

            if (!requester_org_id) {
                console.error("Organization not found.")
                throw new TRPCError({
                    code: 'NOT_FOUND',
                })
            }

            if (!requester_org_id[0]) {
                console.error("Organization not found.")
                throw new TRPCError({
                    code: 'NOT_FOUND',
                })
            }

            const is_requester_is_event_owner = await db
                .select({
                    owner_id: events.org_id,
                    participant_count: events.participant_count
                })
                .from(events)
                .where(and(eq(events.id, input.event_id), eq(events.org_id, requester_org_id[0].org_id)));

            if (!is_requester_is_event_owner[0]) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED'
                })
            }

            await ctx.db.insert(keanggotaan).values({
                id: input.event_id + '_' + input.user_id,
                event_id: input.event_id,
                user_id: input.user_id,
                position: input.position,
                division: input.division,
            });

            await ctx.db.update(events).set(
                {
                    participant_count: is_requester_is_event_owner[0].participant_count + 1
                }
            ).where(eq(events.id, input.event_id))

            return {
                success: true,
                message: "Panitia added successfully.",
            }
        } catch (error) {
            console.error("Database Error:", error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "An unexpected error occurred during event creation."
            });
        }
    })

export const removePanitia = protectedProcedure
    .input(
        z.object({
            event_id: z.string(),
            id: z.string()
        })
    )
    .mutation(async ({ctx, input}) => {
        try {
            const requester = ctx.session.user.id
            const requester_org_id = await db
                .select({
                    org_id: lembaga.id
                })
                .from(lembaga)
                .where(eq(lembaga.userId, requester))
                .limit(1)

            if (!requester_org_id) {
                console.error("Organization not found.")
                throw new TRPCError({
                    code: 'NOT_FOUND',
                })
            }

            if (!requester_org_id[0]) {
                console.error("Organization not found.")
                throw new TRPCError({
                    code: 'NOT_FOUND',
                })
            }

            const is_requester_is_event_owner = await db
                .select({
                    owner_id: events.org_id,
                    participant_count: events.participant_count
                })
                .from(events)
                .where(and(eq(events.id, input.event_id), eq(events.org_id, requester_org_id[0].org_id)));

            if (!is_requester_is_event_owner[0]) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED'
                })
            }

            await ctx.db.delete(keanggotaan).where(
                and(
                    eq(keanggotaan.event_id, input.event_id),
                    eq(keanggotaan.id, input.id)
                )
            )

            await ctx.db.update(events).set(
                {
                    participant_count: is_requester_is_event_owner[0].participant_count - 1
                }
            ).where(eq(events.id, input.event_id))

            return {
                success: true,
                message: "Panitia added successfully.",
            }

        } catch (error) {
            console.error("Database Error:", error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "An unexpected error occurred during event creation."
            });
        }
    })