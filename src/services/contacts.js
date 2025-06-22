import { SORT_ORDER } from "../constants/index.js";
import { ContactsCollection } from "../db/models/contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    filter = {}, // default
    userId
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage; // tells how many i will skip with request
    const contactsQuery = ContactsCollection.find();

    if (filter.contactType) {
        contactsQuery.where('contactType').equals(filter.contactType);
    }
    if (typeof filter.isFavourite === 'boolean') {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    }

    contactsQuery.where('userId').equals(userId);

    const [contactsCount, contacts] = await Promise.all([
        ContactsCollection.find().merge(contactsQuery).countDocuments(),
        contactsQuery
            .find({})
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .exec(),
    ]);

    const paginationData = calculatePaginationData(contactsCount, perPage, page);
    return {
        data: contacts,
        ...paginationData // spreading object, taking all the fields
    }
        ;
};

export const getContactById = async ({ _id, userId }) => {
    const contact = await ContactsCollection.findOne({ _id, userId });
    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};

export const updateContact = async ({ _id, userId }, payload, options = {}) => {
    const rawResult = await ContactsCollection.findOneAndUpdate(
        { _id, userId },
        payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options
        }
    );
    if (!rawResult || !rawResult.value) return null;

    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};

export const deleteContact = async ({ _id, userId }) => {
    const contact = await ContactsCollection.findOneAndDelete({
        _id,
        userId
    });
    console.log("Important!!!", contact);
    return contact;
};
