import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

import User from '../models/userModel';
import IUser from '../types/User';
import Transaction from '../models/transactionModel';
import AppConfig from '../models/appConfigModel';

import ITransaction from '../types/Transaction';
import IResponse from '../types/Response';

// --------------------------
// Remove referral notification
// --------------------------
const rewardReferee = async (user: IUser, amountPaid: number) => {
  const txnExists = await Transaction.countDocuments({ user: user._id });
  if (txnExists !== 0) return;

  const config = await AppConfig.findOne();
  if (config) {
    const amountTobeAdded = amountPaid * (config.referralPercentage / 100);
    await User.findOneAndUpdate(
      { phone: user.referredCode },
      {
        $inc: {
          balance: amountTobeAdded,
          'extraCash.referralBonus': amountTobeAdded,
        },
      }
    );
  }
};

export const createTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, txnId, amount, offerAmount, type, status } =
      <ITransaction>req.body;

    const totalAmount = amount + (offerAmount ?? 0);

    const foundUser = await User.findOne({ username: user });
    if (!foundUser) return next(new AppError('No User found', 404));

    let { balance } = foundUser;

    if (type === 'CREDIT' && status === 'SUCCESS') {
      await User.findByIdAndUpdate(foundUser._id, {
        $inc: {
          balance: +totalAmount || 0,
          'extraCash.offerBonus': offerAmount ?? 0,
        },
      });

      await rewardReferee(foundUser, totalAmount);
    }

    const transaction = await Transaction.create({
      user: foundUser._id,
      txnId,
      amount,
      offerAmount,
      type,
      status,
      balance,
    });

    const data = await transaction.populate('user');

    // ❌ Notification removed completely

    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const settleDebit = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const txn = await Transaction.findById(id);
    if (txn?.type !== 'DEBIT')
      return next(new AppError('Debit Transaction not found', 404));

    const { status } = req.body;

    if (txn && txn.status === 'PENDING' && status === 'SUCCESS') {
      await User.findByIdAndUpdate(txn.user, {
        $inc: { balance: -txn.amount || 0 },
      });
    }

    txn.status = status;
    await txn.save();

    const payload = await txn.populate('user');
    return res.status(200).json(payload);
  }
);

export const getTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req;
    let data;

    if (query.user) {
      data = await Transaction.find({
        ...query,
        user: new Types.ObjectId(<string>query.user),
      }).populate('user');
    } else {
      data = await Transaction.find(query).populate('user');
    }

    const payload = <IResponse>{ status: 'success', data };
    return res.status(200).send(payload);
  }
);

export const deleteWithdrawReq = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { txnId } = req.params;
    let data;

    if (txnId) {
      data = await Transaction.findByIdAndDelete(txnId);
      const payload = <IResponse>{ status: 'success', data };
      return res.status(200).send(payload);
    } else {
      console.log('Transaction not valid.');
      return res.status(500).send('Server Error');
    }
  }
);
