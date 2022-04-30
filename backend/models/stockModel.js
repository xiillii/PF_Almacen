import mongoose from 'mongoose';

const stockSchema = mongoose.Schema(
  {
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Wharehouse',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    quantity: {
      type: mongoose.Decimal128,
      default: 0,
      required: true,
    },
    cost: {
      type: mongoose.Decimal128,
      default: 0,
      required: true,
    },
    isEmpty: {
      type: Boolean,
      default: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
  },
  { timestamps: true }
);

stockSchema.index({ wharehouse: 1, product: 1 }, { unique: false });

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
