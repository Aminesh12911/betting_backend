import { Types } from 'mongoose';

export default interface ITransaction {
  txnId: string;
  type: 'CREDIT' | 'DEBIT';
  user: Types.ObjectId;
  username: string; // ✅ MUST BE ADDED
  amount: number;
  status: 'SUCCESS' | 'FAILD' | 'PENDING';
  balance: number;
}
