import { Response, NextFunction } from 'express';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import ConvertToken from '../utils/convertTokens';

import User from '../models/userModel';

import IRequestExtended from '../types/Requet';

export const validateUser = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    // get token details
    const { authorization } = req.headers;
    if (!(authorization && authorization.split(' ')[0] === 'Bearer'))
      return next(
        new AppError('No authorization token found, Please login again.', 401)
      );

    // if no token specified
    const token = authorization.split(' ')[1];
    if (!token) return next(new AppError('Not a valid token', 401));

    // convert base64 to utf-8
    const [username, password] = new ConvertToken(token).toUtf8();

    // check if user exists
    const user = await User.findOne({ username }).select('+password +isAdmin');
    if (!user)
      return next(new AppError('Authorization error, please login again', 401));

    // check if password is correct
    const isCorrect = user.validatePassword(password, user.password);
    if (!isCorrect)
      return next(new AppError('Username or password is incorrect', 401));

    // update lastLogin time
    user.lastLogin = new Date(Date.now());
    await user.save();

    // set the user data
    req.user = user;
    next();
  }
);

// use this middleware when you want route to be protected for admin only
export const validateAdminOnly = (
  req: IRequestExtended,
  res: Response,
  next: NextFunction
) => {
  if (!req?.user?.isAdmin)
    return next(
      new AppError('You do not have enough rights to access this route.', 403)
    );
  next();
};
