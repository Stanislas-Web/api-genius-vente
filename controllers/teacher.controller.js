const { Teacher } = require('../models/teacher.model');
const { Classroom } = require('../models/classroom.model');

// Créer un nouveau professeur
exports.createTeacher = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { code, lastName, firstName, phone, email, classes } = req.body;

    // Vérifier que toutes les classes appartiennent à la même entreprise
    if (classes && classes.length > 0) {
      const classrooms = await Classroom.find({ 
        _id: { $in: classes }, 
        companyId 
      });
      
      if (classrooms.length !== classes.length) {
        return res.status(400).json({ message: 'Une ou plusieurs classes ne vous appartiennent pas' });
      }
    }

    const teacher = new Teacher({
      companyId,
      code,
      lastName,
      firstName,
      phone,
      email,
      classes
    });

    await teacher.save();
    
    // Populate les classes pour la réponse
    await teacher.populate('classes', 'name code schoolYear');
    
    res.status(201).json({ message: 'Professeur créé avec succès', teacher });
  } catch (error) {
    console.error('Error creating teacher:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ce code de professeur existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la création du professeur', error });
  }
};

// Récupérer tous les professeurs avec filtres et pagination
exports.getAllTeachers = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { 
      page = 1, 
      limit = 20, 
      active, 
      q 
    } = req.query;

    // Construction du filtre
    const filter = { companyId };
    
    if (active !== undefined) filter.active = active === 'true';
    if (q) {
      filter.$or = [
        { lastName: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { code: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const teachers = await Teacher.find(filter)
      .populate('classes', 'name code schoolYear')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Teacher.countDocuments(filter);

    res.status(200).json({
      teachers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des professeurs', error });
  }
};

// Récupérer un professeur par ID
exports.getTeacherById = async (req, res) => {
  try {
    const companyId = req.companyId;
    const teacher = await Teacher.findOne({ 
      _id: req.params.id, 
      companyId 
    }).populate('classes', 'name code schoolYear');

    if (!teacher) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    res.status(200).json({ teacher });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du professeur', error });
  }
};

// Mettre à jour un professeur
exports.updateTeacher = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { classes } = req.body;

    // Vérifier que toutes les classes appartiennent à la même entreprise
    if (classes && classes.length > 0) {
      const classrooms = await Classroom.find({ 
        _id: { $in: classes }, 
        companyId 
      });
      
      if (classrooms.length !== classes.length) {
        return res.status(400).json({ message: 'Une ou plusieurs classes ne vous appartiennent pas' });
      }
    }

    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, companyId },
      req.body,
      { new: true }
    ).populate('classes', 'name code schoolYear');

    if (!teacher) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    res.status(200).json({ message: 'Professeur mis à jour avec succès', teacher });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du professeur', error });
  }
};
