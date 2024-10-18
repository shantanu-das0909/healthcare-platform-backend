import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';

import { router as authRoutes } from './routes/auth.js';

const MONGODB_URL = process.env.MONGODB_URL;

const app = express();

app.use(bodyParser.json());

app.use(authRoutes);

mongoose.connect(MONGODB_URL).then((result) => {
  console.log('Connected to database');
});

app.listen(3000, () => {
  console.log('Magic happens on port 3000');
});
