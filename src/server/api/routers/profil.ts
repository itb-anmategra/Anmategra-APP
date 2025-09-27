import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import { GetAllProfilKMOutputSchema } from '../types/profil.type';
import { profilKegiatanRouter } from './profil/kegiatan';
import { profileLembagaRouter } from './profil/lembaga';

export const profilRouter = createTRPCRouter({
  ...profilKegiatanRouter._def.procedures,
  ...profileLembagaRouter._def.procedures,

  getAllProfilKM: publicProcedure
    .output(GetAllProfilKMOutputSchema)
    .query(async ({ ctx }) => {
      const profilKMList = await ctx.db.query.profilKM.findMany({
        columns: {
          id: true,
          description: true,
        },
        orderBy: (profilKM, { asc }) => [asc(profilKM.description)],
      });

      return {
        profil_km: profilKMList,
      };
    }),
});
