
const { Faculte } = require("../models/faculte.model");

module.exports.createFaculte = async (req, res) => {
  const {
    name,
    description,
    universite
  } = req.body;

  const faculte = new Faculte({
    name: name,
    description: description,
    universite: universite
  });

  const result = await faculte.save();

  return res.status(200).send({
    message: "Save facuté",
    data: result,
  });
};

module.exports.getAllFaculteByUniversite = async (req, res) => {
  const idUniversite = req.params.idUniversite;

  try {
    const result = await Faculte.find({ universite: idUniversite });

    if (!result) {
      return res.status(404).send({
        message: "No faculties found for the given university ID",
      });
    }

    return res.status(200).send({
      message: "Faculties retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "An error occurred while retrieving faculties",
      error: error.message,
    });
  }
};




