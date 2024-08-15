
const { Image } = require("../models/image.model");

module.exports.createImage = async (req, res) => {
  const {
    url,
    title,
    link,
    inTheApp,
  } = req.body;

  const image = new Image({
    url: url,
    title: title,
    link: link,
    inTheApp: inTheApp
  });

  const result = await image.save();

  return res.status(200).send({
    message: "Save image",
    data: result,
  });
};

module.exports.getAllImage = async (req, res) => {
  const result = await Image.find();

  return res.status(200).send(result);
};
