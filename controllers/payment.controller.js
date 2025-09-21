const { Payment } = require('../models/payment.model');
const { Student } = require('../models/student.model');
const { SchoolFee } = require('../models/schoolFee.model');
const { Classroom } = require('../models/classroom.model');
const axios = require('axios');

// Fonction pour envoyer un SMS de confirmation de paiement
const sendPaymentConfirmationSMS = async (studentName, amount, currency, phone) => {
  if (!phone) {
    console.log('Aucun numéro de téléphone fourni pour l\'envoi du SMS');
    return;
  }

  const url = 'https://nmlygy.api.infobip.com/sms/2/text/advanced';
  
  const headers = {
    'Authorization': 'App d5819848b9e86ee925a9ec584c4d1d91-9ed8758c-2081-4ac2-9192-b2d136e782dd',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const message = `Confirmation de paiement: ${studentName} a payé ${amount} ${currency}. Merci pour votre confiance.`;
  
  const body = {
    messages: [
      {
        destinations: [{ to: phone }],
        from: '447491163443',
        text: message,
      },
    ],
  };

  try {
    const response = await axios.post(url, body, { headers });
    console.log('SMS de confirmation envoyé avec succès:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS de confirmation:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

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

    // Vérifier que l'élève appartient à la même entreprise et récupérer les infos du tuteur
    const student = await Student.findOne({ 
      _id: studentId, 
      companyId 
    }).select('matricule lastName firstName tuteur');
    
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
    
    // Vérifier le montant restant à payer
    const remainingAmount = schoolFee.amount - totalPaid;
    
    if (schoolFee.amount <= 0) {
      return res.status(400).json({ 
        message: `Ce frais scolaire n'a pas de montant défini.` 
      });
    }
    
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

    // Calculer le résumé du paiement
    const newTotalPaid = totalPaid + amount;
    const newRemainingAmount = schoolFee.amount - newTotalPaid;
    
    const paymentSummary = {
      totalPaid: newTotalPaid,
      remainingAmount: newRemainingAmount,
      isFullyPaid: newTotalPaid >= schoolFee.amount
    };

    // Envoyer un SMS de confirmation au tuteur si un numéro de téléphone est disponible
    let smsResult = null;
    if (student.tuteur && student.tuteur.phone) {
      const studentFullName = `${student.firstName} ${student.lastName}`;
      smsResult = await sendPaymentConfirmationSMS(
        studentFullName,
        amount,
        schoolFee.currency,
        student.tuteur.phone
      );
    }

    res.status(201).json({ 
      message: 'Paiement enregistré avec succès', 
      payment,
      paymentSummary,
      smsSent: smsResult ? smsResult.success : false,
      smsDetails: smsResult
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
      .populate('schoolFeeId', 'label amount currency periodicity')
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
    const remainingAmount = schoolFee.amount - totalPaid;
    const isFullyPaid = totalPaid >= schoolFee.amount;
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
        amount: schoolFee.amount,
        currency: schoolFee.currency,
        periodicity: schoolFee.periodicity
      },
      paymentStatus: {
        status: paymentStatus,
        totalPaid,
        remainingAmount,
        isFullyPaid,
        progressPercentage: Math.round((totalPaid / schoolFee.amount) * 100)
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
      const remainingAmount = schoolFee.amount - totalPaid;
      const isFullyPaid = totalPaid >= schoolFee.amount;
      const paymentStatus = isFullyPaid ? 'completed' : (totalPaid > 0 ? 'partial' : 'pending');

      return {
        ...student.toObject(),
        paymentStatus: {
          status: paymentStatus,
          totalPaid,
          remainingAmount,
          isFullyPaid,
          progressPercentage: Math.round((totalPaid / schoolFee.amount) * 100)
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
        amount: schoolFee.amount,
        currency: schoolFee.currency
      },
      students: paginatedStudents,
      summary: {
        totalStudents: studentsWithPaymentStatus.length,
        studentsWithPayments: studentsWithPaymentStatus.filter(s => s.paymentStatus.totalPaid > 0).length,
        studentsWithoutPayments: studentsWithPaymentStatus.filter(s => s.paymentStatus.totalPaid === 0).length,
        completedPayments: studentsWithPaymentStatus.filter(s => s.paymentStatus.status === 'completed').length,
        partialPayments: studentsWithPaymentStatus.filter(s => s.paymentStatus.status === 'partial').length,
        pendingPayments: studentsWithPaymentStatus.filter(s => s.paymentStatus.status === 'pending').length,
        totalAmountCollected: studentsWithPaymentStatus.reduce((sum, s) => sum + s.paymentStatus.totalPaid, 0)
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
      return totalPaid >= schoolFee.amount;
    }).map(student => {
      const studentPayments = payments.filter(payment => 
        payment.studentId.toString() === student._id.toString()
      );
      
      const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
      
      return {
        ...student.toObject(),
        paymentInfo: {
          totalPaid,
          requiredAmount: schoolFee.amount,
          excessAmount: totalPaid - schoolFee.amount,
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
        amount: schoolFee.amount,
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

// Récupérer tous les élèves qui ont payé un frais spécifique dans une classe
exports.getPaidStudentsByClassroom = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { classroomId, schoolFeeId } = req.params;
    const { 
      page = 1, 
      limit = 20 
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
    }).select('_id matricule lastName firstName middleName');

    // Récupérer tous les paiements pour ce frais dans cette classe
    const studentIds = students.map(student => student._id);
    const payments = await Payment.find({ 
      companyId, 
      studentId: { $in: studentIds }, 
      schoolFeeId 
    }).sort({ paymentDate: -1 });

    // Filtrer seulement les élèves qui ont payé (au moins un paiement)
    const paidStudents = students.filter(student => {
      return payments.some(payment => 
        payment.studentId.toString() === student._id.toString()
      );
    }).map(student => {
      const studentPayments = payments.filter(payment => 
        payment.studentId.toString() === student._id.toString()
      );
      
      const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const isFullyPaid = totalPaid >= schoolFee.amount;
      
      return {
        ...student.toObject(),
        paymentInfo: {
          totalPaid,
          paymentCount: studentPayments.length,
          isFullyPaid,
          lastPaymentDate: studentPayments.length > 0 ? 
            studentPayments[0].paymentDate : null,
          firstPaymentDate: studentPayments.length > 0 ? 
            studentPayments[studentPayments.length - 1].paymentDate : null
        },
        payments: studentPayments
      };
    }).sort((a, b) => b.paymentInfo.totalPaid - a.paymentInfo.totalPaid); // Trier par montant payé décroissant

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedStudents = paidStudents.slice(skip, skip + parseInt(limit));

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
        amount: schoolFee.amount,
        currency: schoolFee.currency,
      },
      paidStudents: paginatedStudents,
      summary: {
        totalStudentsInClass: students.length,
        paidStudentsCount: paidStudents.length,
        unpaidStudentsCount: students.length - paidStudents.length,
        fullyPaidCount: paidStudents.filter(s => s.paymentInfo.isFullyPaid).length,
        totalAmountCollected: paidStudents.reduce((sum, s) => sum + s.paymentInfo.totalPaid, 0)
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: paidStudents.length,
        pages: Math.ceil(paidStudents.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching paid students by classroom:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des élèves ayant payé', error });
  }
};

// Récupérer les paiements les plus récents
exports.getRecentPayments = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { 
      limit = 10,
      page = 1
    } = req.query;

    const skip = (page - 1) * limit;
    
    // Récupérer les paiements les plus récents
    const payments = await Payment.find({ companyId })
      .populate('studentId', 'matricule lastName firstName classroomId')
      .populate('schoolFeeId', 'label currency amount')
      .populate('recordedBy', 'username')
      .sort({ paymentDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments({ companyId });

    // Calculer les statistiques
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const paymentMethods = payments.reduce((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
      return acc;
    }, {});
    
    // Calculer les montants par devise
    const amountsByCurrency = payments.reduce((acc, payment) => {
      const currency = payment.schoolFeeId?.currency || 'CDF';
      acc[currency] = (acc[currency] || 0) + payment.amount;
      return acc;
    }, {});

    res.status(200).json({
      payments,
      summary: {
        totalPayments: total,
        recentPaymentsCount: payments.length,
        totalAmountCollected: totalAmount,
        averageAmount: payments.length > 0 ? Math.round(totalAmount / payments.length) : 0,
        paymentMethodsBreakdown: paymentMethods,
        amountsByCurrency: amountsByCurrency
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching recent payments:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements récents', error });
  }
};

// Récupérer les statistiques globales de l'entreprise
exports.getGlobalStatistics = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { period = 'current' } = req.query; // current, lastMonth, lastYear

    // Calculer les dates selon la période
    let startDate, endDate;
    const now = new Date();
    
    switch (period) {
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        break;
      case 'lastYear':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
        break;
      case 'current':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
    }

    // 1. Statistiques des élèves
    const totalStudents = await Student.countDocuments({ companyId });
    
    // 2. Statistiques des classes
    const totalClassrooms = await Classroom.countDocuments({ companyId });
    
    // 3. Statistiques des paiements du mois
    const monthlyPayments = await Payment.find({
      companyId,
      paymentDate: { $gte: startDate, $lte: endDate }
    }).populate('schoolFeeId', 'label amount currency');

    const totalMonthlyAmount = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const monthlyPaymentsCount = monthlyPayments.length;

    // Calculer les montants par devise pour le mois
    const monthlyAmountsByCurrency = monthlyPayments.reduce((acc, payment) => {
      const currency = payment.schoolFeeId?.currency || 'CDF';
      acc[currency] = (acc[currency] || 0) + payment.amount;
      return acc;
    }, {});

    // 4. Calculer le taux de paiement global
    // Récupérer tous les frais scolaires actifs
    const activeSchoolFees = await SchoolFee.find({ 
      companyId, 
      active: true 
    });

    // Récupérer tous les élèves
    const allStudents = await Student.find({ companyId });
    const studentIds = allStudents.map(student => student._id);

    // Récupérer tous les paiements
    const allPayments = await Payment.find({ 
      companyId,
      studentId: { $in: studentIds }
    });

    // Calculer le taux de paiement par frais scolaire
    let totalRequiredAmount = 0;
    let totalPaidAmount = 0;
    let totalStudentsWithPayments = 0;
    let totalStudentsWithoutPayments = 0;

    const schoolFeeStats = await Promise.all(activeSchoolFees.map(async (schoolFee) => {
      // Récupérer les élèves de ce frais (basé sur les classes)
      const studentsInFee = await Student.find({
        companyId,
        classroomId: { $in: schoolFee.classroomIds }
      });

      const studentsInFeeIds = studentsInFee.map(student => student._id);
      
      // Récupérer les paiements pour ce frais
      const feePayments = allPayments.filter(payment => 
        payment.schoolFeeId.toString() === schoolFee._id.toString() &&
        studentsInFeeIds.includes(payment.studentId)
      );

      // Calculer les statistiques pour ce frais
      const studentsWithPayments = new Set(feePayments.map(p => p.studentId.toString()));
      const studentsWithoutPayments = studentsInFee.length - studentsWithPayments.size;
      
      const totalPaidForFee = feePayments.reduce((sum, payment) => sum + payment.amount, 0);
      const totalRequiredForFee = schoolFee.amount * studentsInFee.length;
      
      const paymentRate = studentsInFee.length > 0 ? 
        Math.round((studentsWithPayments.size / studentsInFee.length) * 100) : 0;

      totalRequiredAmount += totalRequiredForFee;
      totalPaidAmount += totalPaidForFee;
      totalStudentsWithPayments += studentsWithPayments.size;
      totalStudentsWithoutPayments += studentsWithoutPayments;

      return {
        schoolFeeId: schoolFee._id,
        label: schoolFee.label,
        amount: schoolFee.amount,
        currency: schoolFee.currency,
        totalStudents: studentsInFee.length,
        studentsWithPayments: studentsWithPayments.size,
        studentsWithoutPayments,
        totalPaid: totalPaidForFee,
        totalRequired: totalRequiredForFee,
        paymentRate
      };
    }));

    // Calculer le taux de paiement global
    const globalPaymentRate = totalStudents > 0 ? 
      Math.round((totalStudentsWithPayments / totalStudents) * 100) : 0;

    // 5. Statistiques des méthodes de paiement du mois
    const paymentMethodsStats = monthlyPayments.reduce((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
      return acc;
    }, {});

    // 6. Statistiques par classe
    const classroomStats = await Promise.all(
      (await Classroom.find({ companyId })).map(async (classroom) => {
        const studentsInClass = await Student.countDocuments({
          companyId,
          classroomId: classroom._id
        });

        const classPayments = monthlyPayments.filter(payment => 
          payment.studentId && 
          payment.studentId.classroomId && 
          payment.studentId.classroomId.toString() === classroom._id.toString()
        );

        const classAmount = classPayments.reduce((sum, payment) => sum + payment.amount, 0);

        return {
          classroomId: classroom._id,
          name: classroom.name,
          code: classroom.code,
          level: classroom.level,
          totalStudents: studentsInClass,
          monthlyPayments: classPayments.length,
          monthlyAmount: classAmount
        };
      })
    );

    res.status(200).json({
      period: {
        type: period,
        startDate,
        endDate,
        label: period === 'current' ? 'Mois en cours' : 
               period === 'lastMonth' ? 'Mois dernier' : 'Année dernière'
      },
      statistics: {
        // Totaux généraux
        totalStudents,
        totalClassrooms,
        totalActiveSchoolFees: activeSchoolFees.length,
        
        // Paiements du mois
        monthlyPayments: {
          count: monthlyPaymentsCount,
          totalAmount: totalMonthlyAmount,
          amountsByCurrency: monthlyAmountsByCurrency,
          averageAmount: monthlyPaymentsCount > 0 ? 
            Math.round(totalMonthlyAmount / monthlyPaymentsCount) : 0
        },
        
        // Taux de paiement
        paymentRate: {
          global: globalPaymentRate,
          totalStudentsWithPayments,
          totalStudentsWithoutPayments,
          totalRequiredAmount,
          totalPaidAmount,
          completionPercentage: totalRequiredAmount > 0 ? 
            Math.round((totalPaidAmount / totalRequiredAmount) * 100) : 0
        },
        
        // Méthodes de paiement
        paymentMethods: paymentMethodsStats,
        
        // Détails par frais scolaire
        schoolFeesBreakdown: schoolFeeStats,
        
        // Détails par classe
        classroomsBreakdown: classroomStats
      }
    });

  } catch (error) {
    console.error('Error fetching global statistics:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques globales', 
      error: error.message 
    });
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
      const isFullyPaid = totalPaid >= schoolFee.amount;
      
      return {
        ...student.toObject(),
        paymentInfo: {
          totalPaid,
          requiredAmount: schoolFee.amount,
          minAmountRequested: minAmountNum,
          excessAmount: totalPaid - schoolFee.amount,
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
        amount: schoolFee.amount,
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

// Récupérer les élèves qui n'ont pas payé un frais spécifique
exports.getUnpaidStudents = async (req, res) => {
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

    // Filtrer les élèves qui n'ont pas payé (aucun paiement ou paiement insuffisant)
    const unpaidStudents = students.filter(student => {
      const studentPayments = payments.filter(payment => 
        payment.studentId.toString() === student._id.toString()
      );
      
      const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
      return totalPaid < schoolFee.amount; // N'a pas payé le montant complet
    }).map(student => {
      const studentPayments = payments.filter(payment => 
        payment.studentId.toString() === student._id.toString()
      );
      
      const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const remainingAmount = schoolFee.amount - totalPaid;
      const isFullyPaid = totalPaid >= schoolFee.amount;
      const paymentStatus = isFullyPaid ? 'completed' : (totalPaid > 0 ? 'partial' : 'pending');

      return {
        ...student.toObject(),
        paymentInfo: {
          totalPaid,
          requiredAmount: schoolFee.amount,
          remainingAmount,
          paymentCount: studentPayments.length,
          isFullyPaid,
          paymentStatus,
          progressPercentage: Math.round((totalPaid / schoolFee.amount) * 100),
          lastPaymentDate: studentPayments.length > 0 ? 
            Math.max(...studentPayments.map(p => new Date(p.paymentDate))) : null
        }
      };
    }).sort((a, b) => a.paymentInfo.remainingAmount - b.paymentInfo.remainingAmount); // Trier par montant restant croissant

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedStudents = unpaidStudents.slice(skip, skip + parseInt(limit));

    res.status(200).json({
      schoolFee: {
        _id: schoolFee._id,
        label: schoolFee.label,
        code: schoolFee.code,
        amount: schoolFee.amount,
        currency: schoolFee.currency,
        periodicity: schoolFee.periodicity
      },
      filterCriteria: {
        classroomId: classroomId || 'all'
      },
      students: paginatedStudents,
      summary: {
        totalStudents: students.length,
        unpaidStudents: unpaidStudents.length,
        fullyPaidStudents: students.length - unpaidStudents.length,
        totalUnpaidAmount: unpaidStudents.reduce((sum, s) => sum + s.paymentInfo.remainingAmount, 0),
        averageUnpaidAmount: unpaidStudents.length > 0 ? 
          Math.round(unpaidStudents.reduce((sum, s) => sum + s.paymentInfo.remainingAmount, 0) / unpaidStudents.length) : 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: unpaidStudents.length,
        pages: Math.ceil(unpaidStudents.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching unpaid students:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des élèves non payés', error });
  }
};
