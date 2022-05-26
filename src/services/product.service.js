const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a product
 * @param {string} name - Product name
 * @param {string} userId - User's object id
 * @returns {Promise<Product>}
 */
const createProduct = async (name, userId) => {
  let slug = name.toLowerCase().replaceAll(/\s/g, '_');

  if (slug.length > 20) {
    slug = `${slug.slice(0, 10)}${slug.slice(-10)}`;
  }

  if (await Product.isSlugTaken(userId, slug))
    throw new ApiError(httpStatus.CONFLICT, 'A product with a similar name exist, please choose a different name');

  return Product.create({ name, slug, user: userId });
};

module.exports = {
  createProduct,
};
