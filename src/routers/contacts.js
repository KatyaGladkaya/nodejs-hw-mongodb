import express from 'express';
import {
    createContact,
    updateContactById,
    deleteContactById,
  getAllContacts,
  getContactById,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactSchemas.js';


const router = express.Router();
router.use(authenticate);

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));
router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContact)
);
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactById)
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactById));

export default router;
