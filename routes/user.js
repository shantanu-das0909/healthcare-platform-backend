import express from 'express';
import { isAuth } from '../middlewares/is-auth.js';
import { requestNewAppointment } from '../controllers/user.js';

const router = express.Router();

router.post('/new-appointment', isAuth, requestNewAppointment);

export { router };
