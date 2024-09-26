
const { Category } = require("../models/category.model");

module.exports.createCategory = async (req, res) => {
  const {
    libele
  } = req.body;

  const category = new Category({
    libele: libele,
  });

  const result = await category.save();

  return res.status(200).send({
    message: "Save Category",
    data: result,
  });
};

module.exports.getAllCategories = async (req, res) => {
  const result = await Category.find();

  return res.status(200).send({
    message: "get all Categories",
    data: result,
  });
};

module.exports.saveManyCategories = async (req, res) => {
  try {
    // Supposons que les données sont envoyées dans le corps de la requête
    const { entreprises } = req.body;

    if (!entreprises || !Array.isArray(entreprises)) {
      return res.status(400).send({
        message: "Les données d'entrée sont invalides. Attendu un tableau d'entreprises.",
      });
    }

    // Transformez les données en objets Category
    const categories = entreprises.map(item => ({
      libele: item.libele
    }));

    // Utilisez insertMany pour sauvegarder plusieurs documents à la fois
    const result = await Category.insertMany(categories);

    return res.status(201).send({
      message: "Catégories sauvegardées avec succès",
      data: result,
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des catégories:', error);
    return res.status(500).send({
      message: "Une erreur est survenue lors de la sauvegarde des catégories",
      error: error.message
    });
  }
};



