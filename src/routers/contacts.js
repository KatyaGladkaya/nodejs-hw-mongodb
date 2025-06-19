import express from 'express';
import {
    createContact,
    updateContactById,
    deleteContactById,
  getAllContacts,
  getContactById,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', ctrlWrapper(getContactById));
router.post('/', ctrlWrapper(createContact));
router.patch('/:contactId', ctrlWrapper(updateContactById));
router.delete('/:contactId', ctrlWrapper(deleteContactById));

export default router;
