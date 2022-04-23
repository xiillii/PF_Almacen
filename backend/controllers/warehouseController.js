import asyncHandler from 'express-async-handler';
import Warehouse from '../models/warehouseModel.js';
import { DEFAULT_LIMIT_VALUE } from '../constants/backendConstans.js';

// @desc    Otiene el listado de todas los almacenes
// @route   GET /api/warehouses
// @access  private
const getWarehouses = asyncHandler(async (req, res) => {
  const { offset = 1, limit = DEFAULT_LIMIT_VALUE } = req.query;

  const totalRecords = await Warehouse.countDocuments({ isDeleted: false });

  const wharehouses = await Warehouse.find({ isDeleted: false })
    .select('-isDeleted')
    .limit(limit)
    .skip((offset - 1) * limit)
    .exec();

  res.setHeader('X-Total-Count', totalRecords);
  res.status(200).json(wharehouses);
});

// @desc    Agrega un nuevo almacen
// @route   POST /api/warehouses
// @access  private
const registerWarehouse = asyncHandler(async (req, res) => {
  let { code, name, description, address, latitude, longitude } = req.body;

  // verificamos que no exista el código del almacen entre los activos
  const warehouseExists = await Warehouse.findOne({
    code: code,
    isDeleted: false,
  });
  if (warehouseExists) {
    res.status(400);
    throw new Error('Warehouse already exists');
  }

  const warehouse = await Warehouse.create({
    code: code,
    name: name,
    description: description,
    address: address,
    latitude: latitude,
    longitude: longitude,
    user: req.user,
  });

  if (warehouse) {
    res.status(201).json({
      _id: warehouse._id,
      code: warehouse.code,
      name: warehouse.name,
      description: warehouse.description,
      address: warehouse.address,
      latitude: warehouse.latitude,
      longitude: warehouse.longitude,
    });
  } else {
    res.status(400);
    throw new Error('Invalid warehouse data');
  }
});

// @desc    Modifica un almacen
// @route   PUT /api/warehouses/:id
// @access  private
const updateWarehouse = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { code, name, description, address, latitude, longitude } = req.body;

  // verificamos que no exista el código entre los activos
  const warehouseExists = await Warehouse.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!warehouseExists) {
    res.status(400);
    throw new Error('Warehouse not found');
  }

  warehouseExists.code = code;
  warehouseExists.name = name;
  warehouseExists.description = description;
  warehouseExists.address = address;
  warehouseExists.latitude = latitude;
  warehouseExists.longitude = longitude;
  warehouseExists.user = req.user;

  const updateWarehouse = await warehouseExists.save();

  if (updateWarehouse) {
    res.json({
      _id: updateWarehouse._id,
      code: updateWarehouse.code,
      name: updateWarehouse.name,
      description: updateWarehouse.description,
      address: updateWarehouse.address,
      latitude: updateWarehouse.latitude,
      longitude: updateWarehouse.longitude,
    });
  } else {
    throw new Error('Cannot update the warehouse');
  }
});

export { getWarehouses, registerWarehouse, updateWarehouse };
