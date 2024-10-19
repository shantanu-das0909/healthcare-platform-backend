import { Appointment } from '../models/appointment.js';
import { Doctor } from '../models/doctor.js';
import { User } from '../models/user.js';
import {
  removeAppointmentFromDoctor,
  removeAppointmentFromUser,
} from '../utils/helper.js';

export const requestNewAppointment = async (req, res, next) => {
  const { appointmentDate, appointmentReason, comments, doctorId } = req.body;
  const userId = req.userId;

  try {
    let doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(400).json({ message: 'Doctor not found' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const newAppointment = new Appointment({
      appointmentDate: appointmentDate,
      appointmentReason: appointmentReason,
      comments: comments,
      status: 'PENDING',
      doctor: doctor,
      user: user,
    });

    const savedAppointment = await newAppointment.save();

    user.appointments = [...user.appointments, savedAppointment];
    await user.save();

    const oldAppointments = doctor.appointments;
    if (!oldAppointments) {
      doctor.appointments = [savedAppointment];
    } else {
      doctor.appointments = [...oldAppointments, savedAppointment];
    }

    await doctor.save();

    res.status(201).json({ message: 'Appointment added successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'New appointment failed. Please try again',
      error: error.message,
    });
  }
};

export const getAppointments = async (req, res, next) => {
  const userId = req.userId;

  try {
    const appointments = await Appointment.find({ user: userId });
    res.status(200).json({ appointments: appointments });
  } catch (error) {
    res
      .status(500)
      .json({ messsgae: 'Appointment fetch failed', error: error.message });
  }
};

export const cancelAppointment = async (req, res, next) => {
  const appointmentId = req.params.appointmentId;

  try {
    const appointment = await Appointment.findById(appointmentId);

    const doctorId = appointment.doctor._id;
    const userId = appointment.user._id;

    appointment.status = 'CANCEL';
    await appointment.save();

    await removeAppointmentFromUser(userId, appointmentId);
    await removeAppointmentFromDoctor(doctorId, appointmentId);

    res.status(200).json({ messgae: 'Appointment cancelled sucessfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Appointment cancelation failed',
      error: error.message,
    });
  }
};
