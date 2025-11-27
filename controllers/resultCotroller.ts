import { Response, NextFunction } from 'express';
import moment from 'moment';

import { Types } from 'mongoose';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

import Result from '../models/resultModel';
import Bid from '../models/bidModel';
import User from '../models/userModel';
import WinList from '../models/winlistModel';

import IGame from '../types/Game';
import IRequestExtended from '../types/Requet';
import IResponse from '../types/Response';
import gameModel from '../models/gameModel';

export const updateResult = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const { resultID } = req.params;

    const resultExists = await Result.countDocuments({ _id: resultID });
    if (resultExists === 0)
      return next(new AppError('Requested Resource not found.', 404));

    const { number, resultAt } = req.body;

    const data = await Result.findByIdAndUpdate(
      resultID,
      { number, resultAt },
      { new: true, runValidators: true }
    ).populate('game');

    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const createResult = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const { number, game, resultAt } = req.body;

    const resultExists = await Result.findOne({
      game,
      resultAt: {
        $gte: moment(resultAt).startOf('day'),
        $lte: moment(resultAt).endOf('day').toDate(),
      },
    });

    if (resultExists) {
      req.params.resultID = resultExists._id.toString();
      return updateResult(req, res, next);
    }

    const data = await (await Result.create({ number, game, resultAt })).populate('game');

    const gameId = new Types.ObjectId(game as string);

    const bidsWon = await Bid.find({
  game: gameId,
  createdAt: {
    $gte: moment(resultAt).startOf('day'),
    $lte: moment(resultAt).endOf('day').toDate(),
  },
})
  .where(`amounts.${number}`).exists(true) // FIXED
  .populate('game');


    bidsWon.forEach(async (bid) => {
      const { user, amounts, type } = bid;
      const gameObject = bid.game as unknown as IGame;
      const amountObject = amounts as unknown as Types.Map<string>;

      const bidAmount = Number(amountObject.get(number) || 0); // FIXED

      let winAmount = 0;
      if (bidAmount) {
        winAmount = gameObject.gameRate * bidAmount;
      }

      await User.findByIdAndUpdate(user, {
        $inc: { balance: winAmount },
      });

      await WinList.create({
        game: bid.game,
        bidAmount,
        winAmount,
        user,
        bidType: type,
        result: data._id,
      });
    });

    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const getAllResults = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const query: any = req.query;

    if (query.game) {
      query.game = new Types.ObjectId(query.game); // FIXED
    }

    const data = await Result.find(query).populate('game');
    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const getTodaysResults = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const query: any = req.query;

    if (query.game) {
      query.game = new Types.ObjectId(query.game); // FIXED
    }

    const data = await Result.find({
      ...query,
      createdAt: {
        $gte: moment().startOf('day'),
        $lte: moment().endOf('day').toDate(),
      },
    }).populate('game');

    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const getResult = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const { resultID } = req.params;

    const resultExists = await Result.countDocuments({ _id: resultID });
    if (resultExists === 0)
      return next(new AppError('Requested Resource not found.', 404));

    const data = await Result.findById(resultID).populate('game');
    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const deleteResult = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const { resultID } = req.params;

    const resultExists = await Result.countDocuments({ _id: resultID });
    if (resultExists === 0)
      return next(new AppError('Requested Resource not found.', 404));

    const data = await Result.findByIdAndDelete(resultID).populate('game');
    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);
