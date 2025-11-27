import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import catchAsync from '../utils/catchAsync';

import WinList from '../models/winlistModel';

import IResponse from '../types/Response';

export const getWinList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req;
    // @ts-ignore
    if (query.game) query.game = new Types.ObjectId(<string>query.game);
    // @ts-ignore
    if (query.user) query.user = new Types.ObjectId(<string>query.user);
    // @ts-ignore
    // if (query.result) query.result = new Types.ObjectId(<string>query.result);

    const data = await WinList.find(query).populate('user game');
    const payload = <IResponse>{ status: 'success', data };
    return res.status(200).send(payload);
  }
);

export default getWinList;
