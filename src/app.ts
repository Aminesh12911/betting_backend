import express from 'express';
import userRouter from './routes/userRouter';
import authRouter from './routes/authRouter';
import transactionRouter from './routes/transactionRouter';

 const app = express();
 app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1', authRouter);
app.use('/api/v1/transactions', transactionRouter);

 export default app;