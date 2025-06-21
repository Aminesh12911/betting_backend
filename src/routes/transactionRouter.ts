import express from "express";
import * as transactionController from '../controllers/transactionController';

const router = express.Router();

router
  .route('/credit')
  .post(transactionController.creditTransactionrequest);
  
router
.route('/debit')
.post(transactionController.withdrawTransactionrequest);

  export default router;