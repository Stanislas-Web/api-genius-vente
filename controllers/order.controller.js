
const { Order } = require("../models/order.model");

module.exports.createOrder = async (req, res) => {

  // const newOrder = new Order(req.body);

  const order = new Order(req.body);

  const result = await order.save();



  return res.status(200).send({
    message: "Save order",
    data: result,
  });
};

module.exports.getAllOrderByUserId = async (req, res) => {

  const orders = await Order.find({ userId: req.params.userId });


  return res.status(200).send({
    message: "get all Order by ID ",
    data: orders.reverse(),
  });
};

module.exports.getAllOrder = async (req, res) => {

  const orders = await Order.find();
  

  return res.status(200).send({
    message: "get all Order",
    data: orders.reverse(),
  });
};
