const { Option } = require('../models/option.model');

// Créer une nouvelle option
exports.createOption = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { name } = req.body;

    const option = new Option({
      name,
      companyId
    });

    await option.save();

    res.status(201).json({
      message: 'Option créée avec succès',
      data: option
    });
  } catch (error) {
    console.error('Error creating option:', error);
    res.status(500).json({
      message: 'Erreur lors de la création de l\'option',
      error: error.message
    });
  }
};

// Récupérer toutes les options
exports.getAllOptions = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { active, page = 1, limit = 10 } = req.query;

    const filter = { companyId };
    
    // Filtre par statut actif si spécifié
    if (active !== undefined) {
      filter.active = active === 'true';
    }

    const options = await Option.find(filter)
      .select('name active')
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Option.countDocuments(filter);

    res.status(200).json({
      message: 'Options récupérées avec succès',
      data: options,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting options:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des options',
      error: error.message
    });
  }
};

// Récupérer une option par ID
exports.getOptionById = async (req, res) => {
  try {
    const companyId = req.companyId;
    const optionId = req.params.id;

    const option = await Option.findOne({ _id: optionId, companyId });

    if (!option) {
      return res.status(404).json({
        message: 'Option non trouvée'
      });
    }

    res.status(200).json({
      message: 'Option récupérée avec succès',
      data: option
    });
  } catch (error) {
    console.error('Error getting option by ID:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération de l\'option',
      error: error.message
    });
  }
};

// Mettre à jour une option
exports.updateOption = async (req, res) => {
  try {
    const companyId = req.companyId;
    const optionId = req.params.id;
    const { name, active } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (active !== undefined) updateData.active = active;

    const option = await Option.findOneAndUpdate(
      { _id: optionId, companyId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!option) {
      return res.status(404).json({
        message: 'Option non trouvée'
      });
    }

    res.status(200).json({
      message: 'Option mise à jour avec succès',
      data: option
    });
  } catch (error) {
    console.error('Error updating option:', error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de l\'option',
      error: error.message
    });
  }
};

// Supprimer une option
exports.deleteOption = async (req, res) => {
  try {
    const companyId = req.companyId;
    const optionId = req.params.id;

    const option = await Option.findOneAndDelete({ _id: optionId, companyId });

    if (!option) {
      return res.status(404).json({
        message: 'Option non trouvée'
      });
    }

    res.status(200).json({
      message: 'Option supprimée avec succès'
    });
  } catch (error) {
    console.error('Error deleting option:', error);
    res.status(500).json({
      message: 'Erreur lors de la suppression de l\'option',
      error: error.message
    });
  }
};

// Basculer le statut actif/inactif d'une option
exports.toggleOptionStatus = async (req, res) => {
  try {
    const companyId = req.companyId;
    const optionId = req.params.id;

    const option = await Option.findOne({ _id: optionId, companyId });

    if (!option) {
      return res.status(404).json({
        message: 'Option non trouvée'
      });
    }

    option.active = !option.active;
    await option.save();

    res.status(200).json({
      message: `Option ${option.active ? 'activée' : 'désactivée'} avec succès`,
      data: option
    });
  } catch (error) {
    console.error('Error toggling option status:', error);
    res.status(500).json({
      message: 'Erreur lors du changement de statut de l\'option',
      error: error.message
    });
  }
};

// Récupérer les options actives
exports.getActiveOptions = async (req, res) => {
  try {
    const companyId = req.companyId;

    const options = await Option.find({ companyId, active: true })
      .select('name')
      .sort({ name: 1 });

    res.status(200).json({
      message: 'Options actives récupérées avec succès',
      data: options
    });
  } catch (error) {
    console.error('Error getting active options:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des options actives',
      error: error.message
    });
  }
};

// Récupérer les options par entreprise (companyId)
exports.getOptionsByCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId || req.companyId;
    const { active } = req.query;

    const filter = { companyId };
    
    // Filtre par statut actif si spécifié
    if (active !== undefined) {
      filter.active = active === 'true';
    }

    const options = await Option.find(filter)
      .select('name active')
      .sort({ name: 1 });

    res.status(200).json({
      message: 'Options de l\'entreprise récupérées avec succès',
      data: options,
      count: options.length
    });
  } catch (error) {
    console.error('Error getting options by company:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des options de l\'entreprise', 
      error: error.message 
    });
  }
};
