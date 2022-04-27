import asyncHandler from 'express-async-handler';
import MovementType from '../models/movementTypeModel.js';
import { DEFAULT_LIMIT_VALUE } from '../constants/backendConstans.js';

// @desc    Otiene el listado de todos los tipos de movimientos
// @route   GET /api/movementtypes
// @access  private
const getMovementTypes = asyncHandler(async (req, res) => {
  const { offset = 1, limit = DEFAULT_LIMIT_VALUE } = req.query;

  const totalRecords = await MovementType.countDocuments({ isDeleted: false });

  const movementTypes = await MovementType.find({ isDeleted: false })
    .select('-isDeleted')
    .limit(limit)
    .skip((offset - 1) * limit)
    .exec();

  res.setHeader('X-Total-Count', totalRecords);
  res.status(200).json(movementTypes);
});

// @desc    Agrega un nuevo tipo de movimiento
// @route   POST /api/movementtypes
// @access  private
const registerMovementType = asyncHandler(async (req, res) => {
  const { code, name, operation } = req.body;

  const exists = await MovementType.findOne({ code: code, isDeleted: false });

  if (exists) {
    res.status(400);
    throw new Error('Movement Type already exists');
  }
  let auxOperation = operation;
  if (operation === 0) {
    auxOperation = 1;
  }

  const item = await MovementType.create({
    code: code,
    name: name,
    operation: auxOperation,
    user: req.user,
  });

  if (item) {
    res.status(201).json({
      _id: item._id,
      code: item.code,
      operation: item.operation,
    });
  } else {
    res.status(400);
    throw new Error('Invalida movement type data');
  }
});

export { getMovementTypes, registerMovementType };
