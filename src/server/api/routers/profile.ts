import { TRPCError } from '@trpc/server';
import { and, desc, eq } from 'drizzle-orm';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { events, keanggotaan, mahasiswa, users } from '~/server/db/schema';
import { type Kepanitiaan } from '~/types/kepanitiaan';

import {
  GetMahasiswaInputSchema,
  GetMahasiswaOutputSchema,
} from '../types/profile.type';
import { profilKegiatanRouter } from './profile/kegiatan';
import { profileLembagaRouter } from './profile/lembaga';

const profileMahasiswaRouter = createTRPCRouter({
  getMahasiswa: publicProcedure
    .input(GetMahasiswaInputSchema)
    .output(GetMahasiswaOutputSchema)
    .query(async ({ ctx, input }) => {
      const [mahasiswaResult, newestEvent] = await Promise.all([
        ctx.db
          .select()
          .from(mahasiswa)
          .innerJoin(users, eq(mahasiswa.userId, users.id))
          .where(eq(users.id, input.mahasiswaId))
          .limit(1),
        ctx.db
          .select()
          .from(events)
          .innerJoin(keanggotaan, eq(events.id, keanggotaan.event_id))
          .where(eq(keanggotaan.user_id, input.mahasiswaId))
          .orderBy(desc(events.start_date)),
      ]);

      const formattedKepanitiaan: Kepanitiaan[] = newestEvent.map((item) => ({
        lembaga: {
          name: item.event.name,
          profilePicture: item.event.image,
        },
        id: item.event.id,
        name: item.event.name,
        description: item.event.description,
        quota: item.event.participant_count ?? 0,
        image: item.event.background_image,
        startDate: new Date(item.event.start_date),
        endDate: item.event.end_date ? new Date(item.event.end_date) : null,
        position: item.keanggotaan.position,
        division: item.keanggotaan.division,
      }));

      if (mahasiswaResult.length === 0 || !mahasiswaResult[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Mahasiswa not found',
        });
      }

      return {
        mahasiswaData: mahasiswaResult[0],
        newestEvent: formattedKepanitiaan,
      };
    }),
});

export const profileRouter = createTRPCRouter({
  ...profileMahasiswaRouter._def.procedures,
  ...profilKegiatanRouter._def.procedures,
  ...profileLembagaRouter._def.procedures,
});
