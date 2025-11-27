import mongoose from 'mongoose';

import ITransaction from '../types/Transaction';

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    txnId: String,
    type: {
      type: String,
      enum: ['DEBIT', 'CREDIT'],
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
    offerAmount: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILD', 'PENDING'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
