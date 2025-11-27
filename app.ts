import express from 'express';
import morgan from 'morgan';

import userRouter from './routes/userRouter';
import authRouter from './routes/authRouter';
import configRouter from './routes/configRouter';
import staticRouter from './routes/staticRouter';
import transactionRouter from './routes/transactionRouter';
import offerRouter from './routes/offerRouter';
import gameRouter from './routes/gameRouter';
import bidRouter from './routes/bidRoutes';
import resultRouter from './routes/resultRouter';
import winlistRouter from './routes/winlistRouter';
import notificationRouter from './routes/notificationRouter';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/config', configRouter);
app.use('/api/v1', authRouter);
app.use('/api/v1/static', staticRouter);
app.use('/api/v1/transaction', transactionRouter);
app.use('/api/v1/offer', offerRouter);
app.use('/api/v1/game', gameRouter);
app.use('/api/v1/bid', bidRouter);
app.use('/api/v1/result', resultRouter);
app.use('/api/v1/winlist', winlistRouter);
app.use('/api/v1/notification', notificationRouter);

// static html page
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/site/index.html`);
});

app.get('/account/delete', (req, res) => {
  res.sendFile(`${__dirname}/public/delete/index.html`);
});

// if no router handled the request its a 404 error
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server.`, 404));
});

// catch erer
app.use(globalErrorHandler);
export default app;
