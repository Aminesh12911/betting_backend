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
import sendNotification from '../utils/notifications';
import gameModel from '../models/gameModel';

export const updateResult = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const { resultID } = req.params;

    const resultExists = await Result.countDocuments({ _id: resultID });
    if (resultExists === 0)
      return next(new AppError('Requested Resource not foud.', 404));

    const { number, resultAt } = req.body;

    // update bid
    const data = await Result.findByIdAndUpdate(
      resultID,
      { number, resultAt },
      { new: true, runValidators: true }
    ).populate('game');

    // if number updated re-send notification
    if (number)
      sendNotification({
        topic: 'Client',
        title: 'Result Declared! Sorry for the mistake',
        body: `${(data?.game as unknown as typeof gameModel).name}- ${number}`,
      });

    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const createResult = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const { number, game, resultAt } = req.body;

    // if already result out today update game result
    const resultExists = await Result.findOne({
      game,
      resultAt: {
        $gte: moment(resultAt).startOf('day'),
        $lte: moment(resultAt).endOf('day').toDate(),
      },
    });

    if (resultExists) {
      const { _id } = resultExists;
      req.params.resultID = _id;
      return updateResult(req, res, next);
    }

    // decleare result
    const data = await (
      await Result.create({ number, game, resultAt })
    ).populate('game');

    // add amount to who won
    const gameId = new Types.ObjectId(<string>game);
    const bidsWon = await Bid.find({
      game: gameId,
      createdAt: {
        $gte: moment(resultAt).startOf('day'),
        $lte: moment(resultAt).endOf('day').toDate(),
      },
    })
      // @ts-ignore
      .exists(`amounts.${number}`)
      .populate('game');

    // add gameRate * bidAmount to their balances
    bidsWon.forEach(async (bid) => {
      const { user, amounts, type } = bid;
      const gameObject = bid.game as unknown as IGame;
      const amountObject = amounts as unknown as Types.Map<string>;

      // @ts-ignore
      const bidAmount: number = amountObject.get(number);
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
    // send result out noti to client
    sendNotification({
      topic: 'Client',
      title: 'Result Declared!',
      body: `${(data?.game as unknown as typeof gameModel).name}- ${number}`,
    });
    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const getAllResults = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const { query } = req;
    if (query.game) {
      // @ts-ignore
      query.game = new Types.ObjectId(<string>query.game);
    }

    const data = await Result.find(query).populate('game');
    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const getTodaysResults = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const { query } = req;
    if (query.game) {
      // @ts-ignore
      query.game = new Types.ObjectId(<string>query.game);
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
      return next(new AppError('Requested Resource not foud.', 404));

    // get result
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
      return next(new AppError('Requested Resource not foud.', 404));

    // get result
    const data = await Result.findByIdAndDelete(resultID).populate('game');
    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);
