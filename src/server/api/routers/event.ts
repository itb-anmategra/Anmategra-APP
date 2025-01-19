import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
// import { events } from "~/server/db/schema";

export const eventRouter = createTRPCRouter({
    getByID: publicProcedure
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
     }),
});