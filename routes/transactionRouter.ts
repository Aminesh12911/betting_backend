import express from 'express';

import {
  createTransaction,
  settleDebit,
  getTransaction,
  deleteWithdrawReq,
} from '../controllers/transactionController';

const router = express.Router();

router.route('/').post(createTransaction).get(getTransaction);
router.route('/delete/:txnId').post(deleteWithdrawReq).get(getTransaction); // info: can also use .delete()
router.route('/settleDebit/:id').put(settleDebit);

export default router;
