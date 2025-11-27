import { Document, Types } from 'mongoose';

export default interface Transaction extends Document {
  txnId?: string;
  user: Types.ObjectId | undefined;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  offerAmount: number;
  balance: number;
  status: 'SUCCESS' | 'FAILD' | 'PENDING';
}
