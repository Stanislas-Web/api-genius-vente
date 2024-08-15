const mongoose = require("mongoose");
const Double = require('@mongoosejs/double');
const {Schema, model} = require('mongoose');

const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String },
        nameProduct: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Double, required: true },
      },
    ],
    subTotal: { type: Double, required: true },
    totalToPay: { type: Double, required: true },
    deliveryPrice: { type: Double, required: true },
    paymentMode: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports.Order = model('Order', OrderSchema);
