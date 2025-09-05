const { Classroom } = require('../models/classroom.model');

// Créer une nouvelle classe
exports.createClassroom = async (req, res) => {
  try {
    const { code, name, level, section, schoolYear, capacity } = req.body;
    const companyId = req.companyId;

    const classroom = new Classroom({
      companyId,
      code,
      name,
      level,
      section,
      schoolYear,
      capacity
    });

    await classroom.save();
    res.status(201).json({ message: 'Classe créée avec succès', classroom });
  } catch (error) {
    console.error('Error creating classroom:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la classe', error });
  }
};

// Récupérer toutes les classes avec filtres et pagination
exports.getAllClassrooms = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { 
      page = 1, 
      limit = 20, 
      schoolYear, 
      active, 
      q 
    } = req.query;

    // Construction du filtre
    const filter = { companyId };
    
    if (schoolYear) filter.schoolYear = schoolYear;
    if (active !== undefined) filter.active = active === 'true';
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { code: { $regex: q, $options: 'i' } },
        { level: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const classrooms = await Classroom.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Classroom.countDocuments(filter);

    res.status(200).json({
      classrooms,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des classes', error });
  }
};

// Récupérer une classe par ID
exports.getClassroomById = async (req, res) => {
  try {
    const companyId = req.companyId;
    const classroom = await Classroom.findOne({ 
      _id: req.params.id, 
      companyId 
    });

    if (!classroom) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }

    res.status(200).json({ classroom });
  } catch (error) {
    console.error('Error fetching classroom:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la classe', error });
  }
};

// Mettre à jour une classe
exports.updateClassroom = async (req, res) => {
  try {
    const companyId = req.companyId;
    const classroom = await Classroom.findOneAndUpdate(
      { _id: req.params.id, companyId },
      req.body,
      { new: true }
    );

    if (!classroom) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }

    res.status(200).json({ message: 'Classe mise à jour avec succès', classroom });
  } catch (error) {
    console.error('Error updating classroom:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la classe', error });
  }
};

// Toggle le statut actif d'une classe
exports.toggleClassroomActive = async (req, res) => {
  try {
    const companyId = req.companyId;
    const classroom = await Classroom.findOne({ 
      _id: req.params.id, 
      companyId 
    });

    if (!classroom) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }

    classroom.active = !classroom.active;
    await classroom.save();

    res.status(200).json({ 
      message: `Classe ${classroom.active ? 'activée' : 'désactivée'} avec succès`, 
      classroom 
    });
  } catch (error) {
    console.error('Error toggling classroom active status:', error);
    res.status(500).json({ message: 'Erreur lors du changement de statut', error });
  }
};
