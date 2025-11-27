import mongoose from 'mongoose';

import IGame from '../types/Game';

const gameSchema = new mongoose.Schema<IGame>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    resultTime: {
      type: Date,
      required: true,
    },
    gameRate: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IGame>('Game', gameSchema);
