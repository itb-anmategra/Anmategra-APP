import { createTRPCRouter } from '~/server/api/trpc';

import { profilKegiatanRouter } from './profile/kegiatan';
import { profileLembagaRouter } from './profile/lembaga';

export const profilRouter = createTRPCRouter({
  ...profilKegiatanRouter._def.procedures,
  ...profileLembagaRouter._def.procedures,
});
