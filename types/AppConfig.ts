import { Types, Document } from 'mongoose';

export interface IText extends Types.Subdocument {
  title: string;
  content: string;
}

export interface IBanner extends Types.Subdocument {
  title: string;
  image: string;
}

export default interface IAppInfo extends Document {
  name: string;
  adminPhone: number;
  devId: Types.ObjectId[];
  downUrl: string;
  withdrawCharge: number;
  withdrawLimit: number;
  withdrawStartTime: Date;
  withdrawEndTime: Date;
  adminUPIs: [string];
  referralPercentage: number;
  minimumDeposit: number;
  minimumBid: number;
  minimumWithdraw: number;
  text?: Types.DocumentArray<IText & Document>;
  banner?: Types.DocumentArray<IBanner & Document>;
}
