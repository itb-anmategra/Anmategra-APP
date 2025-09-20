import { TRPCError } from '@trpc/server';
import type { inferAsyncReturnType } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { type createTRPCContext } from '~/server/api/trpc';
import { events } from '~/server/db/schema';

type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;

export async function validateLembagaOwnership(
  ctx: TRPCContext,
  lembagaId: string,
) {
  if (ctx.session?.user?.lembagaId !== lembagaId) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not authorized to perform this action',
    });
  }
}

export async function validateKegiatanOwnership(
  ctx: TRPCContext,
  kegiatanId: string,
) {
  // Login Validation
  const eventOwner = await ctx.db.query.events.findFirst({
    where: eq(events.id, kegiatanId),
    columns: { org_id: true },
  });

  if (ctx.session?.user?.lembagaId !== eventOwner?.org_id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not authorized to create profil for this kegiatan',
    });
  }
}
