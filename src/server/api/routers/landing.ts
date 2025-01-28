import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {Kepanitiaan} from "~/types/kepanitiaan";

export const landingRouter = createTRPCRouter({
  getRecentKepanitiaan: publicProcedure.query(async ({ ctx }) => {
    const kepanitiaan = await ctx.db.query.lembaga.findMany({
      where: (lembaga, { eq }) => eq(lembaga.type, "Kepanitiaan"),
      orderBy: (lembaga, { desc }) => desc(lembaga.foundingDate),
      limit: 8,
      columns: {
        name: true,
        description: true,
        memberCount: true,
        foundingDate: true,
        endingDate: true,
        image: true,
      },
    });

    const formattedKepanitiaan: Kepanitiaan[] = kepanitiaan.map((item) => ({
      lembaga: {
        name: item.name,
        profilePicture: item.image,
      },
      name: item.name,
      description: item.description,
      quota: item.memberCount ?? 0,
      startDate: new Date(item.foundingDate),
      endDate: item.endingDate ? new Date(item.endingDate) : null,
    }));

    return formattedKepanitiaan;
  }),

  getRecentEvents: publicProcedure.query(async ({ ctx }) => {
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
        end_date: true,
        participant_count: true,
      },
    });

    const formattedEvents: Kepanitiaan[] = events.map((item) => ({
      lembaga: {
        name: item.name,
        profilePicture: item.image,
      },
      name: item.name,
      description: item.description,
      quota: item.participant_count ?? 0,
      startDate: new Date(item.start_date),
      endDate: item.end_date ? new Date(item.end_date) : null,
    }));

    return formattedEvents;
  }),

  getTopEvents: publicProcedure.query(async ({ ctx }) => {
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
        end_date: true,
        participant_count: true,
      },
    });

    const formattedEvents: Kepanitiaan[] = events.map((item) => ({
      lembaga: {
        name: item.name,
        profilePicture: item.image,
      },
      name: item.name,
      description: item.description,
      quota: item.participant_count ?? 0,
      startDate: new Date(item.start_date),
      endDate: item.end_date ? new Date(item.end_date) : null,
    }));

    return formattedEvents;
  }),
});
