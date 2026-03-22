const Booking = require('../models/booking.model');
const Room = require('../models/room.model');
const RoomType = require('../models/roomType.model');

const calculateBookingAmount = (checkIn, checkOut, roomType, room, negotiatedRate = null) => {
  if (negotiatedRate) {
    return negotiatedRate;
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const durationMs = checkOutDate - checkInDate;
  const durationHours = durationMs / (1000 * 60 * 60);

  const hourlyRate = room.customHourlyRate || roomType.hourlyRate;
  const nightRate = room.customNightRate || roomType.nightRate;
  const fullDayRate = room.customFullDayRate || roomType.fullDayRate;

  if (durationHours < 12) {
    return Math.ceil(durationHours) * hourlyRate;
  } else if (durationHours < 24) {
    return nightRate;
  } else {
    const days = Math.ceil(durationHours / 24);
    return days * fullDayRate;
  }
};

exports.createBooking = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { 
      roomId, 
      clientName, 
      clientPhone, 
      clientEmail, 
      cardNumber, 
      checkIn, 
      checkOut,
      rateType,
      negotiatedRate,
      notes,
      nomFemme,
      paidAmount,
      paymentMethod
    } = req.body;

    const room = await Room.findOne({ _id: roomId, companyId }).populate('roomTypeId');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.status === 'occupied') {
      return res.status(400).json({ message: 'Room is already occupied' });
    }

    if (room.status === 'maintenance') {
      return res.status(400).json({ message: 'Room is under maintenance' });
    }

    let calculatedAmount = 0;
    let finalAmount = 0;

    if (checkOut) {
      if (rateType === 'negotiated' && negotiatedRate) {
        finalAmount = negotiatedRate;
        calculatedAmount = calculateBookingAmount(checkIn, checkOut, room.roomTypeId, room);
      } else {
        calculatedAmount = calculateBookingAmount(checkIn, checkOut, room.roomTypeId, room);
        finalAmount = calculatedAmount;
      }
    }

    const booking = new Booking({
      companyId,
      roomId,
      clientName,
      clientPhone,
      clientEmail,
      cardNumber,
      checkIn,
      checkOut,
      status: 'pending',
      rateType: rateType || 'standard',
      negotiatedRate: rateType === 'negotiated' ? negotiatedRate : null,
      calculatedAmount,
      finalAmount,
      remainingAmount: finalAmount,
      notes,
      nomFemme: nomFemme || ''
    });

    // Paiement direct lors de la réservation (optionnel)
    if (paidAmount && paidAmount > 0) {
      if (finalAmount > 0 && paidAmount > finalAmount) {
        return res.status(400).json({ 
          message: `Montant payé (${paidAmount}) dépasse le montant total (${finalAmount})` 
        });
      }
      booking.paidAmount = paidAmount;
      booking.remainingAmount = finalAmount > 0 ? finalAmount - paidAmount : 0;
      booking.paymentMethod = paymentMethod || 'cash';
      booking.paymentDate = new Date();
    }

    await booking.save();
    await booking.populate('roomId');

    room.status = 'reserved';
    await room.save();

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { page = 1, limit = 10, status, roomId, clientName, startDate, endDate } = req.query;

    const query = { companyId };
    if (status) query.status = status;
    if (roomId) query.roomId = roomId;
    if (clientName) query.clientName = { $regex: clientName, $options: 'i' };
    if (startDate || endDate) {
      query.checkIn = {};
      if (startDate) query.checkIn.$gte = new Date(startDate);
      if (endDate) query.checkIn.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'roomId',
        populate: { path: 'roomTypeId' }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Booking.countDocuments(query);

    res.status(200).json({
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const companyId = req.companyId;
    const booking = await Booking.findOne({ _id: req.params.id, companyId })
      .populate({
        path: 'roomId',
        populate: { path: 'roomTypeId' }
      });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const companyId = req.companyId;
    const booking = await Booking.findOne({ _id: req.params.id, companyId }).populate({
      path: 'roomId',
      populate: { path: 'roomTypeId' }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.body.checkOut && booking.checkIn) {
      const room = booking.roomId;
      const roomType = room.roomTypeId;
      
      if (req.body.rateType === 'negotiated' && req.body.negotiatedRate) {
        booking.finalAmount = req.body.negotiatedRate;
        booking.calculatedAmount = calculateBookingAmount(booking.checkIn, req.body.checkOut, roomType, room);
      } else {
        const amount = calculateBookingAmount(booking.checkIn, req.body.checkOut, roomType, room);
        booking.calculatedAmount = amount;
        booking.finalAmount = amount;
      }
    }

    Object.assign(booking, req.body);
    await booking.save();
    await booking.populate({
      path: 'roomId',
      populate: { path: 'roomTypeId' }
    });

    res.status(200).json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const companyId = req.companyId;
    const booking = await Booking.findOne({ _id: req.params.id, companyId });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending' && booking.status !== 'reserved') {
      return res.status(400).json({ message: 'Booking cannot be checked in' });
    }

    booking.status = 'checked-in';
    await booking.save();

    const room = await Room.findById(booking.roomId);
    if (room) {
      room.status = 'occupied';
      await room.save();
    }

    await booking.populate({
      path: 'roomId',
      populate: { path: 'roomTypeId' }
    });

    res.status(200).json({ message: 'Check-in successful', booking });
  } catch (error) {
    console.error('Error during check-in:', error);
    res.status(500).json({ message: 'Error during check-in', error: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { checkOut } = req.body;

    const booking = await Booking.findOne({ _id: req.params.id, companyId }).populate({
      path: 'roomId',
      populate: { path: 'roomTypeId' }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'checked-in') {
      return res.status(400).json({ message: 'Booking is not checked in' });
    }

    booking.checkOut = checkOut || new Date();
    booking.status = 'checked-out';

    const room = booking.roomId;
    const roomType = room.roomTypeId;

    if (booking.rateType === 'negotiated' && booking.negotiatedRate) {
      booking.finalAmount = booking.negotiatedRate;
      booking.calculatedAmount = calculateBookingAmount(booking.checkIn, booking.checkOut, roomType, room);
    } else {
      const amount = calculateBookingAmount(booking.checkIn, booking.checkOut, roomType, room);
      booking.calculatedAmount = amount;
      booking.finalAmount = amount;
    }

    await booking.save();

    if (room) {
      room.status = 'available';
      await room.save();
    }

    await booking.populate({
      path: 'roomId',
      populate: { path: 'roomTypeId' }
    });

    res.status(200).json({ message: 'Check-out successful', booking });
  } catch (error) {
    console.error('Error during check-out:', error);
    res.status(500).json({ message: 'Error during check-out', error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const companyId = req.companyId;
    const booking = await Booking.findOne({ _id: req.params.id, companyId });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'checked-out') {
      return res.status(400).json({ message: 'Cannot cancel a checked-out booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const room = await Room.findById(booking.roomId);
    if (room && (room.status === 'reserved' || room.status === 'occupied')) {
      room.status = 'available';
      await room.save();
    }

    await booking.populate({
      path: 'roomId',
      populate: { path: 'roomTypeId' }
    });

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};

// ========== PAIEMENT SUR RESERVATION EN ATTENTE ==========
exports.payBooking = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Le montant doit être supérieur à 0' });
    }

    const booking = await Booking.findOne({ _id: req.params.id, companyId }).populate({
      path: 'roomId',
      populate: { path: 'roomTypeId' }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Le paiement ne peut être effectué que sur une réservation en attente (pending)' });
    }

    if (booking.finalAmount <= 0) {
      return res.status(400).json({ message: 'Aucun montant à payer pour cette réservation. Veuillez d\'abord définir le checkOut.' });
    }

    const currentPaid = booking.paidAmount || 0;
    const newPaidAmount = currentPaid + amount;
    const remaining = booking.finalAmount - newPaidAmount;

    if (amount > (booking.finalAmount - currentPaid)) {
      return res.status(400).json({
        message: `Montant trop élevé. Montant restant à payer: ${booking.finalAmount - currentPaid}`,
        remainingAmount: booking.finalAmount - currentPaid
      });
    }

    booking.paidAmount = newPaidAmount;
    booking.remainingAmount = remaining >= 0 ? remaining : 0;
    booking.paymentMethod = paymentMethod || 'cash';
    booking.paymentDate = new Date();

    await booking.save();

    res.status(200).json({
      message: remaining <= 0 ? 'Paiement complet effectué' : 'Paiement partiel effectué',
      booking,
      paymentDetails: {
        amountPaid: amount,
        totalPaid: newPaidAmount,
        remainingAmount: remaining >= 0 ? remaining : 0,
        finalAmount: booking.finalAmount,
        paymentMethod: booking.paymentMethod,
        paymentDate: booking.paymentDate
      }
    });
  } catch (error) {
    console.error('Error paying booking:', error);
    res.status(500).json({ message: 'Error paying booking', error: error.message });
  }
};

// ========== RAPPORTS DETAILLES SUR LES RESERVATIONS ==========
exports.getBookingReportSummary = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { startDate, endDate, status } = req.query;

    const match = { companyId: new (require('mongoose').Types.ObjectId)(companyId) };
    if (status) match.status = status;
    if (startDate || endDate) {
      match.checkIn = {};
      if (startDate) match.checkIn.$gte = new Date(startDate);
      if (endDate) match.checkIn.$lte = new Date(endDate);
    }

    // Statistiques globales
    const totalBookings = await Booking.countDocuments(match);

    const amountStats = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalFinalAmount: { $sum: '$finalAmount' },
          totalPaidAmount: { $sum: '$paidAmount' },
          totalRemainingAmount: { $sum: '$remainingAmount' },
          avgAmount: { $avg: '$finalAmount' },
          minAmount: { $min: '$finalAmount' },
          maxAmount: { $max: '$finalAmount' }
        }
      }
    ]);

    // Réservations par statut
    const bookingsByStatus = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$finalAmount' },
          totalPaid: { $sum: '$paidAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Réservations par jour
    const bookingsByDay = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$checkIn' } },
          count: { $sum: 1 },
          totalAmount: { $sum: '$finalAmount' },
          totalPaid: { $sum: '$paidAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Réservations par type de tarif
    const bookingsByRateType = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$rateType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$finalAmount' }
        }
      }
    ]);

    // Réservations par méthode de paiement
    const bookingsByPaymentMethod = await Booking.aggregate([
      { $match: { ...match, paymentMethod: { $ne: '' } } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalPaid: { $sum: '$paidAmount' }
        }
      }
    ]);

    const stats = amountStats[0] || {
      totalFinalAmount: 0,
      totalPaidAmount: 0,
      totalRemainingAmount: 0,
      avgAmount: 0,
      minAmount: 0,
      maxAmount: 0
    };

    res.status(200).json({
      summary: {
        totalBookings,
        totalFinalAmount: stats.totalFinalAmount,
        totalPaidAmount: stats.totalPaidAmount,
        totalRemainingAmount: stats.totalRemainingAmount,
        averageAmount: Math.round(stats.avgAmount * 100) / 100,
        minAmount: stats.minAmount,
        maxAmount: stats.maxAmount
      },
      bookingsByStatus,
      bookingsByDay,
      bookingsByRateType,
      bookingsByPaymentMethod
    });
  } catch (error) {
    console.error('Error generating booking report summary:', error);
    res.status(500).json({ message: 'Error generating booking report', error: error.message });
  }
};

exports.getBookingReportDetailed = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { startDate, endDate, status, roomId, page = 1, limit = 50 } = req.query;

    const query = { companyId };
    if (status) query.status = status;
    if (roomId) query.roomId = roomId;
    if (startDate || endDate) {
      query.checkIn = {};
      if (startDate) query.checkIn.$gte = new Date(startDate);
      if (endDate) query.checkIn.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'roomId',
        populate: { path: 'roomTypeId' }
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ checkIn: -1 });

    const count = await Booking.countDocuments(query);

    // Enrichir chaque réservation avec des détails de durée et prix
    const detailedBookings = bookings.map(b => {
      const booking = b.toObject();
      let durationHours = null;
      let durationText = '';

      if (booking.checkIn && booking.checkOut) {
        const diffMs = new Date(booking.checkOut) - new Date(booking.checkIn);
        durationHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;

        if (durationHours < 24) {
          durationText = `${Math.round(durationHours)}h`;
        } else {
          const days = Math.floor(durationHours / 24);
          const hours = Math.round(durationHours % 24);
          durationText = `${days}j ${hours}h`;
        }
      }

      return {
        ...booking,
        durationHours,
        durationText,
        checkInFormatted: booking.checkIn ? new Date(booking.checkIn).toLocaleString('fr-FR', { timeZone: 'Africa/Kinshasa' }) : null,
        checkOutFormatted: booking.checkOut ? new Date(booking.checkOut).toLocaleString('fr-FR', { timeZone: 'Africa/Kinshasa' }) : null,
        roomName: booking.roomId ? booking.roomId.name || booking.roomId.number : null,
        roomTypeName: booking.roomId && booking.roomId.roomTypeId ? booking.roomId.roomTypeId.name : null,
        isPaid: booking.paidAmount >= booking.finalAmount && booking.finalAmount > 0,
        paymentStatus: booking.finalAmount <= 0 ? 'no-amount' : (booking.paidAmount >= booking.finalAmount ? 'paid' : (booking.paidAmount > 0 ? 'partial' : 'unpaid'))
      };
    });

    res.status(200).json({
      bookings: detailedBookings,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Error generating detailed booking report:', error);
    res.status(500).json({ message: 'Error generating detailed booking report', error: error.message });
  }
};

exports.getBookingReportByRoom = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { startDate, endDate } = req.query;

    const match = { companyId: new (require('mongoose').Types.ObjectId)(companyId) };
    if (startDate || endDate) {
      match.checkIn = {};
      if (startDate) match.checkIn.$gte = new Date(startDate);
      if (endDate) match.checkIn.$lte = new Date(endDate);
    }

    const reportByRoom = await Booking.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$roomId',
          totalBookings: { $sum: 1 },
          totalAmount: { $sum: '$finalAmount' },
          totalPaid: { $sum: '$paidAmount' },
          totalRemaining: { $sum: '$remainingAmount' },
          avgAmount: { $avg: '$finalAmount' }
        }
      },
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
        $lookup: {
          from: 'roomtypes',
          localField: 'room.roomTypeId',
          foreignField: '_id',
          as: 'roomType'
        }
      },
      { $unwind: { path: '$roomType', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          roomId: '$_id',
          roomName: { $ifNull: ['$room.name', '$room.number'] },
          roomTypeName: '$roomType.name',
          totalBookings: 1,
          totalAmount: 1,
          totalPaid: 1,
          totalRemaining: 1,
          avgAmount: { $round: ['$avgAmount', 2] }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    res.status(200).json({ reportByRoom });
  } catch (error) {
    console.error('Error generating booking report by room:', error);
    res.status(500).json({ message: 'Error generating booking report by room', error: error.message });
  }
};
