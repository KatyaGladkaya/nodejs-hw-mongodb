import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contacts from "./routers/contacts.js"
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';

console.log('ACCESS_SECRET:', process.env.ACCESS_SECRET);
console.log('REFRESH_SECRET:', process.env.REFRESH_SECRET);
console.log('ACCESS_SECRET:', process.env.ACCESS_SECRET);
console.log('REFRESH_SECRET:', process.env.REFRESH_SECRET);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '***' : 'undefined');
console.log('JWT_SECRET:', process.env.JWT_SECRET);



export function setupServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.json({ message: 'Server is working!' });
  });

  app.use('/auth', authRouter);
  app.use('/contacts', contacts);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

