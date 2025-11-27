import { Request, Response, NextFunction } from 'express';

import catchAsync from '../utils/catchAsync';
import Offer from '../models/offerModel';

import IOffer from '../types/Offer';
import IResponse from '../types/Response';
import AppError from '../utils/appError';

export const getOffers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await Offer.find({});
    const payload: IResponse = { data, status: 'success' };
    return res.status(200).send(payload);
  }
);

export const createOffer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { addValue, extraValue } = req.body as IOffer;

    const offer = await Offer.create({ addValue, extraValue });

    // Firebase notification removed

    const payload: IResponse = { data: offer, status: 'success' };
    return res.status(200).send(payload);
  }
);

export const deleteOffer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const offer = await Offer.findByIdAndRemove(id);

    if (!offer) return next(new AppError('Offer not found', 404));

    const payload: IResponse = { data: offer, status: 'success' };
    return res.status(200).send(payload);
  }
);
