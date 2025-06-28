import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createContactController, deleteContactController, getAllContactsController, getContactByIdController, updateContactController } from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";



const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:id',
    isValidId,
    ctrlWrapper(getContactByIdController));

router.post('/',
    upload.single('photo'),
    validateBody(createContactSchema), /* EXPRESS passes req.body automatically */
    ctrlWrapper(createContactController));

router.patch('/:id',
    isValidId,
    upload.single('photo'),
    validateBody(updateContactSchema),
    ctrlWrapper(updateContactController));

router.delete('/:id',
    isValidId,
    ctrlWrapper(deleteContactController));

export default router;