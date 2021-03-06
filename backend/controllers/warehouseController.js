import asyncHandler from 'express-async-handler';
import Warehouse from '../models/warehouseModel.js';
import { DEFAULT_LIMIT_VALUE } from '../constants/backendConstans.js';
import Stock from '../models/stockModel.js';

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

// @desc    Borra un almacén
// @route   DELETE /api/warehouses/:id
// @access  private
const deleteWarehouse = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // se puede borrar un almacén solo si no tiene existencias de cualqiuer producto
  const warehouseWithStock = await Stock.findOne({
    warehouse: id,
    isEmpty: false,
  });
  console.log(warehouseWithStock);
  if (warehouseWithStock) {
    res.status(400);
    throw new Error('Warehouse not deleted. It have products with stock');
  }

  // Verificamos que exista entre los activos
  const warehouse = await Warehouse.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!warehouse) {
    res.status(400);
    throw new Error('Warehouse not found');
  }

  warehouse.code = `${warehouse.code}_DELETED_${warehouse._id}`;
  warehouse.user = req.user;
  warehouse.isDeleted = true;

  const updateWarehouse = await warehouse.save();

  if (!updateWarehouse) {
    res.status(400);
    throw new Error('Warehouse not deleted');
  }
  res.sendStatus(200);
});

// @desc    Obtiene un almacén
// @route   GET /api/warehouses/:id
// @access  private
const getWarehouse = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // buscamos el almacén entre los activos
  const wharehouse = await Warehouse.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!wharehouse) {
    res.status(400);
    throw new Error('Warehouse not found');
  }

  res.json({
    _id: wharehouse._id,
    code: wharehouse.code,
    name: wharehouse.name,
    description: wharehouse.description,
    address: wharehouse.address,
    latitude: wharehouse.latitude,
    longitude: wharehouse.longitude,
  });
});
export {
  getWarehouses,
  registerWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getWarehouse,
};
