import { Request } from 'express';
import User from './User';

interface RequestExtended extends Request {
  user?: User;
}

export default RequestExtended;
