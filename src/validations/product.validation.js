const Joi = require('joi');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().trim().min(3).required(),
    extraFields: Joi.array().items(
      Joi.object().keys({
        fieldName: Joi.string().trim().min(2).required(),
        fieldValue: Joi.string().trim().min(2).required(),
      })
    ),
  }),
};

module.exports = {
  createProduct,
};
