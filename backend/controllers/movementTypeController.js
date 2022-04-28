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
      name: item.name,
      operation: item.operation,
    });
  } else {
    res.status(400);
    throw new Error('Invalida movement type data');
  }
});

// @desc    Modifica un tipo de movimiento
// @route   POST /api/movementtypes/:id
// @access  private
const updateMovementType = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { code, name, operation } = req.body;

  const exists = await MovementType.findOne({ _id: id, isDeleted: false });

  if (!exists) {
    res.status(400);
    throw new Error('Movement Type not found');
  }

  let auxOperation = operation;
  if (operation === 0) {
    auxOperation = 1;
  }

  exists.code = code;
  exists.name = name;
  exists.operation = auxOperation;
  exists.user = req.user;

  const updateItem = await exists.save();

  res.json({
    _id: updateItem._id,
    code: updateItem.code,
    name: updateItem.name,
    operation: updateItem.operation,
  });
});

// @desc    Borra un tipo de movimiento
// @route   DELETE /api/movementtypes/:id
// @access  private
const deleteMovementType = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const exists = await MovementType.findOne({ _id: id, isDeleted: false });

  if (!exists) {
    res.status(400);
    throw new Error('Movement Type not found');
  }

  exists.code = `${exists.code}_DELETED_${exists._id}`;
  exists.user = req.user;
  exists.isDeleted = true;

  const updatedItem = await exists.save();

  if (!updatedItem) {
    res.status(400);
    throw new Error('Movement Type not deleted');
  }
  res.sendStatus(200);
});

export {
  getMovementTypes,
  registerMovementType,
  updateMovementType,
  deleteMovementType,
};
