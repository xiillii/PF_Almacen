import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
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

categorySchema.index({ code: 1, isDeleted: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
