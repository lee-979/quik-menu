const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { storeService } = require('../services');

const createStore = catchAsync(async (req, res) => {
  const store = await storeService.createStore(req.user._id, req.body.name);
  res.status(httpStatus.CREATED).json(store);
});

const addVirtualAccount = catchAsync(async (req, res) => {
  const store = await storeService.addVirtualAccount(req.user, req.body.bvn, req.body.accountNumber, req.body.accountBank);
  res.status(httpStatus.CREATED).json(store);
});

module.exports = {
  createStore,
  addVirtualAccount,
};
