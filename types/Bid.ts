import { Document, Types } from 'mongoose';

export interface BidAmounts {
  [key: string]: number;
}

export default interface Bid extends Document {
  game: Types.ObjectId | undefined;
  user: Types.ObjectId | undefined;
  type: 'SINGLE' | 'H&E';
  amounts: BidAmounts;
}
