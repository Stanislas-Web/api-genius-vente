
const { VersionAgent } = require("../models/versionAgent.model");

module.exports.createVersionAgent = async (req, res) => {
  const {
    android,
    ios,
  } = req.body;

  const version = new VersionAgent({
    android: android,
    ios: ios,
  });

  const result = await version.save();

  return res.status(200).send({
    message: "Save version Agent",
    data: result,
  });
};

module.exports.getAllVersionAgent = async (req, res) => {
  const result = await VersionAgent.findOne();

  return res.status(200).send(result);
};
