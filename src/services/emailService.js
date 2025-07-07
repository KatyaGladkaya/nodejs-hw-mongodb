import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendResetEmail = async (to, link) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Reset your password',
      html: `<p>Click the link below to reset your password:</p>
             <a href="${link}">${link}</a>`,
    });
  } catch (error)
   {
    throw new Error('Failed to send the email, please try again later.');
  }
};
