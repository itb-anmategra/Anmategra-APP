import { adminProcedure } from "../../trpc";
import { z } from "zod";
import { events } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

function generateShortId(length = 10) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("").slice(0, length);
  }

export const createEvent = adminProcedure
      .input(
        z.object({
          name: z.string(),
          org_id: z.string().optional(),
          description: z.string(),
          image: z.string(),
          start_date: z.string().datetime(),
          end_date: z.string().datetime().optional(),
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
        console.log("Event Creation called.")

        try {
          const newEvent = await ctx.db.insert(events).values({
            id: generateShortId(),
            ...input,
            start_date: new Date(input.start_date),
            end_date: input.end_date ? new Date(input.end_date) : null
          }).returning();
        
          return newEvent[0];
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