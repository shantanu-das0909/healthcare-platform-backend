import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User, validateUser } from '../models/user.js';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const signup = async (req, res, next) => {
  const { error } = validateUser(req.body);
  console.log(error);

  if (error) {
    return res.status(400).json({ message: 'user validation failed' });
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res
        .status(400)
        .json({ message: 'User already exisits. Please sign in' });
    }

    const {
      name,
      email,
      password,
      phone,
      dob,
      gender,
      address,
      occupation,
      emergencyContactNumber,
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      dob: dob,
      gender: gender,
      address: address,
      occupation: occupation,
      emergencyContactNumber: emergencyContactNumber,
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User created', user: savedUser });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'User does not exist. Please signup' });
    }

    const isEqualPassword = await bcrypt.compare(password, user.password);

    if (!isEqualPassword) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
