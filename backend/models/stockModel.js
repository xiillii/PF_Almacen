import mongoose from 'mongoose';

const stockSchema = mongoose.Schema(
  {
    wharehouse,
    product,
    quantity,
  },
  { timestamps: true }
);

stockSchema.index({ wharehouse: 1, product: 1 }, { unique: true });

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
