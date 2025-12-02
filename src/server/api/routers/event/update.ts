import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { events, keanggotaan } from '~/server/db/schema';

import { lembagaProcedure } from '../../trpc';
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

export const updateEvent = lembagaProcedure
  .input(UpdateEventInputSchema)
  .output(UpdateEventOutputSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const eventToUpdate = await ctx.db.query.events.findFirst({
        where: and(
          eq(events.id, input.id),
          eq(events.org_id, ctx.session.user.lembagaId!),
        ),
        columns: {
          id: true,
        },
      });

      if (!eventToUpdate) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Kegiatan tidak ditemukan atau Anda tidak memiliki izin untuk mengubahnya.',
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
          message: 'Gagal memperbarui kegiatan.',
        });
      }

      return updatedEvent[0];
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Terjadi kesalahan tak terduga saat memperbarui kegiatan.',
      });
    }
  });

export const addNewPanitia = lembagaProcedure
  .input(AddNewPanitiaKegiatanInputSchema)
  .output(AddNewPanitiaKegiatanOutputSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const eventToUpdate = await ctx.db.query.events.findFirst({
        where: and(
          eq(events.id, input.event_id),
          eq(events.org_id, ctx.session.user.lembagaId!),
        ),
        columns: {
          id: true,
          participant_count: true,
        },
      });

      if (!eventToUpdate) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Kegiatan tidak ditemukan atau Anda tidak memiliki izin untuk mengubahnya.',
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
        message: 'Panitia berhasil ditambahkan.',
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Terjadi kesalahan tak terduga saat menambahkan panitia.',
      });
    }
  });

export const removePanitia = lembagaProcedure
  .input(RemovePanitiaKegiatanInputSchema)
  .output(RemovePanitiaKegiatanOutputSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const eventToUpdate = await ctx.db.query.events.findFirst({
        where: and(
          eq(events.id, input.event_id),
          eq(events.org_id, ctx.session.user.lembagaId!),
        ),
        columns: {
          id: true,
          participant_count: true,
        },
      });

      if (!eventToUpdate) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Kegiatan tidak ditemukan atau Anda tidak memiliki izin untuk mengubahnya.',
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
        message: 'Panitia berhasil dihapus.',
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Terjadi kesalahan tak terduga saat menghapus panitia.',
      });
    }
  });

export const editPanitia = lembagaProcedure
  .input(EditPanitiaKegiatanInputSchema)
  .output(EditPanitiaKegiatanOutputSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const eventToUpdate = await ctx.db.query.events.findFirst({
        where: and(
          eq(events.id, input.event_id),
          eq(events.org_id, ctx.session.user.lembagaId!),
        ),
        columns: {
          id: true,
          participant_count: true,
        },
      });

      if (!eventToUpdate) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Kegiatan tidak ditemukan atau Anda tidak memiliki izin untuk mengubahnya.',
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
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Terjadi kesalahan tak terduga saat mengubah panitia.',
      });
    }
  });
