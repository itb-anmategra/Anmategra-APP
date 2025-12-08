import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { events, keanggotaan, mahasiswa, users } from '~/server/db/schema';

import { lembagaProcedure } from '../../trpc';
import {
  AddNewPanitiaKegiatanInputSchema,
  AddNewPanitiaKegiatanManualInputSchema,
  AddNewPanitiaKegiatanOutputSchema,
  EditPanitiaKegiatanInputSchema,
  EditPanitiaKegiatanOutputSchema,
  RemovePanitiaKegiatanInputSchema,
  RemovePanitiaKegiatanOutputSchema,
  UpdateEventInputSchema,
  UpdateEventOutputSchema,
} from '../../types/event.type';
import daftarProdi from '../../../db/kode-program-studi.json';
import { Prodi } from '~/server/auth';

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

export const addNewPanitiaManual = lembagaProcedure
  .input(AddNewPanitiaKegiatanManualInputSchema)
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

      // Check if user already exists by email (primary identifier)
      const email = `${input.nim}@mahasiswa.itb.ac.id`;
      const existingUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser) {
        // Name doesn't match
        if (existingUser.name !== input.name) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Sudah ada mahasiswa dengan NIM ${input.nim} bernama ${existingUser.name}`,
          });
        }
        // User exists, just add them to keanggotaan
        await ctx.db.transaction(async (tx) => {
          await tx.insert(keanggotaan).values({
            id: input.event_id + '_' + existingUser.id,
            event_id: input.event_id,
            user_id: existingUser.id,
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
      }

      const kodeProdi = parseInt(input.nim.substring(0, 3));
      const jurusan =
        daftarProdi.find((item: Prodi) => item.kode === kodeProdi)
          ?.jurusan ?? 'TPB';

      // asumsi cuma ada angkatan 2000-an
      const angkatan = parseInt(input.nim.substring(3, 5)) + 2000;

      await ctx.db.transaction(async (tx) => {
        const user = await tx
          .insert(users)
          .values({
            name: input.name,
            email: email,
            role: 'mahasiswa',
            emailVerified: null, // Not verified yet
          })
          .returning({ id: users.id });

        await tx.insert(mahasiswa).values({
          userId: user[0]!.id,
          nim: Number(input.nim),
          jurusan: jurusan,
          angkatan: angkatan,
        });

        await tx.insert(keanggotaan).values({
          id: input.event_id + '_' + user[0]!.id,
          event_id: input.event_id,
          user_id: user[0]!.id,
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