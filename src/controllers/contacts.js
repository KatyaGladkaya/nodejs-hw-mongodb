import * as contactsService from '../services/contacts.js';
import createError from 'http-errors';

export const getAllContacts = async (req, res, next) => {
  try {
    const { page, perPage, sortBy, sortOrder } = req.query;
    const userId = req.user._id;

    const result = await contactsService.getContacts({
      userId,
      page: Number(page),
  perPage: Number(perPage),
      sortBy,
      sortOrder,
    });

    const { data, ...meta } = result;

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data,
      ...meta,
      
    });
  } catch (error) {
    next(error);
  }
};

export async function getContactById(req, res) {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await contactsService.getContactById(userId, contactId);
  
  
      if (!contact) {
        throw createError(404, 'Contact not found');
      }
  
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
};

  export const createContact = async (req, res) => {
    const { name, phoneNumber, email, isFavourite = false, contactType } = req.body;
    const userId = req.user._id;
  
    if (!name || !phoneNumber || !contactType) {
      throw createError(400, 'Missing required fields: name, phoneNumber, or contactType');
    }
  
    const newContact = await contactsService.createContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId,
    });
  
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
};
  
export const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const updateData = req.body;
  const userId = req.user._id;

  if (Object.keys(updateData).length === 0) {
    throw createError(400, 'Missing fields for update');
  }

  const updatedContact = await contactsService.updateContactById(userId, contactId, updateData);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deletedContact = await contactsService.deleteContactById(userId, contactId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
