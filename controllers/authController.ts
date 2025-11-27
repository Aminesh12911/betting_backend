import { Request, Response, NextFunction } from 'express';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import ConvertToken from '../utils/convertTokens';

import User from '../models/userModel';
import IResponse from '../types/Response';

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if creds provided
    const { username, password } = req.body;
    if (!username || !password)
      return next(new AppError('Please provide username and password', 401));

    // send token if username and password exists
    const user = await User.findOne({ username, password });
    if (!user)
      return next(new AppError('username and password may be incorrect', 401));

    // update lastLogin time
    user.lastLogin = new Date(Date.now());
    await user.save();

    const payload = <IResponse>{
      message: 'success',
      data: new ConvertToken(`${username}:${password}`).toBase64(),
    };
    return res.status(200).json(payload);
  }
);

export default loginUser;
