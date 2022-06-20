const Joi = require('joi');

const createStore = {
  body: Joi.object().keys({
    name: Joi.string().trim().min(3).required(),
  }),
};

const generateVirtualAccount = {
  body: Joi.object().keys({
    bvn: Joi.string().length(11).regex(/^\d+$/).required(),
    accountNumber: Joi.string().length(10).regex(/^\d+$/).required(),
    accountBank: Joi.number().positive().integer().raw().required(),
  }),
};
module.exports = {
  createStore,
  generateVirtualAccount,
};
