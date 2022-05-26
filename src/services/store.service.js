const httpStatus = require('http-status');
const { Store, VirtualAccount, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateVirtualAccount } = require('./nuban.service');

/**
 * Create a store
 * @param {string} name - Store name
 * @param {string} userId - User's object id
 * @returns {Promise<Store>}
 */
const createStore = async (userId, name) => {
  if (await Store.hasUser(userId)) throw new ApiError(httpStatus.CONFLICT, 'User has an existing store');

  return Store.create({ name, user: userId });
};

const addVirtualAccount = async (user, bvn, accountNumber, accountBank) => {
  if (await VirtualAccount.hasUser(user._id))
    throw new ApiError(httpStatus.CONFLICT, 'User has already generated a virtual account');

  const response = await generateVirtualAccount({
    email: user.email,
    is_permanent: true,
    tx_ref: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    narration: `${user.firstname} ${user.lastname}`,
    bvn,
  });

  const virtualAccount = await VirtualAccount.create({
    accountNumber: response.account_number,
    bankName: response.bank_name,
    physicalAccountNumber: accountNumber,
    physicalBankName: accountBank,
    user: user._id,
    orderRef: response.order_ref,
    txRef: user.username,
    metadata: response,
  });

  await User.findOneAndUpdate(
    {
      user: user._id,
    },
    { hasGeneratedVirtualNumber: true }
  );

  return virtualAccount;
};

module.exports = {
  createStore,
  addVirtualAccount,
};
