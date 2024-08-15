
const { Universite } = require("../models/universite.model");

module.exports.createUniversite = async (req, res) => {
  const {
    name,
    description,
    category,
    image,
  } = req.body;

  const universite = new Universite({
    name: name,
    description: description,
    category: category,
    image: image,
  });

  const result = await universite.save();

  return res.status(200).send({
    message: "Save universite",
    data: result,
  });
};

module.exports.getAllUniversite = async (req, res) => {
  const result = await Universite.find();

  return res.status(200).send({
    message: "get all universites",
    data: result,
  });
};
