import express from 'express';
import { getEnvVar } from './utils/getEnvVar.js';
import cors from 'cors';
import pino from 'pino-http';
import {getAllContacts, getContactById} from './services/contacts.js';


const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(cors());

   app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
   );

    app.get('/contacts',async (req, res) => {
        const contacts = await getAllContacts();
        try {
            res.json({
              status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
          });
        } catch (error) {
        console.error('Error getting contacts:', error.message);

      }


    });

    app.get('/contacts/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    res.status(404).json({
      message: 'Contact not found'
    });
    return;
  }

        res.json({
      status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
});


    app.use((req, res, next) => {
        res.status(404).json({
            message: "Not found"
        });
    });

    app.use((err, req, res, next) => {
        res.status(500).json({
            message: 'Something went wrong',
            error: err.message
        });
    });

    app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
    });
};
