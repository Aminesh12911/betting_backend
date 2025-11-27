import { Document } from 'mongoose';

export default interface Offer extends Document {
  addValue: number;
  extraValue: number;
}
