import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/userModel.js';
import { Session } from '../models/sessionModel.js';

const ACCESS_SECRET = process.env.ACCESS_SECRET;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      payload = jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Access token expired');
      }
      throw createHttpError(401, 'Invalid token');
    }
    
    const session = await Session.findOne({ accessToken: token });
if (!session) {
  throw createHttpError(401, 'Invalid token');
    }
    
    const user = await User.findById(payload.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
