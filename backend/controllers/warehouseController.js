import asyncHandler from 'express-async-handler';
import Warehouse from '../models/warehouse.js';
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

export { getWarehouses };
