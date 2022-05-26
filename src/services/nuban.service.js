const fetch = require('node-fetch');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

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

module.exports = {
  generateVirtualAccount,
};
