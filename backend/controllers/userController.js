import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import { DEFAULT_LIMIT_VALUE } from '../constants/backendConstans.js';

// @desc    Fetch all users
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

export { getUsers };
