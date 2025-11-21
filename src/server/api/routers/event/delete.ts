import { lembagaProcedure } from "../../trpc";
import { events, keanggotaan } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";
import { DeleteEventInputSchema, DeleteEventOutputSchema } from "../../types/event.type";

export const deleteEvent = lembagaProcedure
.input(DeleteEventInputSchema)
.output(DeleteEventOutputSchema)
.mutation(async ({ ctx, input }) => {
  try {

    const existingEvent = await ctx.db.query.events.findFirst({
      where: and(
        eq(events.id, input.id),
        eq(events.org_id, ctx.session.user.lembagaId!)
      )
    });

    if (!existingEvent) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: "Kegiatan tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya"
      });
    }

    const existingKeanggotaan = await ctx.db.query.keanggotaan.findFirst({
      where: eq(keanggotaan.event_id, input.id)
    });

    if (existingKeanggotaan) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: "Tidak dapat menghapus kegiatan yang memiliki panitia terdaftar."
      });
    }

    await ctx.db.delete(events).where(eq(events.id, input.id));

    return { 
      success: true, 
      id: input.id 
    };
    
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: "Terjadi kesalahan tak terduga saat menghapus kegiatan."
    });
  }
})