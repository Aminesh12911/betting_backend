import { Response, NextFunction } from 'express';
import moment from 'moment';

import { Types } from 'mongoose';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

import Bid from '../models/bidModel';
import User from '../models/userModel';

import IBid from '../types/Bid';
import IRequestExtended from '../types/Requet';
import IResponse from '../types/Response';
import gameModel from '../models/gameModel';

export const getAllBids = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const { query } = req;
    if (query.user) {
      // @ts-ignore
      query.user = new Types.ObjectId(<string>query.user);
    }
    if (query.game) {
      // @ts-ignore
      query.game = new Types.ObjectId(<string>query.game);
    }

    const data = await Bid.find(query).populate('user game');
    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const getBid = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const { bidId } = req.params;
    const bidExists = await Bid.countDocuments({ _id: bidId });
    if (bidExists === 0)
      return next(new AppError('Requested Resource not foud.', 404));

    // get bid
    const data = await Bid.findById(bidId).populate('user game');
    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const updateBid = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const user = req.user?.id;
    const { bidId } = req.params;
    const bidExists = await Bid.countDocuments({ _id: bidId });
    if (bidExists === 0)
      return next(new AppError('Requested Resource not foud.', 404));

    const { amounts } = <IBid>req.body;
    const bidDetails = await Bid.findById(bidId).populate('user game');

    // add new bids to existing
    const usr = await User.findById(user);
    const amountToBeDeducted = Object.values(amounts).reduce(
      (sum, item) => sum + item,
      0
    );
    if (!usr) return next(new AppError('No user found', 404));
    if (amountToBeDeducted > usr.balance) {
      // eslint-disable-next-line prettier/prettier
      return next(new AppError('You don\'t have enough balance', 400));
    }
    if (bidDetails) {
      Object.keys(amounts).forEach((key) => {
        const existentAmount = bidDetails.get(`amounts.${key}`);
        // if bid exists on that number add it
        if (existentAmount)
          bidDetails.set(`amounts.${key}`, existentAmount + amounts[key]);
        else bidDetails.set(`amounts.${key}`, amounts[key]);

        // deduct balance
        if (usr) usr.balance -= amounts[key];
      });
      await bidDetails.save();
      await usr?.save();
    } else return next(new AppError('Requested resource not found', 404));

    // return response
    const data = await Bid.findById(bidDetails._id).populate('user game');
    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const deleteBid = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const { bidId } = req.params;
    const bidExists = await Bid.findById(bidId).lean();
    if (!bidExists)
      return next(new AppError('Requested Resource not foud.', 404));

    // re-add balance
    const amountToBeAdded = Object.values(bidExists.amounts).reduce(
      (sum, item) => sum + item,
      0
    );
    await User.findOneAndUpdate(
      { _id: bidExists.user },
      {
        $inc: { balance: amountToBeAdded },
      }
    );
    // delete bid
    const data = await Bid.findByIdAndDelete(bidId).populate('user game');
    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

// const validateTime = (currentTime: Date, beforeTime: Date, afterTime: Date) => {
//   const cTime = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
//   const bTime = `${beforeTime.getHours()}:${beforeTime.getMinutes()}:${beforeTime.getSeconds()}`;
//   const aTime = `${afterTime.getHours()}:${afterTime.getMinutes()}:${afterTime.getSeconds()}`;

//   const format = 'hh:mm:ss';
//   const cmt = moment(cTime, format).utc();
//   const bmt = moment(bTime, format).utc();
//   const amt = moment(aTime, format).utc();

//   return cmt.isBetween(bmt, amt);
// };

export const createBid = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    // can bid from own accont
    const user = req.user?.id;
    const { game, amounts, type } = <IBid>req.body;

    const usr = await User.findById(user);
    if (!usr) return next(new AppError('No user found', 404));

    const gameExists = await gameModel.findById(game);
    if (!gameExists) return next(new AppError('No game found', 404));

    // if (!validateTime(new Date(), gameExists.startTime, gameExists.endTime))
    //   return next(new AppError('Not a valid time', 400));

    if (Object.keys(amounts).length === 0)
      return next(new AppError('You should provide atleast one amount', 400));

    // if already bid-ed today update bid
    const bidExist = await Bid.findOne({
      user,
      game,
      type,
      createdAt: {
        $gte: moment().startOf('day'),
      },
    }).populate('user game');

    if (bidExist) {
      const { _id } = bidExist;
      req.params.bidId = _id;
      return updateBid(req, res, next);
    }

    // update balance
    const amountToBeDeducted = Object.values(amounts).reduce(
      (sum, item) => sum + item,
      0
    );

    if (amountToBeDeducted > usr.balance) {
      // eslint-disable-next-line prettier/prettier
      return next(new AppError('You don\'t have enough balance', 400));
    }
    usr.balance -= amountToBeDeducted;
    await usr?.save();
    const newBid = await Bid.create({ game, user, amounts, type }); // create bid

    // return result
    if (!newBid) return next(new AppError('Error creating bid', 500));
    const data = await Bid.findById(newBid._id).populate('user game');
    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);
