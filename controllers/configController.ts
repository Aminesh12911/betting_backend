import { Response, NextFunction } from 'express';

import catchAsync from '../utils/catchAsync';

import AppConfig from '../models/appConfigModel';

import IRequestExtended from '../types/Requet';
import IResponse from '../types/Response';
import IAppInfo from '../types/AppConfig';

export const getConfig = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const data = await AppConfig.findOne({});
    const payload = <IResponse>{
      status: 'success',
      data,
    };
    return res.status(200).json(payload);
  }
);

export const updateConfig = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const appInfo = <IAppInfo>req.body;
    delete appInfo.text;
    delete appInfo.banner;

    const data = await AppConfig.findOneAndUpdate({}, appInfo, {
      new: true,
      runValidators: true,
    });

    const payload = <IResponse>{
      status: 'success',
      data,
    };
    return res.status(200).json(payload);
  }
);

export const createConfig = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const data = await AppConfig.findOne({});
    if (data) return updateConfig(req, res, next);

    const appInfo = <IAppInfo>req.body;
    const ndata = await AppConfig.create(appInfo);

    const payload = <IResponse>{
      status: 'success',
      data: ndata,
    };
    return res.status(200).json(payload);
  }
);
