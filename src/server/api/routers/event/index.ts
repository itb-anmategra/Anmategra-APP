import {
  createTRPCRouter,
} from "~/server/api/trpc";
import { getEvent } from "./getByID";
import { createEvent } from "./create";
import { updateEvent } from "./update";
import { deleteEvent } from "./delete";

export const eventRouter = createTRPCRouter({
    getByID: getEvent,
    create: createEvent,
    update: updateEvent,
    delete: deleteEvent,
});