import { adminProcedure } from "../../trpc";
import { z } from "zod";
import { events } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const updateEvent = adminProcedure
.input(
  z.object({
      id: z.string(),
      name: z.string(),
      org_id: z.string().optional(),
      description: z.string(),
      image: z.string(),
      start_date: z.string().datetime(),
      end_date: z.string().datetime(),
      status: z.enum(["Coming Soon", "On going", "Ended"]),
      oprec_link: z.string().url(),
      location: z.string(),
      participant_limit: z.number().int(),
      participant_count: z.number().int(),
      is_highlighted: z.boolean(),
      is_organogram: z.boolean()
  })
)
.mutation(async ({ctx, input}) => {
  console.log("Event Update called.")
  try {
    const updatedEvent = await ctx.db.update(events)
      .set({
        ...input,
        start_date: new Date(input.start_date),
        end_date: new Date(input.end_date),
      })
      .where(eq(events.id, input.id))
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