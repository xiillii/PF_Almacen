import mongoose from 'mongoose';

const kardexSchema = mongoose.Schema(
  {
    insertedDate: {
      type: Date,
      required: true,
      index: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Warehouse',
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
      index: true,
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
    movementType: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'MovementType',
      index: true,
    },
    observations: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

kardexSchema.index({ warehouse: 1, product: 1 }, { unique: false });

const Kardex = mongoose.model('Kardex', kardexSchema);

export default Kardex;
