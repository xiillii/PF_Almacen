import asyncHandler from 'express-async-handler';
import Kardex from '../models/kardexModel.js';
import Warehouse from '../models/warehouseModel.js';
import Product from '../models/productModel.js';
import MovementType from '../models/movementTypeModel.js';
import Stock from '../models/stockModel.js';
import mongoose from 'mongoose';

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

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const stockExists = await Stock.findOne({
      warehouse: warehouseId,
      product: productId,
    });

    // ahora tenemos que insertar o incrementar el stock
    let auxCost = cost;
    if (eMId.operation !== -1) {
      // es una entrada
      await Stock.create({
        warehouse: warehouseId,
        product: productId,
        quantity: quantity,
        cost: auxCost,
        isEmpty: false,
        user: req.user,
      });
    } else {
      // es una salida
      // tenemos que verificar las existencias
      const auxStock = await Stock.aggregate([
        {
          $match: {
            warehouse: new mongoose.Types.ObjectId(`${warehouseId}`),
            product: new mongoose.Types.ObjectId(`${productId}`),
            isEmpty: false,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$quantity',
            },
          },
        },
      ]);

      let theTotal = 0.0;
      if (auxStock && auxStock.length > 0) {
        theTotal = auxStock[0].total;
      }
      if (theTotal >= quantity) {
        //  si tenemos existencia, tenemos que ir vaciando las cajas y obtener ese costo
        let remain = quantity;

        const theStock = Stock.find({
          warehouse: warehouseId,
          product: productId,
          isEmpty: false,
        })
          .sort({ createdAt: 1 })
          .cursor();

        auxCost = 0.0;
        await theStock.eachAsync(async (s) => {
          if (auxCost === 0.0) {
            auxCost = s.cost;
          }
          s.quantity = s.quantity - remain;
          if (s.quantity < 0.0) {
            remain = s.quantity * -1.0;
            s.quantity = 0;
            s.isEmpty = true;
            await s.save();
          } else {
            remain = 0;
            await s.save();
            return;
          }
        });
      } else {
        res.status(400);
        throw new Error('The product does not have enought existence');
      }
    }

    const inserted = await Kardex.create({
      insertedDate: insertedDate,
      warehouse: warehouseId,
      product: productId,
      quantity: quantity,
      cost: auxCost,
      movementType: movementTypeId,
      observations: observations,
      user: req.user,
    });

    if (inserted) {
      await session.commitTransaction();

      res.status(201).json({
        _id: inserted._id,
        insertedDate: inserted.insertedDate,
        warehouseId: inserted.warehouse,
        productId: inserted.product,
        quantity: inserted.quantity,
        cost: inserted.cost,
        movementTypeId: inserted.movementType,
        observations: inserted.observations,
      });
    } else {
      res.status(400);
      throw new Error('Invalid kardex data');
    }
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
});

export { registerMovement };
