import { Types } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import userModel from '../models/userModel';
import bidModel from '../models/bidModel';
import winlistModel from '../models/winlistModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import IResponse from '../types/Response';
import transactionModel from '../models/transactionModel';

const getTotalDeposits = async (userId: Types.ObjectId): Promise<number> => {
  const data = await transactionModel.aggregate([
    {
      $match: {
        user: userId,
        type: 'CREDIT',
        status: 'SUCCESS',
      },
    },
    {
      $group: {
        _id: '$user',
        totalDeposit: {
          $sum: '$amount',
        },
      },
    },
  ]);
  return data.length ? data[0].totalDeposit : 0;
};

const getTotalWithdraw = async (userId: Types.ObjectId): Promise<number> => {
  const data = await transactionModel.aggregate([
    {
      $match: {
        user: userId,
        type: 'DEBIT',
        status: 'SUCCESS',
      },
    },
    {
      $group: {
        _id: '$user',
        totalWithdraw: {
          $sum: '$amount',
        },
      },
    },
  ]);
  return data.length ? data[0].totalWithdraw : 0;
};

const getTotalBidding = async (userId: Types.ObjectId): Promise<number> => {
  const data = await bidModel.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $project: {
        amounts: {
          $objectToArray: '$amounts',
        },
      },
    },
    {
      $unwind: {
        path: '$amounts',
      },
    },
    {
      $group: {
        _id: null,
        bidAmount: {
          $sum: '$amounts.v',
        },
      },
    },
  ]);
  return data.length ? data[0].bidAmount : 0;
};

const getTotalWinning = async (userId: Types.ObjectId): Promise<number> => {
  const data = await winlistModel.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $group: {
        _id: '$user',
        totalWinning: {
          $sum: '$winAmount',
        },
      },
    },
  ]);
  return data.length ? data[0].totalWinning : 0;
};

interface IStatsData {
  totalBidding: number;
  totalWinning: number;
  totalDeposit: number;
  totalWithdraw: number;
}
const fetchUserStats = async (userId: Types.ObjectId): Promise<IStatsData> => ({
  totalBidding: await getTotalBidding(userId),
  totalWithdraw: await getTotalWithdraw(userId),
  totalDeposit: await getTotalDeposits(userId),
  totalWinning: await getTotalWinning(userId),
});

export const getUserStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { username } = req.params;
    username = username.toLowerCase();

    const user = await userModel.findOne({ username });
    if (!user) return next(new AppError('No user found', 404));

    const payload: IResponse = {
      status: 'success',
      data: await fetchUserStats(user._id),
    };
    return res.status(200).json(payload);
  }
);

export default getUserStats;
