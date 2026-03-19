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
      notes 
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
      notes
    });

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
