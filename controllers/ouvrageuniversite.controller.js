
const { OuvrageUniversite } = require("../models/ouvrageuniversite.model");

module.exports.createOuvrageUniversite = async (req, res) => {
  const {
    titreOuvrage,
    descriptionOuvrage,
    imageOuvrage,
    lienOuvrage,
    paysOuvrage,
    auteurOuvrage,
    categoryOuvrage,
    typeOuvrage,
    prixOuvrage,
    faculteOuvrage
  } = req.body;

  const ouvrage = new OuvrageUniversite({
    titreOuvrage: titreOuvrage,
    descriptionOuvrage: descriptionOuvrage,
    imageOuvrage: imageOuvrage,
    lienOuvrage: lienOuvrage,
    paysOuvrage: paysOuvrage,
    auteurOuvrage: auteurOuvrage,
    categoryOuvrage: categoryOuvrage,
    typeOuvrage: typeOuvrage,
    prixOuvrage: prixOuvrage,
    faculteOuvrage: faculteOuvrage
  });

  const result = await ouvrage.save();

  return res.status(200).send({
    message: "Save Ouvrage faculté",
    data: result,
  });
};

module.exports.getAllOuvrageFaculte = async (req, res) => {
  const result = await OuvrageUniversite.find();

  return res.status(200).send({
    message: "get all ouvrages facultes",
    data: result,
  });
};



module.exports.getAllOuvrageFaculteById = async (req, res) => {
  const idFaculte = req.params.idFaculte;

  console.log(idFaculte);

  try {
    const result = await OuvrageUniversite.find({ faculteOuvrage: idFaculte });

  

    console.log(result);

    if (!result) {
      return res.status(404).send({
        message: "No faculties found for the given university ID",
      });
    }

    return res.status(200).send({
      message: "ouvrages retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "An error occurred while retrieving faculties",
      error: error.message,
    });
  }
};
