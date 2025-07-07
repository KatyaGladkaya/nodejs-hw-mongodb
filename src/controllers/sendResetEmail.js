import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/userModel.js';
import { sendResetEmail } from '../services/emailService.js';

const JWT_SECRET = process.env.JWT_SECRET;
const APP_DOMAIN = process.env.APP_DOMAIN;

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
      if (!user) throw createHttpError(404, 'User not found!');
      
      console.log('JWT_SECRET in sendResetEmailController:', JWT_SECRET);

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });

    const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

    await sendResetEmail(email, resetLink);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    if (err.message.includes('send the email')) {
      next(createHttpError(500, err.message));
    } else {
      next(err);
    }
  }
};
