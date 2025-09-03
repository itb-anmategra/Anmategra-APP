import {protectedProcedure} from "../../trpc";
import {events} from "~/server/db/schema";
import {TRPCError} from "@trpc/server";
import { CreateEventInputSchema, CreateEventOutputSchema } from "../../types/event.type";

function generateShortId(length = 10) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("").slice(0, length);
}

export const createEvent = protectedProcedure
    .input(CreateEventInputSchema)
    .output(CreateEventOutputSchema)
    .mutation(async ({ctx, input}) => {
        try {
            if(!ctx.session.user.lembagaId){
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }

            const newEvent = await ctx.db.insert(events).values({
                id: generateShortId(),
                org_id: ctx.session.user.lembagaId,
                ...input,
                start_date: new Date(input.start_date),
                end_date: input.end_date ? new Date(input.end_date) : null
            }).returning();

            if (!newEvent[0]) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "Failed to create event."
                });
            }

            return newEvent[0];

        } catch (error) {
            console.error("Database Error:", error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "An unexpected error occurred during event creation."
            });
        }
    })