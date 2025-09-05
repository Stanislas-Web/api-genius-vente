const { Student } = require('../models/student.model');
const { Classroom } = require('../models/classroom.model');

// Fonction pour générer un matricule unique
const generateMatricule = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `ELV-${randomNum}`;
};

// Créer un nouvel élève
exports.createStudent = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { 
      matricule, 
      lastName, 
      middleName, 
      firstName, 
      gender, 
      birthDate, 
      parent, 
      classroomId, 
      schoolYear 
    } = req.body;

    // Vérifier que la classe appartient à la même entreprise
    const classroom = await Classroom.findOne({ 
      _id: classroomId, 
      companyId 
    });
    
    if (!classroom) {
      return res.status(400).json({ message: 'Classe non trouvée ou ne vous appartient pas' });
    }

    // Générer matricule si absent
    let finalMatricule = matricule;
    if (!finalMatricule) {
      finalMatricule = generateMatricule();
    }

    // Utiliser schoolYear de la classe si absent
    const finalSchoolYear = schoolYear || classroom.schoolYear;

    const student = new Student({
      companyId,
      matricule: finalMatricule,
      lastName,
      middleName,
      firstName,
      gender,
      birthDate,
      parent,
      classroomId,
      schoolYear: finalSchoolYear
    });

    await student.save();
    res.status(201).json({ message: 'Élève créé avec succès', student });
  } catch (error) {
    console.error('Error creating student:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ce matricule existe déjà' });
    }
    res.status(500).json({ message: 'Erreur lors de la création de l\'élève', error });
  }
};

// Récupérer tous les élèves avec filtres et pagination
exports.getAllStudents = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { 
      page = 1, 
      limit = 20, 
      classroomId, 
      schoolYear, 
      status, 
      q 
    } = req.query;

    // Construction du filtre
    const filter = { companyId };
    
    if (classroomId) filter.classroomId = classroomId;
    if (schoolYear) filter.schoolYear = schoolYear;
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { lastName: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { middleName: { $regex: q, $options: 'i' } },
        { matricule: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const students = await Student.find(filter)
      .populate('classroomId', 'name code schoolYear')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(filter);

    res.status(200).json({
      students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des élèves', error });
  }
};

// Récupérer un élève par ID
exports.getStudentById = async (req, res) => {
  try {
    const companyId = req.companyId;
    const student = await Student.findOne({ 
      _id: req.params.id, 
      companyId 
    }).populate('classroomId', 'name code schoolYear');

    if (!student) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }

    res.status(200).json({ student });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'élève', error });
  }
};

// Mettre à jour un élève
exports.updateStudent = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { classroomId, schoolYear } = req.body;

    // Si classroomId change, vérifier qu'elle appartient à la même entreprise
    if (classroomId) {
      const classroom = await Classroom.findOne({ 
        _id: classroomId, 
        companyId 
      });
      
      if (!classroom) {
        return res.status(400).json({ message: 'Classe non trouvée ou ne vous appartient pas' });
      }

      // Mettre à jour schoolYear si absent
      if (!schoolYear) {
        req.body.schoolYear = classroom.schoolYear;
      }
    }

    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, companyId },
      req.body,
      { new: true }
    ).populate('classroomId', 'name code schoolYear');

    if (!student) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }

    res.status(200).json({ message: 'Élève mis à jour avec succès', student });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'élève', error });
  }
};

// Promouvoir/transférer un élève
exports.moveStudent = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { classroomId, schoolYear } = req.body;

    // Vérifier que la nouvelle classe appartient à la même entreprise
    const classroom = await Classroom.findOne({ 
      _id: classroomId, 
      companyId 
    });
    
    if (!classroom) {
      return res.status(400).json({ message: 'Classe non trouvée ou ne vous appartient pas' });
    }

    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, companyId },
      { 
        classroomId, 
        schoolYear: schoolYear || classroom.schoolYear,
        status: 'transfert'
      },
      { new: true }
    ).populate('classroomId', 'name code schoolYear');

    if (!student) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }

    res.status(200).json({ 
      message: 'Élève transféré avec succès', 
      student 
    });
  } catch (error) {
    console.error('Error moving student:', error);
    res.status(500).json({ message: 'Erreur lors du transfert de l\'élève', error });
  }
};

// Récupérer les élèves d'une classe spécifique
exports.getStudentsByClassroom = async (req, res) => {
  try {
    const companyId = req.companyId;
    const classroomId = req.params.classroomId;
    const { 
      page = 1, 
      limit = 20, 
      status, 
      q 
    } = req.query;

    // Vérifier que la classe appartient à la même entreprise
    const classroom = await Classroom.findOne({ 
      _id: classroomId, 
      companyId 
    });
    
    if (!classroom) {
      return res.status(404).json({ message: 'Classe non trouvée ou ne vous appartient pas' });
    }

    // Construction du filtre
    const filter = { 
      companyId, 
      classroomId 
    };
    
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { lastName: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { middleName: { $regex: q, $options: 'i' } },
        { matricule: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const students = await Student.find(filter)
      .populate('classroomId', 'name code schoolYear option')
      .sort({ lastName: 1, firstName: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(filter);

    res.status(200).json({
      classroom: {
        _id: classroom._id,
        name: classroom.name,
        code: classroom.code,
        level: classroom.level,
        section: classroom.section,
        option: classroom.option,
        schoolYear: classroom.schoolYear,
        capacity: classroom.capacity
      },
      students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching students by classroom:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des élèves de la classe', error });
  }
};
