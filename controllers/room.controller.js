const Room = require('../models/room.model');
const RoomType = require('../models/roomType.model');

exports.createRoom = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { roomNumber, roomTypeId, status, capacity, description, customHourlyRate, customNightRate, customFullDayRate, floor } = req.body;

    const roomType = await RoomType.findOne({ _id: roomTypeId, companyId });
    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }

    const existingRoom = await Room.findOne({ companyId, roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    const room = new Room({
      companyId,
      roomNumber,
      roomTypeId,
      status,
      capacity: capacity || roomType.capacity,
      description,
      customHourlyRate,
      customNightRate,
      customFullDayRate,
      floor
    });

    await room.save();
    await room.populate('roomTypeId');
    
    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Error creating room', error: error.message });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { page = 1, limit = 10, status, roomTypeId, roomNumber, floor } = req.query;

    const query = { companyId };
    if (status) query.status = status;
    if (roomTypeId) query.roomTypeId = roomTypeId;
    if (roomNumber) query.roomNumber = { $regex: roomNumber, $options: 'i' };
    if (floor) query.floor = floor;

    const rooms = await Room.find(query)
      .populate('roomTypeId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ roomNumber: 1 });

    const count = await Room.countDocuments(query);

    res.status(200).json({
      rooms,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const companyId = req.companyId;
    const room = await Room.findOne({ _id: req.params.id, companyId })
      .populate('roomTypeId');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ room });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const companyId = req.companyId;
    
    if (req.body.roomNumber) {
      const existingRoom = await Room.findOne({ 
        companyId, 
        roomNumber: req.body.roomNumber,
        _id: { $ne: req.params.id }
      });
      if (existingRoom) {
        return res.status(400).json({ message: 'Room number already exists' });
      }
    }

    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, companyId },
      req.body,
      { new: true, runValidators: true }
    ).populate('roomTypeId');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room updated successfully', room });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'Error updating room', error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const companyId = req.companyId;
    const room = await Room.findOneAndDelete({ _id: req.params.id, companyId });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
};

exports.updateRoomStatus = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { status } = req.body;

    if (!['available', 'occupied', 'maintenance', 'reserved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, companyId },
      { status },
      { new: true }
    ).populate('roomTypeId');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room status updated successfully', room });
  } catch (error) {
    console.error('Error updating room status:', error);
    res.status(500).json({ message: 'Error updating room status', error: error.message });
  }
};
