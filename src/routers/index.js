import { Router } from "express";
import contactsRouter from "./contacts.js";
import authRoter from "./auth.js";

const router = Router();

router.use('/contacts', contactsRouter);
router.use('/auth', authRoter);

export default router;
