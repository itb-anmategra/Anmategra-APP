import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { events, keanggotaan } from '~/server/db/schema';

import { protectedProcedure } from '../../trpc';
import {
  AddNewPanitiaKegiatanInputSchema,
  AddNewPanitiaKegiatanOutputSchema,
  EditPanitiaKegiatanInputSchema,
  EditPanitiaKegiatanOutputSchema,
  RemovePanitiaKegiatanInputSchema,
  RemovePanitiaKegiatanOutputSchema,
  UpdateEventInputSchema,
  UpdateEventOutputSchema,
} from '../../types/event.type';

export const updateEvent = protectedProcedure
  .input(UpdateEventInputSchema)
  .output(UpdateEventOutputSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const eventToUpdate = await ctx.db.query.events.findFirst({
        where: and(
          eq(events.id, input.id),
          eq(events.org_id, ctx.session.user.lembagaId),
        ),
        columns: {
          id: true,
        },
      });

      if (!eventToUpdate) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found.',
        });
      }

      const updatedEvent = await ctx.db
        .update(events)
        .set({
          org_id: ctx.session.user.lembagaId,
          ...input,
          start_date: input.start_date ? new Date(input.start_date) : undefined,
          end_date: input.end_date ? new Date(input.end_date) : undefined,
        })
        .where(eq(events.id, eventToUpdate.id))
        .returning();

      if (!updatedEvent[0]) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update event.',
        });
      }

      return updatedEvent[0];
    } catch (error) {
      console.error('Database Error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred during event update.',
      });
    }
  });

export const addNewPanitia = protectedProcedure
  .input(AddNewPanitiaKegiatanInputSchema)
  .output(AddNewPanitiaKegiatanOutputSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const eventToUpdate = await ctx.db.query.events.findFirst({
        where: and(
          eq(events.id, input.event_id),
          eq(events.org_id, ctx.session.user.lembagaId),
        ),
        columns: {
          id: true,
          participant_count: true,
        },
      });

      if (!eventToUpdate) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }

      await ctx.db.transaction(async (tx) => {
        await tx.insert(keanggotaan).values({
          id: input.event_id + '_' + input.user_id,
          event_id: input.event_id,
          user_id: input.user_id,
          position: input.position,
          division: input.division,
        });

        await tx
          .update(events)
          .set({
            participant_count: eventToUpdate.participant_count + 1,
          })
          .where(eq(events.id, eventToUpdate.id));
      });

      return {
        success: true,
        message: 'Panitia added successfully.',
      };
    } catch (error) {
      console.error('Database Error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred during event creation.',
      });
    }
  });

export const removePanitia = protectedProcedure
  .input(RemovePanitiaKegiatanInputSchema)
  .output(RemovePanitiaKegiatanOutputSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const eventToUpdate = await ctx.db.query.events.findFirst({
        where: and(
          eq(events.id, input.event_id),
          eq(events.org_id, ctx.session.user.lembagaId),
        ),
        columns: {
          id: true,
          participant_count: true,
        },
      });

      if (!eventToUpdate) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }

      await ctx.db.transaction(async (tx) => {
        await tx.delete(keanggotaan).where(eq(keanggotaan.id, input.id));

        await tx
          .update(events)
          .set({
            participant_count: eventToUpdate.participant_count - 1,
          })
          .where(eq(events.id, eventToUpdate.id));
      });

      return {
        success: true,
        message: 'Panitia removed successfully.',
      };
    } catch (error) {
      console.error('Database Error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred during event creation.',
      });
    }
  });

export const editPanitia = protectedProcedure
  .input(EditPanitiaKegiatanInputSchema)
  .output(EditPanitiaKegiatanOutputSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      if (!ctx.session.user.lembagaId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const eventToUpdate = await ctx.db.query.events.findFirst({
        where: and(
          eq(events.id, input.event_id),
          eq(events.org_id, ctx.session.user.lembagaId),
        ),
        columns: {
          id: true,
          participant_count: true,
        },
      });

      if (!eventToUpdate) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }

      await ctx.db
        .update(keanggotaan)
        .set({
          position: input.position,
          division: input.division,
        })
        .where(eq(keanggotaan.id, input.event_id + '_' + input.user_id));

      return {
        success: true,
      };
    } catch (error) {
      console.error('Database Error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred during event creation.',
      });
    }
  });
