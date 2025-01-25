import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const landingRouter = createTRPCRouter({
  getRecentKepanitiaan: protectedProcedure.query(async ({ ctx }) => {
    const kepanitiaan = await ctx.db.query.lembaga.findMany({
      where: (lembaga, { eq }) => eq(lembaga.type, "Kepanitiaan"),
      orderBy: (lembaga, { desc }) => desc(lembaga.foundingDate),
      limit: 8,
      columns: {
        id: true,
        name: true,
        foundingDate: true,
      },
    });
    return kepanitiaan;
  }),

  getRecentEvents: protectedProcedure.query(async ({ ctx }) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const events = await ctx.db.query.events.findMany({
      where: (events, { gte }) => gte(events.start_date, oneMonthAgo),
      orderBy: (events, { desc }) => desc(events.start_date),
      limit: 8,
      columns: {
        id: true,
        name: true,
        description: true,
        image: true,
        start_date: true,
      },
    });
    return events;
  }),

  getTopEvents: protectedProcedure.query(async ({ ctx }) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const events = await ctx.db.query.events.findMany({
      where: (events, { gte }) => gte(events.start_date, sixMonthsAgo),
      orderBy: (events, { desc }) => desc(events.participant_count),
      limit: 8,
      columns: {
        id: true,
        name: true,
        description: true,
        image: true,
        start_date: true,
      },
    });
    return events;
  }),
});
