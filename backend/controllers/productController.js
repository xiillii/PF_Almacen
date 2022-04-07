import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { DEFAULT_LIMIT_VALUE } from '../constants/backendConstans.js';

// @desc    Otiene el listado de productos, con la opción de mostrar todos o solo los activos
// @route   GET /api/products
// @access  private
const getProducts = asyncHandler(async (req, res) => {
  const { offset = 1, limit = DEFAULT_LIMIT_VALUE, onlyActive = 1 } = req.query;

  let request;
  if (onlyActive === 0) {
    request = { isDeleted: false };
  } else {
    request = { isDeleted: false, isActive: true };
  }
  const totalRecords = await Product.countDocuments(request);

  const products = await Product.find(request)
    .limit(limit)
    .skip((offset - 1) * limit)
    .exec();

  res.setHeader('X-Total-Count', totalRecords);
  res.status(200).json(products);
});

export { getProducts };
