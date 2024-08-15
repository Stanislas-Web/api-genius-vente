const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", DeliverySchema);