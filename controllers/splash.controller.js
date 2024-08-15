
const { Splash } = require("../models/splash.model");

module.exports.createSplash = async (req, res) => {
  const {
    image,
    libele
  } = req.body;

  const splash = new Splash({
    image: image,
    libele: libele,
  });

  const result = await splash.save();

  return res.status(200).send({
    message: "Save Splash",
    data: result,
  });
};

module.exports.getAllSplash = async (req, res) => {
  const result = await Splash.find();

  return res.status(200).send({
    message: "get all Splash",
    data: result,
  });
};
