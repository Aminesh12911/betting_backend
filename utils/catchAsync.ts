import { Request, Response, NextFunction } from 'express';
import IRequestExtended from '../types/Requet';

interface IReqParams {
  (
    arg0: Request | IRequestExtended,
    arg1: Response,
    arg2: NextFunction
  ): Promise<any>;
}

export default (fn: IReqParams) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error: Error) => next(error));
  };
