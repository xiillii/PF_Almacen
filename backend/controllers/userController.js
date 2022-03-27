import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { DEFAULT_LIMIT_VALUE } from '../constants/backendConstans.js';
import generateToken from '../utils/generateToken.js';

// @desc    Otiene el listado de todos los usuarios
// @route   GET /api/users
// @access  private
const getUsers = asyncHandler(async (req, res) => {
  const { offset = 1, limit = DEFAULT_LIMIT_VALUE } = req.query;

  const totalRecords = await User.countDocuments();

  const users = await User.find({ isDeleted: false })
    .select('-password -isDeleted')
    .limit(limit)
    .skip((offset - 1) * limit)
    .exec();

  res.setHeader('X-Total-Count', totalRecords);

  res.status(200).json(users);
});

// @desc    Autentifica un usuario y regresa el usuario con el JWT
// @route   GET /api/users/login
// @access  private
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // busquemos el usuario por email
  const user = await User.findOne({ email: email, isDeleted: false });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export { getUsers, authUser };
