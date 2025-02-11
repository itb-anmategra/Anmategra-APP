import {
  createTRPCRouter,
} from "~/server/api/trpc";
import {getAllAnggota, getEvent} from "./getByID";
import { createEvent } from "./create";
import {addNewPanitia, removePanitia, updateEvent} from "./update";
import { deleteEvent } from "./delete";

export const eventRouter = createTRPCRouter({
    getByID: getEvent,
    create: createEvent,
    update: updateEvent,
    delete: deleteEvent,
    getAllAnggota: getAllAnggota,
    addNewPanitia: addNewPanitia,
    removePanitia: removePanitia,
});