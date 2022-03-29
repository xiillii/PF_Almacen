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

const registerCategory = asyncHandler(async (req, res) => {
  let { code, description } = req.body;

  code = code.trim();

  if (description) {
    description = description.trim();
  }

  // verificamos que no exista el código entre los activos
  const categoryExists = await Category.findOne({
    code: code,
    isDeleted: false,
  });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({
    code,
    description,
  });

  if (category) {
    res.status(201).json({
      _id: category._id,
      code: category.code,
      description: category.description,
    });
  } else {
    res.status(400);
    throw new Error('Invalid category data');
  }
});

export { getCategories, registerCategory };
