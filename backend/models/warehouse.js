import mongoose from 'mongoose';

const warehouseSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
  },
  { timestamps: true }
);

warehouseSchema.index({ code: 1, isDeleted: 1 }, { unique: true });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

export default Warehouse;
