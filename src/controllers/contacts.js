import createHttpError from "http-errors";
import { createContact, deleteContact, getAllContacts, getContactById, updateContact } from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";


export const getAllContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId: req.user._id
    });

    res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};

export const getContactByIdController = async (req, res) => {
    const { id } = req.params;

    const foundContact = await getContactById({
        _id: id,
        userId: req.user._id
    });
    if (!foundContact) {
        console.log("not found");

        throw createHttpError(404, `Contact not found`);
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data: foundContact,
    });
};

export const createContactController = async (req, res) => {
    const photo = req.file;
    let photoUrl;
    if (photo) {
        photoUrl = await saveFileToCloudinary(photo);
    }

    const contact = await createContact({
        ...req.body,
        photo: photoUrl,
        userId: req.user._id
    });

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact
    });
};

export const updateContactController = async (req, res) => {
    const { id } = req.params;
    const photo = req.file;
    let photoUrl;
    if (photo) {
        photoUrl = await saveFileToCloudinary(photo);
    }

    const result = await updateContact(
        { _id: id, userId: req.user._id },
        { ...req.body, photo: photoUrl },
        { upsert: true },
    );
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
    const { id } = req.params;
    const contact = await deleteContact({
        _id: id, userId: req.user._id
    });

    if (!contact) {
        throw createHttpError(404, "Contact not found");
    }
    res.status(204).send();
};