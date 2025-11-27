import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

import User from '../models/userModel';

import IUser from '../types/User';
import IRequestExtended from '../types/Requet';
import IResponse from '../types/Response';

export const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await User.find({}).select('+password');
    const payload: IResponse = { status: 'success', data };
    return res.status(200).json(payload);
  }
);

export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // create the user if doesn't exists
    const { name, username, phone, password, referredCode, accountDetails } = <
      IUser
    >req.body;
    const user = await User.create({
      name,
      username,
      phone,
      password,
      referredCode,
      accountDetails,
    });
    const payload: IResponse = { status: 'success', data: user };
    return res.status(200).json(payload);
  }
);

export const updateuser = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    let { username } = req.params;
    username = username.toLowerCase();

    // find user if exists
    const userExists = await User.countDocuments({ username });
    if (userExists === 0)
      return next(new AppError('Requested Resource not foud.', 404));

    // allow access only changing its own or isAdmin
    if (!(req?.user?.isAdmin || req?.user?.username === username))
      return next(
        new AppError('You do not have enough rights to access this route.', 403)
      );

    // update user
    const { name, password, accountDetails, balance } = <IUser>req.body;
    // update balance only if admin is doing
    if (balance && !req?.user?.isAdmin)
      return next(
        new AppError('You do not have enough rights for this operation.', 403)
      );

    const user = await User.findOneAndUpdate(
      { username },
      { name, password, accountDetails, balance },
      { new: true, runValidators: true }
    );
    const payload: IResponse = { status: 'success', data: user };
    return res.status(200).json(payload);
  }
);

export const deleteUser = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    let { username } = req.params;
    username = username.toLowerCase();

    // find user if exists
    const userExists = await User.countDocuments({ username });
    if (userExists === 0)
      return next(new AppError('Requested Resource not foud.', 404));

    // allow access only changing its own or isAdmin
    if (!(req?.user?.isAdmin || req?.user?.username === username))
      return next(
        new AppError('You do not have enough rights to access this route.', 403)
      );

    // delete user
    const user = await User.findOneAndDelete({ username });
    const payload: IResponse = { status: 'success', data: user };
    return res.status(200).json(payload);
  }
);

export const getUser = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    let { username } = req.params;
    username = username.toLowerCase();

    // find user if exists
    const userExists = await User.countDocuments({ username });
    if (userExists === 0)
      return next(new AppError('Requested Resource not foud.', 404));

    // allow access only changing its own or isAdmin
    if (!(req?.user?.isAdmin || req?.user?.username === username))
      return next(
        new AppError('You do not have enough rights to access this route.', 403)
      );

    // get the use
    const user = await User.findOne({ username }).select('+password');
    const payload: IResponse = { status: 'success', data: user };
    return res.status(200).json(payload);
  }
);
