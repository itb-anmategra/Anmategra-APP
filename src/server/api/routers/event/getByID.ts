import { adminProcedure } from "../../trpc";
import { z } from "zod";

export const getEvent = adminProcedure
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
            eventOrganograms: true
        }
        });
        return event;
    })