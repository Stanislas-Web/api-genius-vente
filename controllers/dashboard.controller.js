const mongoose = require('mongoose');
const { Student } = require('../models/student.model');
const { Classroom } = require('../models/classroom.model');
const { Teacher } = require('../models/teacher.model');
const { SchoolFee } = require('../models/schoolFee.model');
const { Payment } = require('../models/payment.model');

exports.getSchoolDashboard = async (req, res) => {
  try {
    const companyId = req.companyId;
    const companyObjectId = new mongoose.Types.ObjectId(companyId);
    const { schoolYear } = req.query;

    const currentYear = schoolYear || new Date().getFullYear().toString();

    // 1. Statistiques des étudiants
    const totalStudents = await Student.countDocuments({ companyId, status: 'actif' });
    const studentsByGender = await Student.aggregate([
      { $match: { companyId: companyObjectId, status: 'actif' } },
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);

    // 2. Statistiques des classes
    const totalClassrooms = await Classroom.countDocuments({ companyId, active: true });
    const classroomsByLevel = await Classroom.aggregate([
      { $match: { companyId: companyObjectId, active: true } },
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);

    // 3. Statistiques des enseignants
    const totalTeachers = await Teacher.countDocuments({ companyId, active: true });

    // 4. Statistiques des frais scolaires
    const totalSchoolFees = await SchoolFee.countDocuments({ companyId, active: true });
    const schoolFeesByPeriodicity = await SchoolFee.aggregate([
      { $match: { companyId: companyObjectId, active: true } },
      { $group: { _id: '$periodicity', count: { $sum: 1 } } }
    ]);

    // 5. Statistiques des paiements (mois en cours)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const paymentsThisMonth = await Payment.countDocuments({
      companyId,
      paymentDate: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalAmountThisMonth = await Payment.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          paymentDate: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // 6. Paiements par méthode
    const paymentsByMethod = await Payment.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          paymentDate: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);

    // 7. Paiements récents (5 derniers)
    const recentPayments = await Payment.find({ companyId })
      .populate('studentId', 'matricule firstName lastName')
      .populate('schoolFeeId', 'label amount currency')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('amount paymentDate paymentMethod status');

    // 8. Taux de paiement global
    const allSchoolFees = await SchoolFee.find({ companyId, active: true });
    const allStudents = await Student.find({ companyId, status: 'actif' });
    const allPayments = await Payment.find({ companyId });

    let totalExpected = 0;
    let totalCollected = 0;

    for (const fee of allSchoolFees) {
      const studentsInFeeClasses = allStudents.filter(student =>
        fee.classroomIds.some(classId => classId.toString() === student.classroomId.toString())
      );
      totalExpected += fee.amount * studentsInFeeClasses.length;
    }

    totalCollected = allPayments.reduce((sum, payment) => sum + payment.amount, 0);

    const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

    // 9. Top 5 classes avec le plus d'étudiants
    const topClassrooms = await Student.aggregate([
      { $match: { companyId: companyObjectId, status: 'actif' } },
      { $group: { _id: '$classroomId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'classrooms',
          localField: '_id',
          foreignField: '_id',
          as: 'classroom'
        }
      },
      { $unwind: '$classroom' },
      {
        $project: {
          name: '$classroom.name',
          code: '$classroom.code',
          level: '$classroom.level',
          studentCount: '$count'
        }
      }
    ]);

    // Réponse finale
    res.status(200).json({
      overview: {
        totalStudents,
        totalClassrooms,
        totalTeachers,
        totalSchoolFees,
        paymentsThisMonth,
        totalAmountThisMonth: totalAmountThisMonth[0]?.total || 0,
        collectionRate
      },
      students: {
        total: totalStudents,
        byGender: studentsByGender.map(g => ({
          gender: g._id,
          count: g.count
        }))
      },
      classrooms: {
        total: totalClassrooms,
        byLevel: classroomsByLevel.map(c => ({
          level: c._id,
          count: c.count
        })),
        topClassrooms
      },
      teachers: {
        total: totalTeachers
      },
      schoolFees: {
        total: totalSchoolFees,
        byPeriodicity: schoolFeesByPeriodicity.map(f => ({
          periodicity: f._id,
          count: f.count
        }))
      },
      payments: {
        thisMonth: {
          count: paymentsThisMonth,
          totalAmount: totalAmountThisMonth[0]?.total || 0,
          byMethod: paymentsByMethod.map(p => ({
            method: p._id,
            count: p.count,
            total: p.total
          }))
        },
        recent: recentPayments,
        financial: {
          totalExpected,
          totalCollected,
          collectionRate,
          outstanding: totalExpected - totalCollected
        }
      },
      period: {
        month: new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' }),
        schoolYear: currentYear
      }
    });
  } catch (error) {
    console.error('Error fetching school dashboard:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du tableau de bord', error });
  }
};
