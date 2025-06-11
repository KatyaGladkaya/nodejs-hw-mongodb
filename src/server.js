import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { getAllContacts, getContactById } from './controllers/contactsController.js';

dotenv.config();

export function setupServer() {
    const app = express();
    const PORT = process.env.PORT || 3000;
  app.use(cors());
  app.use(pino());
  app.get('/', (req, res) => {
    res.json({ message: 'Server is working!' });
  });

  app.get('/contacts', getAllContacts);

  app.get('/contacts/:contactId', getContactById);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
