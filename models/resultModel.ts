import mongoose from 'mongoose';

import IResult from '../types/Result';

const resutlSchema = new mongoose.Schema<IResult>(
  {
    game: {
      type: mongoose.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    resultAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('result', resutlSchema);
