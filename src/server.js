import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import contacts from "./routers/contacts.js"
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

dotenv.config();

export function setupServer() {
    const app = express();
    const PORT = process.env.PORT || 3000;
  app.use(cors());
  app.use(pino());
  app.get('/', (req, res) => {
    res.json({ message: 'Server is working!' });
  });

  app.use('/contacts', contacts);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
