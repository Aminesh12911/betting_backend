import { Request, Response, NextFunction } from 'express';

import catchAsync from '../utils/catchAsync';

import Offer from '../models/offerModel';

import IOffer from '../types/Offer';
import IResponse from '../types/Response';
import AppError from '../utils/appError';
import sendNotification from '../utils/notifications';

export const getOffers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await Offer.find({});
    const payload = <IResponse>{ data, status: 'success' };
    return res.status(200).send(payload);
  }
);

export const createOffer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get values
    const { addValue, extraValue } = <IOffer>req.body;
    const offer = await Offer.create({ addValue, extraValue });

    // send noti on new offer
    sendNotification({
      topic: 'Client',
      title: 'New Add Balance Offer!',
      body: `Now get extra ${extraValue} points on recharge of Rs.${addValue}`,
    });
    const payload = <IResponse>{ data: offer, status: 'success' };
    return res.status(200).send(payload);
  }
);

export const deleteOffer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // find the offer and get rid of it
    const { id } = req.params;
    const offer = await Offer.findByIdAndRemove(id);

    if (!offer) return next(new AppError('Offer not found', 404));
    const payload = <IResponse>{ data: offer, status: 'success' };
    return res.status(200).send(payload);
  }
);
