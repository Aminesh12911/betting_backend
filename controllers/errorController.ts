import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';
import AppError from '../utils/appError';

import IResponse from '../types/Response';

const sendErrorDev = (err: AppError, res: Response) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    data: null,
    error: err,
    stack: err.stack,
  });

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    const payload: IResponse = {
      status: err.status,
      data: null,
      message: err.message,
    };
    return res.status(err.statusCode).json(payload);
  }

  // TDDO: add some logging lib or something
  console.error(`ERROR 💥 ${JSON.stringify(err)}: ${err.message}`);
  const payload: IResponse = {
    status: 'error',
    data: null,
    message: 'Something went wrong.',
  };
  return res.status(500).json(payload);
};

const handleCastErrorDB = (err: Error.CastError) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: Error.ValidationError) => {
  const message = `${err.message}`;
  return new AppError(message, 400);
};

const handleDuplicateKeyError = (err: any) => {
  const message = `${Object.keys(err.keyValue)} already exists.`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Unknown token. Please login.', 401);

const handleJWTTokenExpiredError = () =>
  new AppError('Token expred, Please login again.', 401);

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'CastError') err = handleCastErrorDB(err);
  else if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
  else if (err.name === 'JsonWebTokenError') err = handleJWTError();
  else if (err.name === 'TokenExpiredError') err = handleJWTTokenExpiredError();
  else if (err.name === 'MongoServerError' && err.code === 11000)
    err = handleDuplicateKeyError(err);
  else {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    err.message = err.message || 'Internal server error.';
  }
  if (process.env.NODE_ENV !== 'production') return sendErrorDev(err, res);
  return sendErrorProd(err, res);
};
