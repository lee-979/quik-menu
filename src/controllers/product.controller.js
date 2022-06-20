const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

const createProduct = catchAsync(async (req, res) => {
  const store = await productService.createProduct(req.body.name, req.body.extraFields, req.user._id);
  res.status(httpStatus.CREATED).json(store);
});

module.exports = {
  createProduct,
};
