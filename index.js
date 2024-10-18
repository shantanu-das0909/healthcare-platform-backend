// start the appication by "npm run dev"
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';

import { router as authRoutes } from './routes/auth.js';
import { router as userRoutes } from './routes/user.js';
import { router as adminRoutes } from './routes/admin.js';

const PORT = process.env.PORT || 5010;
const MONGODB_URL = process.env.MONGODB_URL;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(userRoutes);

mongoose.connect(MONGODB_URL).then((result) => {
  console.log('Connected to database');
});

app.listen(PORT, () => {
  console.log(`Magic happens on port ${PORT}`);
});
