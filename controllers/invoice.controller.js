const Invoice = require('../models/invoice.model');
const Booking = require('../models/booking.model');
const Room = require('../models/room.model');
const { Company } = require('../models/company.model');

const generateInvoiceNumber = async (companyId) => {
  const count = await Invoice.countDocuments({ companyId });
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `INV-${year}${month}-${String(count + 1).padStart(5, '0')}`;
};

const calculateDuration = (checkIn, checkOut) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const durationMs = checkOutDate - checkInDate;
  const hours = durationMs / (1000 * 60 * 60);
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  
  return {
    hours: Math.floor(hours),
    days: days
  };
};

const getRateDescription = (checkIn, checkOut, booking, room, roomType) => {
  const duration = calculateDuration(checkIn, checkOut);
  
  if (booking.rateType === 'negotiated') {
    return `Tarif négocié pour ${duration.days} jour(s) et ${duration.hours % 24} heure(s)`;
  }
  
  if (duration.hours < 12) {
    const rate = room.customHourlyRate || roomType.hourlyRate;
    return `${duration.hours} heure(s) × ${rate} = ${booking.finalAmount}`;
  } else if (duration.hours < 24) {
    const rate = room.customNightRate || roomType.nightRate;
    return `Tarif nuit (${duration.hours}h) = ${rate}`;
  } else {
    const rate = room.customFullDayRate || roomType.fullDayRate;
    return `${duration.days} jour(s) × ${rate} = ${booking.finalAmount}`;
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, companyId })
      .populate({
        path: 'roomId',
        populate: { path: 'roomTypeId' }
      });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'checked-out') {
      return res.status(400).json({ message: 'Booking must be checked out before creating an invoice' });
    }

    const existingInvoice = await Invoice.findOne({ bookingId, companyId });
    if (existingInvoice) {
      return res.status(400).json({ message: 'Invoice already exists for this booking' });
    }

    const invoiceNumber = await generateInvoiceNumber(companyId);
    const room = booking.roomId;
    const roomType = room.roomTypeId;
    const duration = calculateDuration(booking.checkIn, booking.checkOut);
    const rateDetails = getRateDescription(booking.checkIn, booking.checkOut, booking, room, roomType);

    let rateApplied = 'standard';
    if (booking.rateType === 'negotiated') {
      rateApplied = 'negotiated';
    } else if (duration.hours < 12) {
      rateApplied = 'hourly';
    } else if (duration.hours < 24) {
      rateApplied = 'night';
    } else {
      rateApplied = 'fullDay';
    }

    const invoice = new Invoice({
      companyId,
      bookingId,
      invoiceNumber,
      clientName: booking.clientName,
      roomNumber: room.roomNumber,
      roomType: roomType.name,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      duration,
      rateApplied,
      rateDetails,
      totalAmount: booking.finalAmount,
      cardNumber: booking.cardNumber,
      status: 'issued'
    });

    await invoice.save();
    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: 'Error creating invoice', error: error.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { page = 1, limit = 10, status, clientName, startDate, endDate, invoiceNumber } = req.query;

    const query = { companyId };
    if (status) query.status = status;
    if (clientName) query.clientName = { $regex: clientName, $options: 'i' };
    if (invoiceNumber) query.invoiceNumber = { $regex: invoiceNumber, $options: 'i' };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const invoices = await Invoice.find(query)
      .populate('bookingId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Invoice.countDocuments(query);

    res.status(200).json({
      invoices,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Error fetching invoices', error: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const companyId = req.companyId;
    const invoice = await Invoice.findOne({ _id: req.params.id, companyId })
      .populate({
        path: 'bookingId',
        populate: {
          path: 'roomId',
          populate: { path: 'roomTypeId' }
        }
      });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ invoice });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Error fetching invoice', error: error.message });
  }
};

exports.getInvoiceByNumber = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { invoiceNumber } = req.params;

    const invoice = await Invoice.findOne({ invoiceNumber, companyId })
      .populate({
        path: 'bookingId',
        populate: {
          path: 'roomId',
          populate: { path: 'roomTypeId' }
        }
      });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ invoice });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Error fetching invoice', error: error.message });
  }
};

exports.updateInvoiceStatus = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { status } = req.body;

    if (!['draft', 'issued', 'paid', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, companyId },
      { status },
      { new: true }
    ).populate('bookingId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice status updated successfully', invoice });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({ message: 'Error updating invoice status', error: error.message });
  }
};

exports.generateInvoicePDF = async (req, res) => {
  try {
    const companyId = req.companyId;
    const invoice = await Invoice.findOne({ _id: req.params.id, companyId })
      .populate({
        path: 'bookingId',
        populate: {
          path: 'roomId',
          populate: { path: 'roomTypeId' }
        }
      });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const company = await Company.findById(companyId);

    const invoiceData = {
      invoice,
      company: {
        name: company.name,
        address: company.address,
        currency: company.currency || 'USD',
        signCurrency: company.signCurrency || '$'
      }
    };

    res.status(200).json({ 
      message: 'Invoice data ready for PDF generation', 
      data: invoiceData 
    });
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    res.status(500).json({ message: 'Error generating invoice PDF', error: error.message });
  }
};
