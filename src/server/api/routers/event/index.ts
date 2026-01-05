import { createTRPCRouter } from '~/server/api/trpc';

import { createEvent } from './create';
import { deleteEvent } from './delete';
import { getAllAnggota, getEvent } from './getByID';
import {
  addNewPanitia,
  addNewPanitiaManual,
  editPanitia,
  removePanitia,
  updateEvent,
} from './update';

export const eventRouter = createTRPCRouter({
  getByID: getEvent,
  create: createEvent,
  update: updateEvent,
  delete: deleteEvent,
  getAllAnggota: getAllAnggota,
  addNewPanitia: addNewPanitia,
  addNewPanitiaManual: addNewPanitiaManual,
  removePanitia: removePanitia,
  editPanitia: editPanitia,
});
