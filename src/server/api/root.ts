import {createCallerFactory, createTRPCRouter} from "~/server/api/trpc";
import {landingRouter} from "./routers/landing";
import { lembagaRouter } from "./routers/lembaga";
import {eventRouter} from "./routers/event";
import {kegiatanRouter} from "./routers/kegiatan";
import {userRouter} from "./routers/user";
import {profileRouter} from "~/server/api/routers/profil";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // admin: adminRouter,
  landing: landingRouter,
  lembaga: lembagaRouter,
  event: eventRouter,
  kegiatan: kegiatanRouter,
  profil: profileRouter,
  users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
