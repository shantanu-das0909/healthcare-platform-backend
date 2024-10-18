import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    name: {
      type: 'string',
      required: true,
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

export const Doctor = mongoose.model('Doctor', doctorSchema);
