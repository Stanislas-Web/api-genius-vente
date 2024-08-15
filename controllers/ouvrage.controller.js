
const { Ouvrage } = require("../models/ouvrage.model");

module.exports.createOuvrage = async (req, res) => {
  const {
    titreOuvrage,
    descriptionOuvrage,
    imageOuvrage,
    lienOuvrage,
    paysOuvrage,
    auteurOuvrage,
    categoryOuvrage,
    typeOuvrage,
    prixOuvrage 
  } = req.body;

  const ouvrage = new Ouvrage({
    titreOuvrage: titreOuvrage,
    descriptionOuvrage: descriptionOuvrage,
    imageOuvrage: imageOuvrage ,
    lienOuvrage: lienOuvrage,
    paysOuvrage: paysOuvrage,
    auteurOuvrage: auteurOuvrage,
    categoryOuvrage: categoryOuvrage,
    typeOuvrage: typeOuvrage,
    prixOuvrage: prixOuvrage 
  });

  const result = await ouvrage.save();

  return res.status(200).send({
    message: "Save Ouvrage",
    data: result,
  });
};

module.exports.getAllOuvrage = async (req, res) => {
  const result = await Ouvrage.find();

  return res.status(200).send({
    message: "get all ouvrages",
    data: result,
  });
};
