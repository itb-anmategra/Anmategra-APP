import { createTRPCRouter } from '~/server/api/trpc';

import { profilKegiatanRouter } from './profil/kegiatan';
import { profileLembagaRouter } from './profil/lembaga';

export const profilRouter = createTRPCRouter({
  ...profilKegiatanRouter._def.procedures,
  ...profileLembagaRouter._def.procedures,
});
