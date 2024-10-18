import { Appointment } from '../models/appointment.js';
import { Doctor } from '../models/doctor.js';
import { User } from '../models/user.js';

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
      doctor: doctor,
      user: user,
    });

    const savedAppointment = await newAppointment.save();

    user.appointment = savedAppointment;
    await user.save();

    const oldAppointments = doctor.appointments;
    if (!oldAppointments) {
      doctor.appointments = [savedAppointment];
    } else {
      doctor.appointments = [...oldAppointments, savedAppointment];
    }

    await doctor.save();

    res.status(201).json({
      message: `Appointment requested by ${user._id} to ${doctor._id} doctor`,
    });
  } catch (error) {
    res.status(500).json({
      message: 'New appointment failed. Please try again',
      error: error,
    });
  }
};
