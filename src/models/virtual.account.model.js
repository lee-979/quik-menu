const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const virtualAccountSchema = mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    physicalAccountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    physicalBankName: {
      type: String,
      required: true,
      trim: true,
    },
    txRef: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    orderRef: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
      unique: true, // only one account per user for now
    },
    metadata: {
      type: Object,
      private: true,
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
virtualAccountSchema.plugin(toJSON);
virtualAccountSchema.plugin(paginate);

virtualAccountSchema.statics.hasUser = async function (userId) {
  const account = await this.findOne({ user: userId });
  return !!account;
};
/**
 * @typedef VirtualAccount
 */
const VirtualAccount = mongoose.model('VirtualAccount', virtualAccountSchema);

module.exports = VirtualAccount;
