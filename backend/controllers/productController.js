import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { DEFAULT_LIMIT_VALUE } from '../constants/backendConstans.js';
import Category from '../models/categoryModel.js';

// @desc    Otiene el listado de productos, con la opción de mostrar todos o solo los activos
// @route   GET /api/products
// @access  private
const getProducts = asyncHandler(async (req, res) => {
  const {
    offset = 1,
    limit = DEFAULT_LIMIT_VALUE,
    onlyActive = 1,
    withCategory = 0,
  } = req.query;

  let request;
  if (onlyActive === '0') {
    request = { isDeleted: false };
  } else {
    request = { isDeleted: false, isActive: true };
  }
  const totalRecords = await Product.countDocuments(request);

  let products = [];
  console.log(withCategory);
  if (withCategory === '1') {
    console.log('1');
    products = await Product.find(request)
      .select('-isDeleted')
      .populate('category')
      .limit(limit)
      .skip((offset - 1) * limit)
      .exec();
  } else {
    console.log('0');
    products = await Product.find(request)
      .select('-isDeleted')
      .limit(limit)
      .skip((offset - 1) * limit)
      .exec();
  }

  res.setHeader('X-Total-Count', totalRecords);
  res.status(200).json(products);
});

// @desc    Agrega un nuevo producto
// @route   POST /api/products
// @access  private
const registerProduct = asyncHandler(async (req, res) => {
  const {
    code,
    name,
    description,
    image,
    cost,
    price,
    brand,
    rating,
    numReviews,
    category,
  } = req.body;

  // Verificamos si la categoría existe
  const categoryExists = await Category.findOne({
    _id: category,
    isDeleted: false,
  });
  if (!categoryExists) {
    res.status(400);
    throw new Error('Category not found');
  }

  // verificamos que no exista el código entre los activos
  const productExists = await Product.findOne({
    code: code,
    isDeleted: false,
  });
  if (productExists) {
    res.status(400);
    throw new Error('Product already exists');
  }

  const product = await Product.create({
    code: code,
    name: name,
    description: description,
    image: image,
    cost: cost,
    price: price,
    brand: brand,
    rating: rating,
    numReviews: numReviews,
    category: category,
    user: req.user,
  });

  if (product) {
    res.status(201).json({
      _id: product._id,
      code: product.code,
      name: product.name,
      description: product.description,
      image: product.image,
      cost: product.cost,
      price: product.price,
      brand: product.brand,
      rating: product.brand,
      rating: product.rating,
      numReviews: product.numReviews,
      category: product.category,
    });
  } else {
    res.status(400);
    throw new Error('Invalid product data');
  }
});

export { getProducts, registerProduct };
