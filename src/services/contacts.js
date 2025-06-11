import { Contact } from '../models/contactModel.js';

export const getContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export async function getContactById(contactId) {
    return await Contact.findById(contactId);
  }