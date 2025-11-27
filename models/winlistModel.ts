import mongoose, { Types } from 'mongoose';

import { IWinList } from '../types/Winlist';

const winListSchema = new mongoose.Schema<IWinList>(
  {
    game: {
      type: mongoose.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    user: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    winAmount: {
      type: Number,
      required: true,
    },
    bidType: {
      type: String,
      enum: ['SINGLE', 'H&E'],
      required: true,
    },
    result: {
      type: Types.ObjectId,
      ref: 'Result',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IWinList>('winlist', winListSchema);
