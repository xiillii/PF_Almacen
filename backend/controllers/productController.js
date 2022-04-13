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

  if (withCategory === '1') {
    products = await Product.find(request)
      .select('-isDeleted')
      .populate('category')
      .limit(limit)
      .skip((offset - 1) * limit)
      .exec();
  } else {
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

// @desc    Modifica un producto
// @route   PUT /api/products/:id
// @access  private
const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
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
    isActive,
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
    _id: id,
    isDeleted: false,
  });
  if (!productExists) {
    res.status(400);
    throw new Error('Product not found');
  }

  productExists.code = code;
  productExists.name = name;
  productExists.description = description;
  productExists.image = image;
  productExists.cost = cost;
  productExists.price = price;
  productExists.brand = brand;
  productExists.rating = rating;
  productExists.numReviews = numReviews;
  productExists.isActive = isActive;
  productExists.category = category;
  productExists.user = req.user;

  const updatedProduct = await productExists.save();

  if (updateProduct) {
    res.json({
      _id: updatedProduct._id,
      code: updatedProduct.code,
      name: updatedProduct.name,
      description: updatedProduct.description,
      image: updatedProduct.image,
      cost: updatedProduct.cost,
      price: updatedProduct.price,
      brand: updatedProduct.brand,
      rating: updatedProduct.rating,
      numReviews: updatedProduct.numReviews,
      isActive: updatedProduct.isActive,
      category: updatedProduct.category,
    });
  } else {
    throw new Error('Cannot update the product');
  }
});

// @desc    Modifica un producto con PATCH
// @route   PATCH /api/products/:id
// @access  private
const patchProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
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
    isActive,
    category,
  } = req.body;

  if (category) {
    // Verificamos si la categoría existe
    const categoryExists = await Category.findOne({
      _id: category,
      isDeleted: false,
    });
    if (!categoryExists) {
      res.status(400);
      throw new Error('Category not found');
    }
  }

  // verificamos que no exista el código entre los activos
  const productExists = await Product.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!productExists) {
    res.status(400);
    throw new Error('Product not found');
  }

  const updatedProduct = await Product.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    req.body,
    { new: true }
  );
  if (updatedProduct) {
    res.json({
      _id: updatedProduct._id,
      code: updatedProduct.code,
      name: updatedProduct.name,
      description: updatedProduct.description,
      image: updatedProduct.image,
      cost: updatedProduct.cost,
      price: updatedProduct.price,
      brand: updatedProduct.brand,
      rating: updatedProduct.rating,
      numReviews: updatedProduct.numReviews,
      isActive: updatedProduct.isActive,
      category: updatedProduct.category,
    });
  } else {
    res.status(400);
    throw new Error('Product not found or error updating');
  }
});

// @desc    Borra lógicamdente un producto por id
// @route   DELETE /api/products/:id
// @access  private
const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // verificamos que no exista el código entre los activos
  const productExists = await Product.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!productExists) {
    res.status(400);
    throw new Error('Product not found');
  }

  productExists.isDeleted = true;
  productExists.code = `${productExists.code}_DELETED_${productExists._id}`;
  productExists.user = req.user;

  const updatedProduct = await productExists.save();
  if (!updatedProduct) {
    res.status(400);
    throw new Error('Product not updated');
  }
  res.sendStatus(200);
});

// @desc    obtiene un producto por id
// @route   GET /api/products/:id
// @access  private
const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const product = await Product.findOne({ _id: id, isDeleted: false }).populate(
    'category'
  );

  if (product) {
    res.json({
      _id: product._id,
      code: product.code,
      name: product.name,
      description: product.description,
      image: product.image,
      cost: product.cost,
      price: product.price,
      brand: product.brand,
      rating: product.rating,
      numReviews: product.numReviews,
      isActive: product.isActive,
      category: product.category,
      category: product.category,
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getProducts,
  registerProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
  getProduct,
};
