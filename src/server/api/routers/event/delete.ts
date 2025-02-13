import { adminProcedure } from "../../trpc";
import { z } from "zod";
import { events } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const deleteEvent = adminProcedure
.input(z.object({ id: z.string() }))
.mutation(async ({ ctx, input }) => {
  try {
    const deletedEvent = await ctx.db.delete(events).where(eq(events.id, input.id)).returning();
    return deletedEvent[0];
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