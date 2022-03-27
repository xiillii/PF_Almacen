import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // obtenemos el usuario entre los activos
      const theUser = await User.findOne({
        _id: decoded.id,
        isDeleted: false,
      }).select('-password -isDeleted');
      if (theUser) {
        req.user = theUser;
        next();
      } else {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // No esta autorizado
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect };
