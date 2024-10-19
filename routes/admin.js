import express from 'express';

import {
  addDoctor,
  confirmOrCancelAppointment,
  getAppointmentById,
  getAppointments,
  getDoctor,
} from '../controllers/admin.js';

const router = express.Router();

router.post('/add-doctor', addDoctor);

router.get('/doctors/:id', getDoctor);

router.get('/appointments', getAppointments);

router.get('/appointments/:appointmentId', getAppointmentById);

router.put('/appointments/:appointmentId', confirmOrCancelAppointment);

export { router };
