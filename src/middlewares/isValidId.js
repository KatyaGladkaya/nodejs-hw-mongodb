import { Types } from 'mongoose';
import createError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!Types.ObjectId.isValid(contactId)) {
    return next(createError(400, `${contactId} is not a valid id`));
  }
  next();
};