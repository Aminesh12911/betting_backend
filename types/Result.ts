import { Document, Types } from 'mongoose';

export default interface Result extends Document {
  game: Types.ObjectId | undefined;
  number: string;
  resultAt: Date;
}
