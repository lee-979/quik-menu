const { boolean } = require('joi');
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const transactionSchema = mongoose.Schema(
  {
    amount: {
      type: String,
      required: true,
      trim: true,
    },
    payoutSuccess: {
      type: Boolean,
      default: false,
    },
    virtualAccount: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'virtualAccount',
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
    },
    metaData: {
      type: Object,
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

/**
 * @typedef Transaction
 */
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
