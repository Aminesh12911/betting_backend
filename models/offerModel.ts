import mongoose from 'mongoose';

import IOffer from '../types/Offer';

const offerSchema = new mongoose.Schema<IOffer>(
  {
    addValue: {
      type: Number,
      required: true,
    },
    extraValue: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('offer', offerSchema);
