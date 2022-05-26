const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
      unique: true, // only one product per user for now
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    extraFields: [
      {
        fieldName: {
          type: String,
          required: true,
        },
        fieldValue: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

productSchema.statics.isSlugTaken = async function (userId, slug) {
  const product = await this.findOne({ user: userId, slug });
  return !!product;
};

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
