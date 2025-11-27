import { Response, NextFunction } from 'express';

import catchAsync from '../utils/catchAsync';

import AppConfig from '../models/appConfigModel';

import IRequestExtended from '../types/Requet';
import IResponse from '../types/Response';
import { IText } from '../types/AppConfig';

export const createText = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const body = <IText>req.body;

    // get the config and push text
    const config = await AppConfig.findOne({});
    config?.text?.push(body);
    await config?.save({ validateBeforeSave: true });

    // return config.text
    const payload = <IResponse>{
      status: 'success',
      data: config?.text,
    };
    return res.status(200).send(payload);
  }
);

export const deleteText = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const { textID } = req.params;

    // pull the text from config if exits
    const config = await AppConfig.findOne({});
    config?.text?.pull({ _id: textID });
    await config?.save();

    // return config.text
    const payload = <IResponse>{
      status: 'success',
      data: config?.text,
    };
    return res.status(200).send(payload);
  }
);
export const updateText = catchAsync(
  async (req: IRequestExtended, res: Response, next: NextFunction) => {
    const { textID } = req.params;
    const body = <IText>req.body;

    // pull the text from config if exits
    const config = await AppConfig.findOne({});
    config?.text?.id(textID)?.$set(body);
    await config?.save();

    // return config.text
    const payload = <IResponse>{
      status: 'success',
      data: config?.text,
    };
    return res.status(200).send(payload);
  }
);
