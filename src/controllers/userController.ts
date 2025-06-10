import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import IUser from '../types/User';
import IResponse from '../types/Response';
import catchAsync from '../utils/catchAsync';





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