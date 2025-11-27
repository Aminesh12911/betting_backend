import mongoose, { mongo } from 'mongoose';

import IAppInfo, { IBanner, IText } from '../types/AppConfig';

const textSchema = new mongoose.Schema<IText>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const bannerSchema = new mongoose.Schema<IBanner>({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const appInfoSchema = new mongoose.Schema<IAppInfo>(
  {
    name: {
      type: String,
      default: 'Online Teer',
    },
    adminPhone: Number,
    devId: [mongoose.Types.ObjectId],
    downUrl: String,
    withdrawCharge: Number,
    withdrawLimit: Number,
    withdrawStartTime: Date,
    withdrawEndTime: Date,
    adminUPIs: [String],
    referralPercentage: Number,
    minimumDeposit: Number,
    minimumBid: Number,
    minimumWithdraw: Number,
    text: [textSchema],
    banner: [bannerSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IAppInfo>('Config', appInfoSchema);
