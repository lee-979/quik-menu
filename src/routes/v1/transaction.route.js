const express = require('express');
const auth = require('../../middlewares/auth');
const transactionController = require('../../controllers/transaction.controller');

const router = express.Router();

router.route('/').get(auth(), transactionController.getTransactions);
router.route('/account').get(auth(), transactionController.getVirtualAccount);
router.route('/webhook').post(transactionController.webhook);

module.exports = router;
