import { TRPCError } from '@trpc/server';
import { and, desc, eq } from 'drizzle-orm';
import {
  createTRPCRouter,
  lembagaProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import {
  CreateProfilLembagaInputSchema,
  CreateProfilLembagaOutputSchema,
  DeleteProfilInputSchema,
  DeleteProfilOutputSchema,
  EditProfilInputSchema,
  EditProfilOutputSchema,
  GetAllProfilLembagaInputSchema,
  GetAllProfilOutputSchema,
  GetLembagaInputSchema,
  GetLembagaOutputSchema,
} from '~/server/api/types/profile.type';
import {
  events,
  kehimpunan,
  lembaga,
  mahasiswa,
  pemetaanProfilLembaga,
  profilLembaga,
  users,
} from '~/server/db/schema';
import { type Kepanitiaan } from '~/types/kepanitiaan';

import {
  validateLembagaOwnership,
  validateLembagaProfileOwnership,
} from './services';

export const profileLembagaRouter = createTRPCRouter({
  getLembaga: publicProcedure
    .input(GetLembagaInputSchema)
    .output(GetLembagaOutputSchema)
    .query(async ({ ctx, input }) => {
      const lembaga = await ctx.db.query.lembaga.findFirst({
        where: (lembaga, { eq }) => eq(lembaga.id, input.lembagaId),
        with: {
          users: {
            columns: {
              id: true,
              image: true,
            },
          },
        },
        columns: {
          id: true,
          name: true,
          description: true,
          memberCount: true,
          foundingDate: true,
          endingDate: true,
          type: true,
        },
      });

      if (!lembaga) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Lembaga not found',
        });
      }

      const newestEvent = await ctx.db.query.events.findMany({
        where: (events, { eq }) => and(eq(events.org_id, input.lembagaId)),
        orderBy: desc(events.start_date),
      });

      const formattedEvents: Kepanitiaan[] = newestEvent.map((item) => ({
        lembaga: {
          id: item.id,
          name: item.name,
          profilePicture: item.image,
        },
        id: item.id,
        name: item.name,
        description: item.description,
        quota: item.participant_count ?? 0,
        image: item.background_image,
        startDate: new Date(item.start_date),
        endDate: item.end_date ? new Date(item.end_date) : null,
      }));

      const highlightedEvent = await ctx.db.query.events.findFirst({
        where: (events, { eq }) =>
          and(
            eq(events.org_id, input.lembagaId),
            eq(events.is_highlighted, true),
          ),
        orderBy: desc(events.start_date),
      });

      const anggota = await ctx.db
        .select({
          id: users.id,
          nama: users.name,
          nim: mahasiswa.nim,
          image: users.image,
          jurusan: mahasiswa.jurusan,
          divisi: kehimpunan.division,
          posisi: kehimpunan.position,
        })
        .from(kehimpunan)
        .innerJoin(users, eq(kehimpunan.userId, users.id))
        .innerJoin(mahasiswa, eq(users.id, mahasiswa.userId))
        .where(eq(kehimpunan.lembagaId, input.lembagaId));

      const formattedAnggota = anggota.map((anggota) => ({
        id: anggota.id,
        nama: anggota.nama ?? 'john doe',
        nim: anggota.nim.toString(),
        jurusan: anggota.jurusan,
        image: anggota.image,
        divisi: anggota.divisi,
        posisi: anggota.posisi,
        posisiColor: 'blue',
      }));

      return {
        lembagaData: lembaga,
        newestEvent: formattedEvents,
        highlightedEvent: highlightedEvent ? highlightedEvent : null,
        anggota: formattedAnggota,
      };
    }),

  getAllProfilLembaga: lembagaProcedure
    .input(GetAllProfilLembagaInputSchema)
    .output(GetAllProfilOutputSchema)
    .query(async ({ ctx, input }) => {
      const profil = await ctx.db.query.profilLembaga.findMany({
        where: eq(profilLembaga.lembagaId, input.lembaga_id),
        with: {
          pemetaanProfilLembaga: {
            columns: {
              profilKMId: true,
            },
          },
        },
      });

      return {
        profil_lembaga: profil.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          profil_km_id: item.pemetaanProfilLembaga.map(
            (subItem) => subItem.profilKMId,
          ),
        })),
      };
    }),

  createProfilLembaga: lembagaProcedure
    .input(CreateProfilLembagaInputSchema)
    .output(CreateProfilLembagaOutputSchema)
    .mutation(async ({ ctx, input }) => {
      await validateLembagaOwnership(ctx, input.lembaga_id);

      const lembagaExists = await ctx.db.query.lembaga.findFirst({
        where: eq(lembaga.id, input.lembaga_id),
      });

      if (!lembagaExists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Lembaga not found',
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
        const newProfil = await tx
          .insert(profilLembaga)
          .values({
            lembagaId: input.lembaga_id,
            name: input.name,
            description: input.description,
          })
          .returning();

        const profilId = newProfil[0]!.id;

        // Create the mappings to profil KM
        if (input.profil_km_id && input.profil_km_id.length > 0) {
          const mappings = input.profil_km_id.map((kmId) => ({
            profilLembagaId: profilId,
            profilKMId: kmId,
          }));

          await tx.insert(pemetaanProfilLembaga).values(mappings);
        }

        return {
          profil_id: profilId,
          lembaga_id: newProfil[0]!.lembagaId,
          name: newProfil[0]!.name,
          description: newProfil[0]!.description,
          profil_km_id: input.profil_km_id || [],
        };
      });

      return result;
    }),

  deleteProfilLembaga: lembagaProcedure
    .input(DeleteProfilInputSchema)
    .output(DeleteProfilOutputSchema)
    .mutation(async ({ ctx, input }) => {
      await validateLembagaProfileOwnership(ctx, input.profil_id);

      const profilExists = await ctx.db.query.profilLembaga.findFirst({
        where: eq(profilLembaga.id, input.profil_id),
      });

      if (!profilExists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Profil Lembaga not found',
        });
      }

      await ctx.db
        .delete(profilLembaga)
        .where(eq(profilLembaga.id, input.profil_id));

      return { success: true };
    }),

  editProfilLembaga: lembagaProcedure
    .input(EditProfilInputSchema)
    .output(EditProfilOutputSchema)
    .mutation(async ({ ctx, input }) => {
      await validateLembagaProfileOwnership(ctx, input.profil_id);

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

      // Validate profil lembaga exists
      const profilExists = await ctx.db.query.profilLembaga.findFirst({
        where: eq(profilLembaga.id, input.profil_id),
      });

      if (!profilExists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Profil Lembaga not found',
        });
      }

      const result = await ctx.db.transaction(async (tx) => {
        await tx
          .update(profilLembaga)
          .set({
            name: input.name,
            description: input.description,
          })
          .where(eq(profilLembaga.id, input.profil_id));

        // Update the mappings
        if (input.profil_km_id && input.profil_km_id.length > 0) {
          const mappings = input.profil_km_id.map((kmId) => ({
            profilLembagaId: input.profil_id,
            profilKMId: kmId,
          }));

          await tx.insert(pemetaanProfilLembaga).values(mappings);
        }
        return true;
      });

      if (result) {
        return { success: true };
      } else {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profil lembaga',
        });
      }
    }),
});
