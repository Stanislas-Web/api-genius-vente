const { Section } = require('../models/section.model');

// Créer une nouvelle section
exports.createSection = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { name } = req.body;

    const section = new Section({
      name,
      companyId
    });

    await section.save();

    res.status(201).json({
      message: 'Section créée avec succès',
      data: section
    });
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({
      message: 'Erreur lors de la création de la section',
      error: error.message
    });
  }
};

// Récupérer toutes les sections
exports.getAllSections = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { active, page = 1, limit = 10 } = req.query;

    const filter = { companyId };
    
    // Filtre par statut actif si spécifié
    if (active !== undefined) {
      filter.active = active === 'true';
    }

    const sections = await Section.find(filter)
      .select('name active')
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Section.countDocuments(filter);

    res.status(200).json({
      message: 'Sections récupérées avec succès',
      data: sections,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error getting sections:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des sections',
      error: error.message
    });
  }
};

// Récupérer une section par ID
exports.getSectionById = async (req, res) => {
  try {
    const companyId = req.companyId;
    const sectionId = req.params.id;

    const section = await Section.findOne({ _id: sectionId, companyId });

    if (!section) {
      return res.status(404).json({
        message: 'Section non trouvée'
      });
    }

    res.status(200).json({
      message: 'Section récupérée avec succès',
      data: section
    });
  } catch (error) {
    console.error('Error getting section by ID:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération de la section',
      error: error.message
    });
  }
};

// Mettre à jour une section
exports.updateSection = async (req, res) => {
  try {
    const companyId = req.companyId;
    const sectionId = req.params.id;
    const { name, active } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (active !== undefined) updateData.active = active;

    const section = await Section.findOneAndUpdate(
      { _id: sectionId, companyId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({
        message: 'Section non trouvée'
      });
    }

    res.status(200).json({
      message: 'Section mise à jour avec succès',
      data: section
    });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la section',
      error: error.message
    });
  }
};

// Supprimer une section
exports.deleteSection = async (req, res) => {
  try {
    const companyId = req.companyId;
    const sectionId = req.params.id;

    const section = await Section.findOneAndDelete({ _id: sectionId, companyId });

    if (!section) {
      return res.status(404).json({
        message: 'Section non trouvée'
      });
    }

    res.status(200).json({
      message: 'Section supprimée avec succès'
    });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({
      message: 'Erreur lors de la suppression de la section',
      error: error.message
    });
  }
};

// Basculer le statut actif/inactif d'une section
exports.toggleSectionStatus = async (req, res) => {
  try {
    const companyId = req.companyId;
    const sectionId = req.params.id;

    const section = await Section.findOne({ _id: sectionId, companyId });

    if (!section) {
      return res.status(404).json({
        message: 'Section non trouvée'
      });
    }

    section.active = !section.active;
    await section.save();

    res.status(200).json({
      message: `Section ${section.active ? 'activée' : 'désactivée'} avec succès`,
      data: section
    });
  } catch (error) {
    console.error('Error toggling section status:', error);
    res.status(500).json({
      message: 'Erreur lors du changement de statut de la section',
      error: error.message
    });
  }
};

// Récupérer les sections actives
exports.getActiveSections = async (req, res) => {
  try {
    const companyId = req.companyId;

    const sections = await Section.find({ companyId, active: true })
      .select('name')
      .sort({ name: 1 });

    res.status(200).json({
      message: 'Sections actives récupérées avec succès',
      data: sections
    });
  } catch (error) {
    console.error('Error getting active sections:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des sections actives',
      error: error.message
    });
  }
};

// Récupérer les sections par entreprise (companyId)
exports.getSectionsByCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId || req.companyId;
    const { active } = req.query;

    const filter = { companyId };
    
    // Filtre par statut actif si spécifié
    if (active !== undefined) {
      filter.active = active === 'true';
    }

    const sections = await Section.find(filter)
      .select('name active')
      .sort({ name: 1 });

    res.status(200).json({
      message: 'Sections de l\'entreprise récupérées avec succès',
      data: sections,
      count: sections.length
    });
  } catch (error) {
    console.error('Error getting sections by company:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des sections de l\'entreprise', 
      error: error.message 
    });
  }
};
