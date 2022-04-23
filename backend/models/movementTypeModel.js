import mongoose from 'mongoose';

const movementTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    operation: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const MovementType = mongoose.model('MovementType', movementTypeSchema);

export default MovementType;
