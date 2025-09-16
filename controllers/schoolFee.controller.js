const { SchoolFee } = require('../models/schoolFee.model');
const { Classroom } = require('../models/classroom.model');

// Créer un nouveau frais scolaire
exports.createSchoolFee = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { 
      label, 
      periodicity, 
      schoolYear, 
      currency, 
      amount, 
      classroomIds 
    } = req.body;

    // Validation des classroomIds
    if (!classroomIds || !Array.isArray(classroomIds) || classroomIds.length === 0) {
      return res.status(400).json({ 
        message: 'classroomIds est requis et doit être un tableau non vide' 
      });
    }

    // Vérifier que toutes les classes appartiennent à la même entreprise
    const classrooms = await Classroom.find({ 
      _id: { $in: classroomIds }, 
      companyId 
    });
    
    if (classrooms.length !== classroomIds.length) {
      return res.status(400).json({ 
        message: 'Une ou plusieurs classes non trouvées ou ne vous appartiennent pas' 
      });
    }

    const schoolFee = new SchoolFee({
      companyId,
      label,
      periodicity,
      schoolYear,
      currency,
      amount,
      classroomIds
    });

    await schoolFee.save();
    
    // Populate les classes
    await schoolFee.populate('classroomIds', 'name code schoolYear');
    
    res.status(201).json({ message: 'Frais scolaire créé avec succès', schoolFee });
  } catch (error) {
    console.error('Error creating school fee:', error);
    res.status(500).json({ message: 'Erreur lors de la création du frais scolaire', error });
  }
};

// Récupérer tous les frais scolaires avec filtres et pagination
exports.getAllSchoolFees = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { 
      page = 1, 
      limit = 20, 
      schoolYear, 
      classroomId, 
      active 
    } = req.query;

    // Construction du filtre
    const filter = { companyId };
    
    if (schoolYear) filter.schoolYear = schoolYear;
    if (active !== undefined) filter.active = active === 'true';
    
    // Pour classroomId, inclure les frais qui concernent cette classe
    if (classroomId) {
      filter.classroomIds = classroomId;
    }

    const skip = (page - 1) * limit;
    
    const schoolFees = await SchoolFee.find(filter)
      .populate('classroomIds', 'name code schoolYear')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SchoolFee.countDocuments(filter);

    res.status(200).json({
      schoolFees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching school fees:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des frais scolaires', error });
  }
};

// Récupérer un frais scolaire par ID
exports.getSchoolFeeById = async (req, res) => {
  try {
    const companyId = req.companyId;
    const schoolFee = await SchoolFee.findOne({ 
      _id: req.params.id, 
      companyId 
    }).populate('classroomIds', 'name code schoolYear');

    if (!schoolFee) {
      return res.status(404).json({ message: 'Frais scolaire non trouvé' });
    }

    res.status(200).json({ schoolFee });
  } catch (error) {
    console.error('Error fetching school fee:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du frais scolaire', error });
  }
};

// Mettre à jour un frais scolaire
exports.updateSchoolFee = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { classroomIds } = req.body;

    // Vérifier que toutes les classes appartiennent à la même entreprise si fournies
    if (classroomIds && Array.isArray(classroomIds) && classroomIds.length > 0) {
      const classrooms = await Classroom.find({ 
        _id: { $in: classroomIds }, 
        companyId 
      });
      
      if (classrooms.length !== classroomIds.length) {
        return res.status(400).json({ 
          message: 'Une ou plusieurs classes non trouvées ou ne vous appartiennent pas' 
        });
      }
    }

    const schoolFee = await SchoolFee.findOneAndUpdate(
      { _id: req.params.id, companyId },
      req.body,
      { new: true }
    ).populate('classroomIds', 'name code schoolYear');

    if (!schoolFee) {
      return res.status(404).json({ message: 'Frais scolaire non trouvé' });
    }

    res.status(200).json({ message: 'Frais scolaire mis à jour avec succès', schoolFee });
  } catch (error) {
    console.error('Error updating school fee:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du frais scolaire', error });
  }
};

// Toggle le statut actif d'un frais scolaire
exports.toggleSchoolFeeActive = async (req, res) => {
  try {
    const companyId = req.companyId;
    const schoolFee = await SchoolFee.findOne({ 
      _id: req.params.id, 
      companyId 
    });

    if (!schoolFee) {
      return res.status(404).json({ message: 'Frais scolaire non trouvé' });
    }

    schoolFee.active = !schoolFee.active;
    await schoolFee.save();

    res.status(200).json({ 
      message: `Frais scolaire ${schoolFee.active ? 'activé' : 'désactivé'} avec succès`, 
      schoolFee 
    });
  } catch (error) {
    console.error('Error toggling school fee active status:', error);
    res.status(500).json({ message: 'Erreur lors du changement de statut', error });
  }
};
