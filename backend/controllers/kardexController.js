import asyncHandler from 'express-async-handler';
import Kardex from '../models/kardexModel.js';
import Warehouse from '../models/warehouseModel.js';
import Product from '../models/productModel.js';
import MovementType from '../models/movementTypeModel.js';
import Stock from '../models/stockModel.js';

// @desc    Inserta un movimiento al kardex
// @route   GET /api/kardex
// @access  private
const registerMovement = await asyncHandler(async (req, res) => {
  const {
    insertedDate,
    warehouseId,
    productId,
    quantity,
    cost,
    movementTypeId,
    observations,
  } = req.body;

  // si no hay valor en insertedDate, se debe tomar el de este momento
  if (!insertedDate) {
    insertedDate = Date.now();
  }
  const eWhId = await Warehouse.findOne({ _id: warehouseId, isDeleted: false });
  const ePId = await Product.findOne({ _id: productId, isDeleted: false });
  const eMId = await MovementType.findOne({
    _id: movementTypeId,
    isDeleted: false,
  });

  let errors = [];
  if (!eWhId) {
    errors.push({
      error: 'Warehouse not found',
    });
  }
  if (!ePId) {
    errors.push({
      error: 'Product not found',
    });
  }
  if (!eMId) {
    errors.push({
      error: 'Movement Type not found',
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }

  const inserted = await Kardex.create({
    insertedDate: insertedDate,
    warehouse: warehouseId,
    product: productId,
    quantity: quantity,
    cost: cost,
    movementType: movementTypeId,
    observations: observations,
    user: req.user,
  });

  if (inserted) {
    // ahora tenemos que insertar o incrementar el stock
    // El registro en stock debe ser dado de alta en el registro de productos
    res.status(201).json({
      _id: inserted._id,
      insertedDate: inserted.insertedDate,
    });
  } else {
    res.status(400);
    throw new Error('Invalid kardex data');
  }
});

export { registerMovement };
