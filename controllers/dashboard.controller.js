const { Student } = require('../models/student.model');
const { Classroom } = require('../models/classroom.model');
const { Teacher } = require('../models/teacher.model');
const { SchoolFee } = require('../models/schoolFee.model');
const { Payment } = require('../models/payment.model');
const Booking = require('../models/booking.model');
const Room = require('../models/room.model');
const RoomType = require('../models/roomType.model');

exports.getSchoolDashboard = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { schoolYear } = req.query;

    const currentYear = schoolYear || new Date().getFullYear().toString();

    // 1. Statistiques des étudiants
    const totalStudents = await Student.countDocuments({ companyId, status: 'actif' });
    const studentsByGender = await Student.aggregate([
      { $match: { companyId, status: 'actif' } },
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);

    // 2. Statistiques des classes
    const totalClassrooms = await Classroom.countDocuments({ companyId, active: true });
    const classroomsByLevel = await Classroom.aggregate([
      { $match: { companyId, active: true } },
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);

    // 3. Statistiques des enseignants
    const totalTeachers = await Teacher.countDocuments({ companyId, status: 'actif' });

    // 4. Statistiques des frais scolaires
    const totalSchoolFees = await SchoolFee.countDocuments({ companyId, active: true });
    const schoolFeesByPeriodicity = await SchoolFee.aggregate([
      { $match: { companyId, active: true } },
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
          companyId,
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
          companyId,
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
      { $match: { companyId, status: 'actif' } },
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

// ========== DASHBOARD HOTEL ==========
exports.getHotelDashboard = async (req, res) => {
  try {
    const companyId = req.companyId;
    const mongoose = require('mongoose');
    const companyObjectId = new mongoose.Types.ObjectId(companyId);

    // Période : mois en cours
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // 1. Statistiques des chambres
    const totalRooms = await Room.countDocuments({ companyId });
    const roomsByStatus = await Room.aggregate([
      { $match: { companyId: companyObjectId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const roomStatusMap = {};
    roomsByStatus.forEach(r => { roomStatusMap[r._id] = r.count; });

    // 2. Types de chambres
    const totalRoomTypes = await RoomType.countDocuments({ companyId });

    // 3. Statistiques des réservations globales
    const totalBookings = await Booking.countDocuments({ companyId: companyObjectId });
    const bookingsByStatus = await Booking.aggregate([
      { $match: { companyId: companyObjectId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 4. Réservations aujourd'hui
    const bookingsToday = await Booking.countDocuments({
      companyId: companyObjectId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const checkInsToday = await Booking.countDocuments({
      companyId: companyObjectId,
      status: 'checked-in',
      updatedAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const checkOutsToday = await Booking.countDocuments({
      companyId: companyObjectId,
      status: 'checked-out',
      updatedAt: { $gte: startOfDay, $lte: endOfDay }
    });

    // 5. Revenus du mois
    const revenueThisMonth = await Booking.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          checkIn: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalFinalAmount: { $sum: '$finalAmount' },
          totalPaidAmount: { $sum: '$paidAmount' },
          totalRemainingAmount: { $sum: '$remainingAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // 6. Revenus aujourd'hui
    const revenueToday = await Booking.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          totalFinalAmount: { $sum: '$finalAmount' },
          totalPaidAmount: { $sum: '$paidAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // 7. Réservations par jour (ce mois)
    const bookingsByDay = await Booking.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          checkIn: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$checkIn' } },
          count: { $sum: 1 },
          revenue: { $sum: '$finalAmount' },
          paid: { $sum: '$paidAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 8. Paiements par méthode (ce mois)
    const paymentsByMethod = await Booking.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          paymentMethod: { $ne: '' },
          checkIn: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalPaid: { $sum: '$paidAmount' }
        }
      }
    ]);

    // 9. Top 5 chambres les plus réservées (ce mois)
    const topRooms = await Booking.aggregate([
      {
        $match: {
          companyId: companyObjectId,
          checkIn: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$roomId',
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' },
          totalPaid: { $sum: '$paidAmount' }
        }
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'rooms',
          localField: '_id',
          foreignField: '_id',
          as: 'room'
        }
      },
      { $unwind: { path: '$room', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          roomNumber: '$room.roomNumber',
          totalBookings: 1,
          totalRevenue: 1,
          totalPaid: 1
        }
      }
    ]);

    // 10. 5 dernières réservations
    const recentBookings = await Booking.find({ companyId: companyObjectId })
      .populate({
        path: 'roomId',
        select: 'roomNumber',
        populate: { path: 'roomTypeId', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('clientName nomFemme clientPhone checkIn checkOut status finalAmount paidAmount remainingAmount paymentMethod createdAt');

    // 11. Taux d'occupation
    const occupiedRooms = roomStatusMap['occupied'] || 0;
    const reservedRooms = roomStatusMap['reserved'] || 0;
    const occupancyRate = totalRooms > 0 ? Math.round(((occupiedRooms + reservedRooms) / totalRooms) * 100) : 0;

    const monthRevenue = revenueThisMonth[0] || { totalFinalAmount: 0, totalPaidAmount: 0, totalRemainingAmount: 0, count: 0 };
    const dayRevenue = revenueToday[0] || { totalFinalAmount: 0, totalPaidAmount: 0, count: 0 };

    res.status(200).json({
      overview: {
        totalRooms,
        totalRoomTypes,
        totalBookings,
        occupancyRate,
        bookingsToday,
        checkInsToday,
        checkOutsToday
      },
      rooms: {
        total: totalRooms,
        available: roomStatusMap['available'] || 0,
        occupied: occupiedRooms,
        reserved: reservedRooms,
        maintenance: roomStatusMap['maintenance'] || 0
      },
      bookings: {
        total: totalBookings,
        byStatus: bookingsByStatus.map(b => ({
          status: b._id,
          count: b.count
        }))
      },
      revenue: {
        today: {
          total: dayRevenue.totalFinalAmount,
          paid: dayRevenue.totalPaidAmount,
          bookings: dayRevenue.count
        },
        thisMonth: {
          total: monthRevenue.totalFinalAmount,
          paid: monthRevenue.totalPaidAmount,
          remaining: monthRevenue.totalRemainingAmount,
          bookings: monthRevenue.count
        },
        byDay: bookingsByDay,
        byPaymentMethod: paymentsByMethod.map(p => ({
          method: p._id,
          count: p.count,
          totalPaid: p.totalPaid
        }))
      },
      topRooms,
      recentBookings,
      period: {
        today: now.toISOString().split('T')[0],
        month: now.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
      }
    });
  } catch (error) {
    console.error('Error fetching hotel dashboard:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du dashboard hôtel', error: error.message });
  }
};
