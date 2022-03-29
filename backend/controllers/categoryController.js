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

// @desc    Agrega una nueva categoría
// @route   POST /api/categories
// @access  private
const registerCategory = asyncHandler(async (req, res) => {
  let { code, description } = req.body;

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
    code: code,
    description: description,
    user: req.user,
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

// @desc    Modifica una nueva categoría
// @route   POST /api/categories/:id
// @access  private
const updateCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { code, description } = req.body;

  // verificamos que no exista el código entre los activos
  const category = await Category.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!category) {
    res.status(400);
    throw new Error('Category not found');
  }
  category.code = code;
  category.description = description;
  category.user = req.user;

  const updatedCategory = await category.save();

  res.json({
    _id: updatedCategory._id,
    code: updatedCategory.code,
    description: updatedCategory.description,
  });
});

export { getCategories, registerCategory, updateCategory };
