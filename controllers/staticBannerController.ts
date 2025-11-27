import { Response, NextFunction } from 'express';
import * as fs from 'fs';

import { Types } from 'mongoose';
import path from 'path';
import catchAsync from '../utils/catchAsync';

import AppConfig from '../models/appConfigModel';

import IRequestExtended from '../types/Requet';
import IResponse from '../types/Response';
import { IBanner } from '../types/AppConfig';
import AppError from '../utils/appError';

export const saveImage = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    // get the image details
    const body = <IBanner>req.body;

    // saving in db
    const config = await AppConfig.findOne({});
    config?.banner?.push(<IBanner>{
      ...body,
    });
    await config?.save();

    // return config.banner
    const payload = <IResponse>{
      status: 'success',
      data: config?.banner,
    };
    return res.status(200).send(payload);
  }
);

export const deleteImage = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    // get the image details
    const { id } = req.params;
    const config = await AppConfig.findOne({});
    const imgs = config?.banner?.filter((img) => img._id.equals(id));

    if (!imgs?.length)
      return next(new AppError('Requested file or resource not found.', 404));

    // removing in db
    config?.banner?.pull({ _id: id });
    await config?.save();

    // return config.banner
    const payload = <IResponse>{
      status: 'success',
      data: config?.banner,
    };
    return res.status(200).send(payload);
  }
);
