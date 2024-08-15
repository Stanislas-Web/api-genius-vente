
const { News } = require("../models/news.model");

module.exports.createNews = async (req, res) => {
  const {
    news,
    status,
  } = req.body;

  const newsLine = new News({
    news: news,
    status: status,
  });

  const result = await newsLine.save();

  return res.status(200).send({
    message: "Save news",
    data: result,
  });
};

module.exports.getAllNews = async (req, res) => {
  const result = await News.findOne();

  return res.status(200).send(result);
};
