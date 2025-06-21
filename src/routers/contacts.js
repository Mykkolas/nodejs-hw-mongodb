import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createContactController, deleteContactController, getAllContactsController, getContactByIdController, updateContactController } from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";



const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId',
    isValidId,
    ctrlWrapper(getContactByIdController));

router.post('/',
    validateBody(createContactSchema), /* EXPRESS passes req.body automaticallys */
    ctrlWrapper(createContactController));

router.patch('/:contactId',
    isValidId,
    validateBody(updateContactSchema),
    ctrlWrapper(updateContactController));

router.delete('/:contactId',
    isValidId,
    ctrlWrapper(deleteContactController));

export default router;