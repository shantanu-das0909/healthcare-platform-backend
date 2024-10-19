import { Doctor } from '../models/doctor.js';
import { User } from '../models/user.js';

export const removeAppointmentFromDoctor = async (doctorId, appointmentId) => {
  let updatedDoctor = null;
  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(400).json({ message: 'Doctor not found' });
    }

    let appointments = doctor.appointments;
    const indexOfCurrentAppointment = appointments.indexOf(appointmentId);
    if (indexOfCurrentAppointment > -1) {
      appointments.splice(indexOfCurrentAppointment, 1);
    }

    doctor.appointments = appointments;
    updatedDoctor = await doctor.save();
  } catch (error) {
    res
      .send(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
  return updatedDoctor;
};

export const addAppointmentToDoctor = async (doctorId, appointmentId) => {
  let updatedDoctor = null;
  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(400).json({ message: 'Doctor not found' });
    }

    // added to new docotrs appointment bucket
    const oldAppointments = doctor.appointments;
    if (!oldAppointments) {
      doctor.appointments = [appointmentId];
    } else {
      if (!oldAppointments.includes(appointmentId)) {
        doctor.appointments = [...oldAppointments, appointmentId];
      }
    }

    updatedDoctor = await doctor.save();
  } catch (error) {
    res
      .send(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
  return updatedDoctor;
};

export const removeAppointmentFromUser = async (userId, appointmentId) => {
  let updatedUser = null;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const appointments = user.appointments;
    const indexOfAppointment = appointments.indexOf(appointmentId);

    if (indexOfAppointment > -1) {
      appointments.splice(indexOfAppointment, 1);
    }

    user.appointments = appointments;

    updatedUser = await user.save();
  } catch (error) {
    res.status(500).json({
      message: 'Appointment removal from user failed',
      error: error.message,
    });
  }

  return updatedUser;
};
