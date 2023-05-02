const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true },
    items: [
      {
        product: {
          _id: { type: String, required: true },
          name: { type: String, required: true },
          desc: { type: String },
          type: { type: String },
          unit: { type: Number },
          banner: { type: String },
          price: { type: Number },
          suplier: { type: String },
        },
        unit: { type: Number, require: true },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.Model("cart", cartSchema);
