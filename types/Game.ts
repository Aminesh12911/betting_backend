import { Document } from 'mongoose';

export default interface Game extends Document {
  name: string;
  startTime: Date;
  endTime: Date;
  resultTime: Date;
  gameRate: number;
  active: boolean;
}
