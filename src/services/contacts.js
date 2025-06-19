import { Contact } from '../models/contactModel.js';

export const getContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export async function getContactById(contactId) {
    return await Contact.findById(contactId);
};

export const createContact = async (contactData) => {
  return Contact.create(contactData);
};

export const updateContactById = async (contactId, updateData) => {
  return Contact.findByIdAndUpdate(contactId, updateData, {
    new: true, 
    runValidators: true,
  });
};

export const deleteContactById = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};