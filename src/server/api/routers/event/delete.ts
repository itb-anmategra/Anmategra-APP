import { lembagaProcedure } from "../../trpc";
import { events, keanggotaan } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import { DeleteEventInputSchema, DeleteEventOutputSchema } from "../../types/event.type";

export const deleteEvent = lembagaProcedure
.input(DeleteEventInputSchema)
.output(DeleteEventOutputSchema)
.mutation(async ({ ctx, input }) => {
  try {

    const existingEvent = await ctx.db.query.events.findFirst({
      where: and(
        eq(events.id, input.id),
        eq(events.org_id, ctx.session.user.lembagaId!)
      )
    });

    if (!existingEvent) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: "Event not found or you don't have permission to delete it"
      });
    }

    const existingKeanggotaan = await ctx.db.query.keanggotaan.findFirst({
      where: eq(keanggotaan.event_id, input.id)
    });

    if (existingKeanggotaan) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: "Cannot delete event with existing keanggotaan"
      });
    }

    await ctx.db.delete(events).where(eq(events.id, input.id));

    return { 
      success: true, 
      id: input.id 
    };
    
  } catch (error) {
    console.error("Database Error:", error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: "An unexpected error occurred during event deletion."
    });
  }
})