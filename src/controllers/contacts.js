import createHttpError from "http-errors";
import { createContact, deleteContact, getAllContacts, getContactById, updateContact } from "../services/contacts.js";


export const getAllContactsController = async (req, res) => {

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
};

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;

    const foundContact = await getContactById(contactId);
    if (!foundContact) {
        console.log("not found");

        throw createHttpError(404, `Contact not found`);
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: foundContact,
    });
};

export const createContactController = async (req, res) => {
    const contact = await createContact(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact
    });
};

export const updateContactController = async (req, res) => {
    const { contactId } = req.params;

    const result = await updateContact(contactId, req.body, {
        upsert: true
    });
    if (!result) {
        throw createHttpError(404, 'Contact not found');
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: `Successfully patched a contact!`,
        data: result.contact,
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);

    if (!contact) {
        throw createHttpError(404, "Contact not found");
    }
    res.status(204).send();
};