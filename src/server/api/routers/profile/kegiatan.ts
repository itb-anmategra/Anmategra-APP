import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import {
  createTRPCRouter,
  lembagaProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import {
  CreateProfilKegiatanInputSchema,
  CreateProfilKegiatanOutputSchema,
  DeleteProfilInputSchema,
  DeleteProfilOutputSchema,
  EditProfilInputSchema,
  EditProfilOutputSchema,
  GetAllProfilKegiatanInputSchema,
  GetAllProfilOutputSchema,
  GetKegiatanInputSchema,
  GetKegiatanOutputSchema,
} from '~/server/api/types/profile.type';
import {
  events,
  keanggotaan,
  lembaga,
  mahasiswa,
  pemetaanProfilKegiatan,
  profilKegiatan,
  users,
} from '~/server/db/schema';

import {
  validateKegiatanOwnership,
  validateKegiatanProfileOwnership,
} from '../profile/services';

export const profilKegiatanRouter = createTRPCRouter({
  getKegiatan: publicProcedure
    .input(GetKegiatanInputSchema)
    .output(GetKegiatanOutputSchema)
    .query(async ({ ctx, input }) => {
      const kegiatan = await ctx.db.query.events.findFirst({
        where: (events, { eq }) => eq(events.id, input.kegiatanId),
      });

      if (!kegiatan) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Kegiatan not found',
        });
      }

      if (kegiatan.org_id === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Kegiatan not found',
        });
      }

      const lembagaRes = await ctx.db
        .select({
          id: lembaga.id,
          name: lembaga.name,
          description: lembaga.description,
          image: users.image,
          memberCount: lembaga.memberCount,
          foundingDate: lembaga.foundingDate,
          endingDate: lembaga.endingDate,
          type: lembaga.type,
        })
        .from(lembaga)
        .innerJoin(users, eq(lembaga.userId, users.id))
        .where(eq(lembaga.id, kegiatan.org_id))
        .limit(1);

      if (lembagaRes.length === 0 || !lembagaRes[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Lembaga not found',
        });
      }

      const participants = await ctx.db
        .select({
          userId: mahasiswa.userId,
          nama: users.name,
          nim: mahasiswa.nim,
          jurusan: mahasiswa.jurusan,
          image: users.image,
          position: keanggotaan.position,
          divisi: keanggotaan.division,
        })
        .from(keanggotaan)
        .innerJoin(mahasiswa, eq(keanggotaan.user_id, mahasiswa.userId))
        .innerJoin(users, eq(mahasiswa.userId, users.id))
        .where(eq(keanggotaan.event_id, input.kegiatanId));

      const formattedParticipants = participants.map((participant) => ({
        id: participant.userId,
        nama: participant.nama ?? 'john doe',
        nim: participant.nim.toString(),
        jurusan: participant.jurusan,
        image: participant.image,
        posisi: participant.position,
        divisi: participant.divisi,
        posisiColor: 'blue',
      }));

      return {
        kegiatan: kegiatan,
        lembaga: lembagaRes[0],
        participant: formattedParticipants,
      };
    }),

  getAllProfilKegiatan: lembagaProcedure
    .input(GetAllProfilKegiatanInputSchema)
    .output(GetAllProfilOutputSchema)
    .query(async ({ ctx, input }) => {
      const profil = await ctx.db.query.profilKegiatan.findMany({
        where: eq(profilKegiatan.eventId, input.event_id),
        with: {
          pemetaanProfilKegiatan: {
            columns: {
              profilKMId: true,
            },
          },
        },
      });

      return {
        profil_kegiatan: profil.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          profil_km_id: item.pemetaanProfilKegiatan.map(
            (subItem) => subItem.profilKMId,
          ),
        })),
      };
    }),

  createProfilKegiatan: lembagaProcedure
    .input(CreateProfilKegiatanInputSchema)
    .output(CreateProfilKegiatanOutputSchema)
    .mutation(async ({ ctx, input }) => {
      await validateKegiatanOwnership(ctx, input.event_id);

      const eventExists = await ctx.db.query.events.findFirst({
        where: eq(events.id, input.event_id),
      });

      if (!eventExists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found',
        });
      }

      // Validate profil KM IDs exist
      if (input.profil_km_id && input.profil_km_id.length > 0) {
        const existingProfilKM = await ctx.db.query.profilKM.findMany({
          where: (profilKM, { inArray }) =>
            inArray(profilKM.id, input.profil_km_id),
        });

        const existingIds = existingProfilKM.map((p) => p.id);
        const invalidIds = input.profil_km_id.filter(
          (id) => !existingIds.includes(id),
        );

        if (invalidIds.length > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Invalid profil KM IDs: ${invalidIds.join(', ')}`,
          });
        }
      }

      const result = await ctx.db.transaction(async (tx) => {
        // Create the profil kegiatan
        const newProfil = await tx
          .insert(profilKegiatan)
          .values({
            eventId: input.event_id,
            name: input.name,
            description: input.description,
          })
          .returning();

        const profilId = newProfil[0]!.id;

        // Create the mappings to profil KM
        if (input.profil_km_id && input.profil_km_id.length > 0) {
          const mappings = input.profil_km_id.map((kmId) => ({
            profilKegiatanId: profilId,
            profilKMId: kmId,
          }));

          await tx.insert(pemetaanProfilKegiatan).values(mappings);
        }

        return {
          profil_id: profilId,
          event_id: newProfil[0]!.eventId,
          name: newProfil[0]!.name,
          description: newProfil[0]!.description,
          profil_km_id: input.profil_km_id || [],
        };
      });

      return result;
    }),

  deleteProfilKegiatan: lembagaProcedure
    .input(DeleteProfilInputSchema)
    .output(DeleteProfilOutputSchema)
    .mutation(async ({ ctx, input }) => {
      await validateKegiatanProfileOwnership(ctx, input.profil_id);

      const profilExists = await ctx.db.query.profilKegiatan.findFirst({
        where: eq(profilKegiatan.id, input.profil_id),
      });

      if (!profilExists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Profil Kegiatan not found',
        });
      }

      await ctx.db
        .delete(profilKegiatan)
        .where(eq(profilKegiatan.id, input.profil_id));

      return { success: true };
    }),

  editProfilKegiatan: lembagaProcedure
    .input(EditProfilInputSchema)
    .output(EditProfilOutputSchema)
    .mutation(async ({ ctx, input }) => {
      await validateKegiatanProfileOwnership(ctx, input.profil_id);

      // Validate profil KM IDs exist
      if (input.profil_km_id && input.profil_km_id.length > 0) {
        const existingProfilKM = await ctx.db.query.profilKM.findMany({
          where: (profilKM, { inArray }) =>
            inArray(profilKM.id, input.profil_km_id),
        });

        const existingIds = existingProfilKM.map((p) => p.id);
        const invalidIds = input.profil_km_id.filter(
          (id) => !existingIds.includes(id),
        );

        if (invalidIds.length > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Invalid profil KM IDs: ${invalidIds.join(', ')}`,
          });
        }
      }

      // Validate profil kegiatan exists
      const profilExists = await ctx.db.query.profilKegiatan.findFirst({
        where: eq(profilKegiatan.id, input.profil_id),
      });

      if (!profilExists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Profil Kegiatan not found',
        });
      }

      const result = await ctx.db.transaction(async (tx) => {
        await tx
          .update(profilKegiatan)
          .set({
            name: input.name,
            description: input.description,
          })
          .where(eq(profilKegiatan.id, input.profil_id));

        // Update the mappings
        if (input.profil_km_id && input.profil_km_id.length > 0) {
          const mappings = input.profil_km_id.map((kmId) => ({
            profilKegiatanId: input.profil_id,
            profilKMId: kmId,
          }));

          await tx.insert(pemetaanProfilKegiatan).values(mappings);
        }
        return true;
      });

      if (result) {
        return { success: true };
      } else {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profil kegiatan',
        });
      }
    }),
});
