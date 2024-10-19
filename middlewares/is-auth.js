import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const isAuth = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    res.status(500).json({ message: 'Not authenticated' });
  }

  if (!decodedToken) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  req.userId = decodedToken.id;
  next();
};
