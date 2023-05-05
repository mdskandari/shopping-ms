const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String },
    customerId: { type: String },
    amount: { type: Number },
    status: { type: String },
    txnId: { type: String },
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

module.exports = mongoose.model("order", OrderSchema);
