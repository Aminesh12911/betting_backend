

import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import User from '../models/userModel';
import TransactionRequest from '../models/transcationModel';
import IResponse from '../types/Response';

// ✅ CREDIT Request (Pending)
export const creditTransactionrequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, amount } = req.body;

    if (!username || amount == null)
      return next(new AppError('Username and amount are required', 400));

    const user = await User.findOne({ username });
    if (!user) return next(new AppError('User not found', 404));

    const txn = await TransactionRequest.create({
      user: user._id,
      username: user.username,
      txnId: 'TXN-' + Date.now(),
      amount,
      type: 'CREDIT',
      status: 'PENDING', // Not credited yet
      balance: user.balance, // current balance
    });

    const data = await txn.populate('user');
    const payload: IResponse = { status: 'success', data };
    res.status(200).json(payload);
  }
);

// ✅ WITHDRAW Request (Pending)
export const withdrawTransactionrequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, amount } = req.body;

    if (!username || amount == null)
      return next(new AppError('Username and amount are required', 400));

    const user = await User.findOne({ username });
    if (!user) return next(new AppError('User not found', 404));

    if (user.balance < amount)
      return next(new AppError('Insufficient balance', 400));

    const txn = await TransactionRequest.create({
      user: user._id,
      username: user.username,
      txnId: 'TXN-' + Date.now(),
      amount,
      type: 'DEBIT',
      status: 'PENDING', // Not deducted yet
      balance: user.balance,
    });

    const data = await txn.populate('user');
    const payload: IResponse = { status: 'success', data };
    res.status(200).json(payload);
  }
);
