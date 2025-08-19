import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import { contactQuerySchema } from '../validation/contacts.js';

const router = Router();

router.get('/contacts', validateQuery(contactQuerySchema), ctrlWrapper(getAllContactsController));
router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post('/contacts', validateBody(createContactSchema), ctrlWrapper(createContactController));
router.patch('/contacts/:contactId', isValidId, validateBody(updateContactSchema),ctrlWrapper(updateContactController));
router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
