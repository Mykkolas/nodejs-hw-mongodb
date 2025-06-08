import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import getEnvVar from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';


export const setupServer = () => {
    const app = express();
    const PORT = Number(getEnvVar('PORT', 3000));
    app.use(express.json());
    app.use(cors());

    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            }
        })
    );


    app.get("/contacts", async (req, res) => {

        const contacts = await getAllContacts();

        if (contacts.length === 0) {
            res.status(404).json({
                status: 404,
                message: "No contacts found",
            });
            return;
        }

        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts,
        });
    });

    app.get("/contacts/:contactId", async (req, res) => {
        const { contactId } = req.params;
        const foundContact = await getContactById(contactId);
        if (!foundContact) {
            res.status(404).json({
                status: 404,
                message: "Contact not found",
            });
            return;
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: foundContact,
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            message: "Not found",
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
};