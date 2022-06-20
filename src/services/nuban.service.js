const fetch = require('node-fetch');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { VirtualAccount, User, Transaction } = require('../models');
const Mongoose = require('mongoose');

/**
 * Create a product
 * @param {Object} data - Request data
 * @returns {Promise<Object>}
 */
const generateVirtualAccount = async (data) => {
  const response = await fetch(`${config.nuban.provider_base_url}/v3/virtual-account-numbers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.nuban.authorization_token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  if (!response.ok || responseData?.data?.response_code !== '02')
    throw new ApiError(httpStatus.BAD_REQUEST, `Error generating a virtual account: ${responseData.message}`);

  return responseData.data;
};

const getUserVirtualAccount = async (userId) => {
  const virtualAccount = await VirtualAccount.findOne({
    user: userId,
  });

  if (!virtualAccount) throw new ApiError(httpStatus.NOT_FOUND, 'No virtual account found');

  return {
    accountNumber: virtualAccount.accountNumber,
    accountBank: virtualAccount.bankName,
  };
};

const webhook = async (data) => {
  if (data.event !== 'charge.completed') {
    return;
  }

  const chargeData = data.data;
  const user = await User.findOne({
    username: chargeData.tx_ref,
  });

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Record not found');

  const transaction = new Transaction({
    amount: chargeData.amount,
    payoutSuccess: false,
    user: user._id,
  });
  await transaction.save();

  return payout(user._id, transaction, chargeData.amount);
};
const payout = async (userId, transaction, amount) => {
  const virtualAccount = await VirtualAccount.findOne({
    user: userId,
  });

  if (!virtualAccount) throw new ApiError(httpStatus.NOT_FOUND, 'No virtual account found');

  const payoutPayload = {
    account_bank: virtualAccount.physicalBankName,
    account_number: virtualAccount.physicalAccountNumber,
    amount,
    currency: 'NGN',
    debit_currency: 'NGN',
    narration: 'Payment from virtual account',
    reference: Mongoose.Types.ObjectId(),
  };

  const url = `${config.nuban.provider_base_url}/v3/transfers`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.nuban.authorization_token}`,
    },
    body: JSON.stringify(payoutPayload),
  });

  const result = await response.json();
  if (response.ok) {
    transaction.payoutSuccess = true;
    transaction.metaData = result;
    await transaction.save();
    return result;
  } else {
    transaction.payoutSuccess = false;
    transaction.metaData = result;
    await transaction.save();
    throw new Error(result.message);
  }
};

const fetchTransactions = async (userId) => {
  return Transaction.find({
    user: userId,
  });
};

module.exports = {
  generateVirtualAccount,
  getUserVirtualAccount,
  webhook,
  fetchTransactions,
};
