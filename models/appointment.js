import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  appointmentDate: {
    type: 'string',
    required: true,
    //2024-10-18T13:21:00.960Z
  },
  appointmentReason: {
    type: 'string',
    required: true,
  },
  comments: {
    type: 'string',
  },
  status: {
    type: 'string',
    required: true,
  },
  cancelReason: {
    type: 'string',
  },
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    reuiqred: true,
  },
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);
