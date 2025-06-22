import Joi from 'joi';
import { contactTypes } from '../constants/contacts.js';
/* import { isValidObjectId } from 'mongoose'; */

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Name should be a string',
        'string.min': 'Name should have at least {#limit} characters',
        'string.max': 'Name should have at most {#limit} characters',
        'any.required': 'Name is required',
    }),
    phoneNumber: Joi.string().min(3).max(20).required(),
    email: Joi.string().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...contactTypes).required(),
    /*  userId: Joi.string().custom((value, helper) => {
         if (value && !isValidObjectId(value)) {
             return helper.message('userId should be a valid mongo id');
         }
         return true;
     }), */
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...contactTypes)
});