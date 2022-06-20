const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { transactionService } = require('../services');

const getVirtualAccount = catchAsync(async (req, res) => {
  const transaction = await transactionService.getUserVirtualAccount(req.user._id);
  res.status(httpStatus.OK).json(transaction);
});

const getTransactions = catchAsync(async (req, res) => {
  const transaction = await transactionService.fetchTransactions(req.user._id);
  res.status(httpStatus.OK).json(transaction);
});

const webhook = catchAsync(async (req, res) => {
  const transaction = await transactionService.webhook(req.body);
  res.status(httpStatus.OK).json(transaction);
});

module.exports = {
  getVirtualAccount,
  webhook,
  getTransactions,
};
