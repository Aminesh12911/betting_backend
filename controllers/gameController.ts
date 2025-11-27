import { Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

import Game from '../models/gameModel';

import IGame from '../types/Game';
import IRequestExtended from '../types/Requet';
import IResponse from '../types/Response';

export const getAllGames = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    // get game
    const data = await Game.find({});
    const payload = <IResponse>{ data, status: 'success' };
    return res.status(200).send(payload);
  }
);

export const getGame = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    // get the game
    const { gameId } = req.params;
    const gameExists = await Game.countDocuments({ _id: gameId });

    if (gameExists === 0)
      return next(new AppError('Requested Resource not foud.', 404));

    // get game
    const data = await Game.find({ _id: gameId });
    const payload = <IResponse>{ data, status: 'success' };
    return res.status(200).send(payload);
  }
);

// admin only
export const createGame = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    // create game
    const { gameRate, name, startTime, endTime, resultTime, active } = <IGame>(
      req.body
    );
    const data = await Game.create({
      gameRate,
      name,
      startTime,
      endTime,
      resultTime,
      active,
    });
    // send game
    const payload = <IResponse>{ data, status: 'success' };
    return res.status(200).send(payload);
  }
);

export const updateGame = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    // get the game to update
    const { gameId } = req.params;
    const gameExists = await Game.countDocuments({ _id: gameId });

    if (gameExists === 0)
      return next(new AppError('Requested Resource not foud.', 404));

    // update game
    const { gameRate, name, startTime, endTime, resultTime, active } = <IGame>(
      req.body
    );
    const data = await Game.findByIdAndUpdate(
      gameId,
      {
        gameRate,
        name,
        startTime,
        endTime,
        resultTime,
        active,
      },
      { new: true }
    );
    // send game
    const payload = <IResponse>{ data, status: 'success' };
    return res.status(200).send(payload);
  }
);

export const deleteGame = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    // get the game
    const { gameId } = req.params;
    const gameExists = await Game.countDocuments({ _id: gameId });

    if (gameExists === 0)
      return next(new AppError('Requested Resource not foud.', 404));

    // delete game
    const data = await Game.findByIdAndDelete(gameId);
    // send game
    const payload = <IResponse>{ data, status: 'success' };
    return res.status(200).send(payload);
  }
);
