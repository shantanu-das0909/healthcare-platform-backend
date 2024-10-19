import mongoose from 'mongoose';
import Joi from 'joi';
import { Doctor } from './doctor.js';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: 'String',
      require: true,
    },
    email: {
      type: 'String',
      require: true,
    },
    password: {
      type: 'String',
      required: true,
    },
    phone: {
      type: 'String',
      required: true,
    },
    dob: {
      type: 'String',
      required: true,
    },
    gender: {
      type: 'String',
      require: true,
    },
    address: {
      type: 'String',
    },
    occupation: {
      type: 'String',
    },
    emergencyContactNumber: {
      type: 'String',
    },
    appointments: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Appointment',
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(8).max(16).required(),
    phone: Joi.string().min(8).max(10).required(),
    dob: Joi.string().required(),
    gender: Joi.string().required(),
    address: Joi.string(),
    occupation: Joi.string(),
    emergencyContactNumber: Joi.string(),
  });

  return schema.validate(user);
};

export { User, validateUser };
