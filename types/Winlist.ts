import { Types } from 'mongoose';

export interface IWinList {
  game: Types.ObjectId | undefined;
  user: Types.ObjectId | undefined;
  bidAmount: number;
  winAmount: number;
  bidType: 'SINGLE' | 'H&E';
  result: Types.ObjectId | undefined;
}
