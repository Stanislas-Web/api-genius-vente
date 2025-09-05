const { Payment } = require('../models/payment.model');
const { Student } = require('../models/student.model');
const { SchoolFee } = require('../models/schoolFee.model');
const { Classroom } = require('../models/classroom.model');

// Enregistrer un paiement
exports.createPayment = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { 
      studentId, 
      schoolFeeId, 
      amount, 
      paymentDate, 
      paymentMethod, 
      reference, 
      notes 
    } = req.body;

    // Vérifier que l'élève appartient à la même entreprise
    const student = await Student.findOne({ 
      _id: studentId, 
      companyId 
    });
    
    if (!student) {
      return res.status(400).json({ message: 'Élève non trouvé ou ne vous appartient pas' });
    }

    // Vérifier que le frais scolaire appartient à la même entreprise
    const schoolFee = await SchoolFee.findOne({ 
      _id: schoolFeeId, 
      companyId 
    });
    
    if (!schoolFee) {
      return res.status(400).json({ message: 'Frais scolaire non trouvé ou ne vous appartient pas' });
    }

    // Calculer le montant total déjà payé pour ce frais par cet élève
    const existingPayments = await Payment.find({ 
      companyId, 
      studentId, 
      schoolFeeId 
    });
    
    const totalPaid = existingPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingAmount = schoolFee.fixedAmount - totalPaid;

    // Vérifier si le montant du paiement ne dépasse pas le montant restant
    if (amount > remainingAmount) {
      return res.status(400).json({ 
        message: `Montant trop élevé. Montant restant à payer: ${remainingAmount} ${schoolFee.currency}` 
      });
    }

    // Déterminer le statut du paiement
    let paymentStatus = 'completed';
    if (amount < remainingAmount) {
      paymentStatus = 'partial';
    }

    const payment = new Payment({
      companyId,
      studentId,
      schoolFeeId,
      amount,
      paymentDate: paymentDate || new Date(),
      paymentMethod,
      reference,
      notes,
      status: paymentStatus,
      recordedBy: req.user?.id
    });

    await payment.save();
    
    // Populate les références pour la réponse
    await payment.populate([
      { path: 'studentId', select: 'matricule lastName firstName classroomId' },
      { path: 'schoolFeeId', select: 'label code amount currency' }
    ]);

    res.status(201).json({ 
      message: 'Paiement enregistré avec succès', 
      payment,
      paymentSummary: {
        totalPaid: totalPaid + amount,
        remainingAmount: remainingAmount - amount,
        isFullyPaid: (totalPaid + amount) >= schoolFee.fixedAmount
      }
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du paiement', error });
  }
};

// Récupérer l'historique des paiements d'un élève
exports.getStudentPayments = async (req, res) => {
  try {
    const companyId = req.companyId;
    const studentId = req.params.studentId;
    const { 
      page = 1, 
      limit = 20, 
      schoolFeeId,
      startDate,
      endDate
    } = req.query;

    // Vérifier que l'élève appartient à la même entreprise
    const student = await Student.findOne({ 
      _id: studentId, 
      companyId 
    });
    
    if (!student) {
      return res.status(404).json({ message: 'Élève non trouvé ou ne vous appartient pas' });
    }

    // Construction du filtre
    const filter = { companyId, studentId };
    
    if (schoolFeeId) filter.schoolFeeId = schoolFeeId;
    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) filter.paymentDate.$gte = new Date(startDate);
      if (endDate) filter.paymentDate.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    const payments = await Payment.find(filter)
      .populate('schoolFeeId', 'label code fixedAmount currency periodicity')
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(filter);

    res.status(200).json({
      student: {
        _id: student._id,
        matricule: student.matricule,
        lastName: student.lastName,
        firstName: student.firstName
      },
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching student payments:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements', error });
  }
};

// Récupérer le statut de paiement d'un élève pour un frais spécifique
exports.getStudentPaymentStatus = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { studentId, schoolFeeId } = req.params;

    // Vérifier que l'élève et le frais appartiennent à la même entreprise
    const [student, schoolFee] = await Promise.all([
      Student.findOne({ _id: studentId, companyId }),
      SchoolFee.findOne({ _id: schoolFeeId, companyId })
    ]);
    
    if (!student) {
      return res.status(404).json({ message: 'Élève non trouvé ou ne vous appartient pas' });
    }
    
    if (!schoolFee) {
      return res.status(404).json({ message: 'Frais scolaire non trouvé ou ne vous appartient pas' });
    }

    // Récupérer tous les paiements pour ce frais par cet élève
    const payments = await Payment.find({ 
      companyId, 
      studentId, 
      schoolFeeId 
    }).sort({ paymentDate: 1 });

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingAmount = schoolFee.fixedAmount - totalPaid;
    const isFullyPaid = totalPaid >= schoolFee.fixedAmount;
    const paymentStatus = isFullyPaid ? 'completed' : (totalPaid > 0 ? 'partial' : 'pending');

    res.status(200).json({
      student: {
        _id: student._id,
        matricule: student.matricule,
        lastName: student.lastName,
        firstName: student.firstName
      },
      schoolFee: {
        _id: schoolFee._id,
        label: schoolFee.label,
        code: schoolFee.code,
        fixedAmount: schoolFee.fixedAmount,
        currency: schoolFee.currency,
        periodicity: schoolFee.periodicity
      },
      paymentStatus: {
        status: paymentStatus,
        totalPaid,
        remainingAmount,
        isFullyPaid,
        progressPercentage: Math.round((totalPaid / schoolFee.fixedAmount) * 100)
      },
      payments
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du statut de paiement', error });
  }
};

// Récupérer les paiements d'une classe pour un frais spécifique
exports.getClassroomPayments = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { classroomId, schoolFeeId } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      status 
    } = req.query;

    // Vérifier que la classe et le frais appartiennent à la même entreprise
    const [classroom, schoolFee] = await Promise.all([
      Classroom.findOne({ _id: classroomId, companyId }),
      SchoolFee.findOne({ _id: schoolFeeId, companyId })
    ]);
    
    if (!classroom) {
      return res.status(404).json({ message: 'Classe non trouvée ou ne vous appartient pas' });
    }
    
    if (!schoolFee) {
      return res.status(404).json({ message: 'Frais scolaire non trouvé ou ne vous appartient pas' });
    }

    // Récupérer tous les élèves de la classe
    const students = await Student.find({ 
      companyId, 
      classroomId 
    }).select('_id matricule lastName firstName');

    // Récupérer les paiements pour chaque élève
    const studentIds = students.map(student => student._id);
    const payments = await Payment.find({ 
      companyId, 
      studentId: { $in: studentIds }, 
      schoolFeeId 
    });

    // Calculer le statut de paiement pour chaque élève
    const studentsWithPaymentStatus = students.map(student => {
      const studentPayments = payments.filter(payment => 
        payment.studentId.toString() === student._id.toString()
      );
      
      const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const remainingAmount = schoolFee.fixedAmount - totalPaid;
      const isFullyPaid = totalPaid >= schoolFee.fixedAmount;
      const paymentStatus = isFullyPaid ? 'completed' : (totalPaid > 0 ? 'partial' : 'pending');

      return {
        ...student.toObject(),
        paymentStatus: {
          status: paymentStatus,
          totalPaid,
          remainingAmount,
          isFullyPaid,
          progressPercentage: Math.round((totalPaid / schoolFee.fixedAmount) * 100)
        },
        payments: studentPayments
      };
    });

    // Filtrer par statut si demandé
    let filteredStudents = studentsWithPaymentStatus;
    if (status) {
      filteredStudents = studentsWithPaymentStatus.filter(student => 
        student.paymentStatus.status === status
      );
    }

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedStudents = filteredStudents.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      classroom: {
        _id: classroom._id,
        name: classroom.name,
        code: classroom.code,
        level: classroom.level,
        section: classroom.section,
        option: classroom.option
      },
      schoolFee: {
        _id: schoolFee._id,
        label: schoolFee.label,
        code: schoolFee.code,
        fixedAmount: schoolFee.fixedAmount,
        currency: schoolFee.currency
      },
      students: paginatedStudents,
      summary: {
        totalStudents: studentsWithPaymentStatus.length,
        completedPayments: studentsWithPaymentStatus.filter(s => s.paymentStatus.status === 'completed').length,
        partialPayments: studentsWithPaymentStatus.filter(s => s.paymentStatus.status === 'partial').length,
        pendingPayments: studentsWithPaymentStatus.filter(s => s.paymentStatus.status === 'pending').length
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredStudents.length,
        pages: Math.ceil(filteredStudents.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching classroom payments:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements de la classe', error });
  }
};

// Récupérer les élèves qui ont tout payé pour un frais spécifique
exports.getFullyPaidStudents = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { schoolFeeId } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      classroomId 
    } = req.query;

    // Vérifier que le frais scolaire appartient à la même entreprise
    const schoolFee = await SchoolFee.findOne({ 
      _id: schoolFeeId, 
      companyId 
    });
    
    if (!schoolFee) {
      return res.status(404).json({ message: 'Frais scolaire non trouvé ou ne vous appartient pas' });
    }

    // Construction du filtre pour les élèves
    const studentFilter = { companyId };
    if (classroomId) {
      studentFilter.classroomId = classroomId;
    }

    // Récupérer tous les élèves selon le filtre
    const students = await Student.find(studentFilter)
      .populate('classroomId', 'name code level section option')
      .select('_id matricule lastName firstName middleName classroomId');

    // Récupérer tous les paiements pour ce frais
    const studentIds = students.map(student => student._id);
    const payments = await Payment.find({ 
      companyId, 
      studentId: { $in: studentIds }, 
      schoolFeeId 
    });

    // Calculer le statut de paiement pour chaque élève et filtrer ceux qui ont tout payé
    const fullyPaidStudents = students.filter(student => {
      const studentPayments = payments.filter(payment => 
        payment.studentId.toString() === student._id.toString()
      );
      
      const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
      return totalPaid >= schoolFee.fixedAmount;
    }).map(student => {
      const studentPayments = payments.filter(payment => 
        payment.studentId.toString() === student._id.toString()
      );
      
      const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
      
      return {
        ...student.toObject(),
        paymentInfo: {
          totalPaid,
          requiredAmount: schoolFee.fixedAmount,
          excessAmount: totalPaid - schoolFee.fixedAmount,
          paymentCount: studentPayments.length,
          lastPaymentDate: studentPayments.length > 0 ? 
            Math.max(...studentPayments.map(p => new Date(p.paymentDate))) : null
        }
      };
    });

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedStudents = fullyPaidStudents.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      schoolFee: {
        _id: schoolFee._id,
        label: schoolFee.label,
        code: schoolFee.code,
        fixedAmount: schoolFee.fixedAmount,
        currency: schoolFee.currency,
        periodicity: schoolFee.periodicity
      },
      students: paginatedStudents,
      summary: {
        totalStudents: students.length,
        fullyPaidStudents: fullyPaidStudents.length,
        completionRate: students.length > 0 ? 
          Math.round((fullyPaidStudents.length / students.length) * 100) : 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: fullyPaidStudents.length,
        pages: Math.ceil(fullyPaidStudents.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching fully paid students:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des élèves ayant tout payé', error });
  }
};

// Récupérer les élèves ayant payé plus qu'un montant sélectionné
exports.getStudentsPaidAboveAmount = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { schoolFeeId } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      classroomId,
      minAmount 
    } = req.query;

    // Vérifier que le montant minimum est fourni
    if (!minAmount || isNaN(minAmount)) {
      return res.status(400).json({ message: 'Le paramètre minAmount est requis et doit être un nombre' });
    }

    const minAmountNum = parseFloat(minAmount);

    // Vérifier que le frais scolaire appartient à la même entreprise
    const schoolFee = await SchoolFee.findOne({ 
      _id: schoolFeeId, 
      companyId 
    });
    
    if (!schoolFee) {
      return res.status(404).json({ message: 'Frais scolaire non trouvé ou ne vous appartient pas' });
    }

    // Construction du filtre pour les élèves
    const studentFilter = { companyId };
    if (classroomId) {
      studentFilter.classroomId = classroomId;
    }

    // Récupérer tous les élèves selon le filtre
    const students = await Student.find(studentFilter)
      .populate('classroomId', 'name code level section option')
      .select('_id matricule lastName firstName middleName classroomId');

    // Récupérer tous les paiements pour ce frais
    const studentIds = students.map(student => student._id);
    const payments = await Payment.find({ 
      companyId, 
      studentId: { $in: studentIds }, 
      schoolFeeId 
    });

    // Calculer le statut de paiement pour chaque élève et filtrer ceux qui ont payé plus que le montant minimum
    const studentsPaidAboveAmount = students.filter(student => {
      const studentPayments = payments.filter(payment => 
        payment.studentId.toString() === student._id.toString()
      );
      
      const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
      return totalPaid >= minAmountNum;
    }).map(student => {
      const studentPayments = payments.filter(payment => 
        payment.studentId.toString() === student._id.toString()
      );
      
      const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const isFullyPaid = totalPaid >= schoolFee.fixedAmount;
      
      return {
        ...student.toObject(),
        paymentInfo: {
          totalPaid,
          requiredAmount: schoolFee.fixedAmount,
          minAmountRequested: minAmountNum,
          excessAmount: totalPaid - schoolFee.fixedAmount,
          amountAboveMinimum: totalPaid - minAmountNum,
          paymentCount: studentPayments.length,
          isFullyPaid,
          lastPaymentDate: studentPayments.length > 0 ? 
            Math.max(...studentPayments.map(p => new Date(p.paymentDate))) : null
        }
      };
    }).sort((a, b) => b.paymentInfo.totalPaid - a.paymentInfo.totalPaid); // Trier par montant payé décroissant

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedStudents = studentsPaidAboveAmount.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      schoolFee: {
        _id: schoolFee._id,
        label: schoolFee.label,
        code: schoolFee.code,
        fixedAmount: schoolFee.fixedAmount,
        currency: schoolFee.currency,
        periodicity: schoolFee.periodicity
      },
      filterCriteria: {
        minAmount: minAmountNum,
        classroomId: classroomId || 'all'
      },
      students: paginatedStudents,
      summary: {
        totalStudents: students.length,
        studentsPaidAboveAmount: studentsPaidAboveAmount.length,
        fullyPaidStudents: studentsPaidAboveAmount.filter(s => s.paymentInfo.isFullyPaid).length,
        averageAmountPaid: studentsPaidAboveAmount.length > 0 ? 
          Math.round(studentsPaidAboveAmount.reduce((sum, s) => sum + s.paymentInfo.totalPaid, 0) / studentsPaidAboveAmount.length) : 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: studentsPaidAboveAmount.length,
        pages: Math.ceil(studentsPaidAboveAmount.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching students paid above amount:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des élèves ayant payé plus que le montant sélectionné', error });
  }
};
