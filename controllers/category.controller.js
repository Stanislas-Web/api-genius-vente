
const { Category } = require("../models/category.model");

module.exports.createCategory = async (req, res) => {
  const {
    image,
    libele
  } = req.body;

  const category = new Category({
    image: image,
    libele: libele,
  });

  const result = await category.save();

  return res.status(200).send({
    message: "Save Category",
    data: result,
  });
};

module.exports.getAllCategories = async (req, res) => {
  const result = await Category.find();

  return res.status(200).send({
    message: "get all Categories",
    data: result,
  });
};
