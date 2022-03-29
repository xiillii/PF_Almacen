import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import { DEFAULT_LIMIT_VALUE } from '../constants/backendConstans.js';

// @desc    Otiene el listado de todas las categorias
// @route   GET /api/categories
// @access  private
const getCategories = asyncHandler(async (req, res) => {
  const { offset = 1, limit = DEFAULT_LIMIT_VALUE } = req.query;

  const totalRecords = await Category.countDocuments({ isDeleted: false });

  const categories = await Category.find({ isDeleted: false })
    .limit(limit)
    .skip((offset - 1) * limit)
    .exec();

  res.setHeader('X-Total-Count', totalRecords);
  res.status(200).json(categories);
});

export { getCategories };
