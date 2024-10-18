import express from 'express';

import {
  addDoctor,
  getAppointmentById,
  getAppointments,
  getDoctor,
} from '../controllers/admin.js';

const router = express.Router();

router.post('/add-doctor', addDoctor);

router.get('/doctors/:id', getDoctor);

router.get('/appointments', getAppointments);

router.get('/appointments/:appointmentId', getAppointmentById);

export { router };
