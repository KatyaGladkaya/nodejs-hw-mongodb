import { Contact } from '../models/contactModel.js';

export const getContacts = async ({ page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc' }) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const totalItems = await Contact.countDocuments();
  const totalPages = Math.ceil(totalItems / perPage);
  const contacts = await Contact.find()
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages
  };
};

export async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

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
