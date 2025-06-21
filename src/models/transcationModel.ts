import mongoose from 'mongoose';
import ITransaction from '../types/Transaction';

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    txnId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true, // ✅ Add this to enforce
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILD', 'PENDING'],
      default: 'PENDING',
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('TransactionRequest', transactionSchema);
