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
import sendNotification from '../utils/notifications';

const rewardReferee = async (user: IUser, amountPaid: number) => {
  // give referral percentage to refree
  // if its first txn
  const txnExists = await Transaction.countDocuments({
    user: user._id,
  });
  if (txnExists !== 0) return;
  // give free creds
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
    // find the user if exists
    const { user, txnId, amount, offerAmount, type, status } = <ITransaction>(
      req.body
    );
    const totalAmount = amount + (offerAmount ?? 0);
    const foundUser = await User.findOne({ username: user });
    if (!foundUser) return next(new AppError('No User found', 404));
    let { balance } = foundUser;

    // perform operation
    if (type === 'CREDIT' && status === 'SUCCESS') {
      await User.findByIdAndUpdate(foundUser._id, {
        $inc: {
          balance: +totalAmount || 0,
          'extraCash.offerBonus': offerAmount ?? 0,
        },
      });
      await rewardReferee(foundUser, totalAmount);
    }

    // when its debit only save pending request
    // we will debit balance when status changed to success
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

    // send notification to admin
    sendNotification({
      topic: 'Admin',
      title:
        data.type === 'DEBIT' ? 'Withdraw Request Received' : 'Amount Added',
      body: `${(data.user as unknown as typeof User).name}- Rs.${data.amount}`,
    });
    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const settleDebit = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get the transaction
    const { id } = req.params;
    const txn = await Transaction.findById(id);
    if (txn?.type !== 'DEBIT')
      return next(new AppError('Debit Transaction not found', 404));

    // settle the txn
    const { status } = req.body;
    if (txn && txn.status === 'PENDING' && status === 'SUCCESS') {
      // update user balance
      await User.findByIdAndUpdate(txn.user, {
        $inc: { balance: -txn.amount || 0 },
      });
    }

    // update transaction doc
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
    } else data = await Transaction.find(query).populate('user');

    const payload = <IResponse>{ status: 'success', data };
    return res.status(200).send(payload);
  }
);

// fn: request delete from admin for withdraw
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
