import mongoose from 'mongoose';

const movementTypeSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    operation: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const MovementType = mongoose.model('MovementType', movementTypeSchema);

export default MovementType;
