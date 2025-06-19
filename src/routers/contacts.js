import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createContactController, deleteContactController, getAllContactsController, getContactByIdController, updateContactController } from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";



const router = Router();


router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get('/contacts/:contactId',
    isValidId,
    ctrlWrapper(getContactByIdController));

router.post('/contacts',
    validateBody(createContactSchema), /* EXPRESS passes req.body automaticallys */
    ctrlWrapper(createContactController));
router.patch('/contacts/:contactId',
    isValidId,
    validateBody(updateContactSchema),
    ctrlWrapper(updateContactController));
router.delete('/contacts/:contactId',
    isValidId,
    ctrlWrapper(deleteContactController));
export default router;