import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/userModel.js';
import { Session } from '../models/sessionModel.js';
import createHttpError from 'http-errors';

export const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  const { password: _, ...userData } = newUser.toObject();

  return userData;
};

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, 'Email or password is wrong');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError(401, 'Email or password is wrong');

  const payload = { userId: user._id };

  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); 
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 

  await Session.deleteMany({ userId: user._id });

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (oldRefreshToken) => {
  if (!oldRefreshToken) throw createHttpError(401, 'No refresh token provided');

  let payload;

  try {
    payload = jwt.verify(oldRefreshToken, REFRESH_SECRET);
  } catch {
    throw createHttpError(403, 'Invalid or expired refresh token');
  }

  const existingSession = await Session.findOne({ refreshToken: oldRefreshToken });

  if (!existingSession) throw createHttpError(403, 'Session not found');

  const user = await User.findById(existingSession.userId);
  if (!user) throw createHttpError(404, 'User not found');

  await Session.deleteOne({ _id: existingSession._id });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const newPayload = { userId: payload.userId };

  const accessToken = jwt.sign(newPayload, ACCESS_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign(newPayload, REFRESH_SECRET, { expiresIn: '30d' });
  

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken };
};

export const logout = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });
};
