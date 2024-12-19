import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

const secret = process.env.JWT_SECRET_KEY || '';
const expiration = '1h';

export const authMiddleware = ({ req }) => {
  let token = req.headers.authorization || '';

  if (token) {
    token = token.split(' ').pop().trim();
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }
  }

  return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  return jwt.sign(payload, secret, { expiresIn: expiration });
};
