import { Appointment } from '../models/appointment.js';
import { Doctor } from '../models/doctor.js';
import {
  addAppointmentToDoctor,
  removeAppointmentFromDoctor,
} from '../utils/helper.js';

export const addDoctor = async (req, res, next) => {
  const { name } = req.body;

  const newDoctor = new Doctor({
    name: name,
  });

  try {
    const doctor = await newDoctor.save();
    res
      .status(201)
      .json({ message: 'Doctor added successfully', doctor: doctor });
  } catch (error) {
    res.status(500).json({
      message: 'Doctor addition failed. Please try again',
      error: error.message,
    });
  }
};

export const getDoctor = async (req, res, next) => {
  const doctorId = req.params.id;
  try {
    const doctor = await Doctor.findById(doctorId).populate('appointments');
    if (!doctor) {
      return res.status(500).json({
        message: 'Doctor not found. Please try again',
        error: error.message,
      });
    }
    res.status(200).json({ message: 'Dcotor found', doctor: doctor });
  } catch (error) {
    res.status(500).json({
      message: 'Doctor not found. Please try again',
      error: error.message,
    });
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({
      message: 'All appointmentsn fetched successfully',
      appointments: appointments,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Appointments can not be fetched. Please try again',
      error: error.message,
    });
  }
};

export const getAppointmentById = async (req, res, next) => {
  const appointmentId = req.params.appointmentId;
  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(400).json({
        message: 'Appointment not found.',
        error: error.message,
      });
    }
    res.status(200).json({
      message: 'Appointment fetched successfully',
      appointment: appointment,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Appointment can not be fetched. Please try again',
      error: error.message,
    });
  }
};

export const confirmOrCancelAppointment = async (req, res, next) => {
  const { appointmentDate, status, doctorId, cancelReason } = req.body;
  const appointmentId = req.params.appointmentId;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(400).json({ message: 'Appointment not found' });
    }

    appointment.status = status;

    if (appointmentDate) {
      appointment.appointmentDate = appointmentDate;
    }

    // validate if cancellation reason is provide for CANCEL status
    if (status === 'CANCEL') {
      if (!cancelReason) {
        return res
          .status(400)
          .json({ message: 'Please enter a appointment cancellation reason' });
      }
      appointment.cancelReason = cancelReason;
    }

    // if doctor is changed then this appointment will be moved
    // to new doctors appointment bucket and
    // will be removed from current doctors appointment bucket
    if (doctorId && doctorId.toString() !== appointment.doctor._id.toString()) {
      await addAppointmentToDoctor(doctorId, appointmentId);

      await removeAppointmentFromDoctor(
        appointment.doctor._id,
        appointment._id
      );

      appointment.doctor = doctorId;
    }

    const updatedAppoitment = await appointment.save();

    res.status(200).json({
      message: 'Appointment status updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Appointment status updation failed',
      error: error.message,
    });
  }
};
