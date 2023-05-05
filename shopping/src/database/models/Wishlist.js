const mongoose = require("mongoose");

const wishSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true },
    products: [
      {
        _id: { type: mongoose.Types.ObjectId, ref: "product", required: true },
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

module.exports = mongoose.model("wishlist", wishSchema);
