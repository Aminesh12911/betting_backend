/* eslint-disable quotes */
import mongoose from 'mongoose';
import validator from 'validator';

import IUser, { AccountDetails } from '../types/User';

const AccountSchema = new mongoose.Schema<AccountDetails>({
  accountNumber: String,
  bankName: String,
  ifscCode: String,
  upiID: String,
});

const extraCashSchema = new mongoose.Schema({
  referralBonus: {
    type: Number,
    default: 0,
  },
  offerBonus: {
    type: Number,
    default: 0,
  },
});

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, 'Name should have >=3 characters'],
      maxLength: [30, 'Name should have <30 characters'],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isAlphanumeric, 'Enter only characters and numbers'],
      lowercase: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: (val: number) => val.toString().length === 10,
        message: (val: any) => `${val.value} has to be 10 digits`,
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [4, 'Password needs to be atleast 4 characters long.'],
      select: false,
    },
    referredCode: {
      type: String,
      required: false,
    },
    balance: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    accountDetails: {
      type: AccountSchema,
      // default: <AccountDetails>{}
    },
    extraCash: extraCashSchema,
  },
  { timestamps: true }
);

userSchema.methods.validatePassword = (
  candidatePassword: string,
  userPassword: string
): boolean => candidatePassword === userPassword;

export default mongoose.model<IUser>('User', userSchema);
