import { contactTypes } from '../constants/contacts.js';

const parseType = (contactType) => {
    if (typeof contactType !== 'string') return;
    if (contactTypes.includes(contactType)) return contactType;
};

const parseBoolean = (value) => {
    if (typeof value !== 'string') return;
    if (value === '1' || value === 'true') {
        return true;
    } else if (value === '0' || value === 'false') {
        return false;
    } else {
        return;
    }
};

export const parseFilterParams = (query) => {
    const { isFavourite, contactType } = query;

    const parsedIsFavourite = parseBoolean(isFavourite);
    const parsedContactType = parseType(contactType);

    return {
        isFavourite: parsedIsFavourite,
        contactType: parsedContactType,
    };
};