import { Contact } from '../models/contactModel.js';

export const getContacts = async ({userId, page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc' }) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const filter = { userId };

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);
  const contacts = await Contact.find(filter)
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

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};


export const createContact = async (contactData) => {
  return Contact.create(contactData);
};

export const updateContactById = async (contactId, userId, updateData) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteContactById = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
