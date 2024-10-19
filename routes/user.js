import express from 'express';
import { isAuth } from '../middlewares/is-auth.js';
import {
  cancelAppointment,
  getAppointments,
  requestNewAppointment,
} from '../controllers/user.js';

const router = express.Router();

router.post('/new-appointment', isAuth, requestNewAppointment);

router.get('/appointments', isAuth, getAppointments);

router.delete('/appointment/:appointmentId', isAuth, cancelAppointment);

export { router };
