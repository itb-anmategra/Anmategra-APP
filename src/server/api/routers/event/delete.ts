import { adminProcedure } from "../../trpc";
import { events } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { DeleteEventInputSchema, DeleteEventOutputSchema } from "../../types/event.type";

export const deleteEvent = adminProcedure
.input(DeleteEventInputSchema)
.output(DeleteEventOutputSchema)
.mutation(async ({ ctx, input }) => {
  try {

    const existingEvent = await ctx.db.query.events.findFirst({
      where: eq(events.id, input.id)
    });

    if (!existingEvent) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: "Event not found"
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