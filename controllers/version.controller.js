
const { Version } = require("../models/version.model");

module.exports.createVersion = async (req, res) => {
  const {
    android,
    ios,
  } = req.body;

  const version = new Version({
    android: android,
    ios: ios,
  });

  const result = await version.save();

  return res.status(200).send({
    message: "Save version",
    data: result,
  });
};

module.exports.getAllVersion = async (req, res) => {
  const result = await Version.findOne();

  return res.status(200).send(result);
};
