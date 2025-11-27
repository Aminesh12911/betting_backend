import mongoose from 'mongoose';

import IBid from '../types/Bid';

const bidSchema = new mongoose.Schema<IBid>(
  {
    game: {
      type: mongoose.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['SINGLE', 'H&E'],
      default: 'SINGLE',
      required: true,
    },
    amounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model('Bid', bidSchema);
