import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import app from './app';

dotenv.config();
mongoose.set('strictQuery', true);

let db;
if (process.env.NODE_ENV === 'production') db = process.env.DB_REMOTE_PROD;
else db = process.env.DB_LOCAL_URL;

mongoose.connect(db || 'mongodb://127.0.0.1:27017/betting-local').then(() => {
  console.log('Connection to DB successful.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running in: ${process.env.NODE_ENV} mode`);
  console.log(`Server is runnig on port: ${port}`);
});
