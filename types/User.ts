import { Document } from 'mongoose';

export interface AccountDetails {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  upiID: string;
}

export interface ExtraCashDetails {
  referralBonus: number;
  offerBonus: number;
}

export default interface User extends Document {
  name: string;
  username: string;
  phone: number;
  password: string;
  referredCode: string;
  balance: number;
  isAdmin: boolean;
  lastLogin: Date;
  accountDetails: AccountDetails;
  extraCash: ExtraCashDetails;
  // eslint-disable-next-line @typescript-eslint/ban-types
  validatePassword: Function;
}
