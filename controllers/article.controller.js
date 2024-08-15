
const { Article } = require("../models/article.model");

module.exports.createArticle = async (req, res) => {
  const {
    title,
    description,
    price,
    category,
    photoUrl,
    merchantPhotoUrl,
    merchantName,
    quantity,
  } = req.body;

  const article = new Article({
    title: title,
    description: description,
    price: price,
    category: category,
    photoUrl: photoUrl,
    merchantPhotoUrl: merchantPhotoUrl,
    merchantName: merchantName,
    quantity: quantity,
  });

  const result = await article.save();

  return res.status(200).send({
    message: "Save Article",
    data: result,
  });
};

module.exports.getAllArticles = async (req, res) => {
  const result = await Article.find();

  return res.status(200).send({
    message: "get all articles",
    data: result,
  });
};
