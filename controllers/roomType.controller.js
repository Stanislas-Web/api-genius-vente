const RoomType = require('../models/roomType.model');

exports.createRoomType = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { name, description, hourlyRate, nightRate, fullDayRate, capacity, amenities } = req.body;

    const roomType = new RoomType({
      companyId,
      name,
      description,
      hourlyRate,
      nightRate,
      fullDayRate,
      capacity,
      amenities
    });

    await roomType.save();
    res.status(201).json({ message: 'Room type created successfully', roomType });
  } catch (error) {
    console.error('Error creating room type:', error);
    res.status(500).json({ message: 'Error creating room type', error: error.message });
  }
};

exports.getAllRoomTypes = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { page = 1, limit = 10, name } = req.query;

    const query = { companyId };
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const roomTypes = await RoomType.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await RoomType.countDocuments(query);

    res.status(200).json({
      roomTypes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Error fetching room types:', error);
    res.status(500).json({ message: 'Error fetching room types', error: error.message });
  }
};

exports.getRoomTypeById = async (req, res) => {
  try {
    const companyId = req.companyId;
    const roomType = await RoomType.findOne({ _id: req.params.id, companyId });

    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }

    res.status(200).json({ roomType });
  } catch (error) {
    console.error('Error fetching room type:', error);
    res.status(500).json({ message: 'Error fetching room type', error: error.message });
  }
};

exports.updateRoomType = async (req, res) => {
  try {
    const companyId = req.companyId;
    const roomType = await RoomType.findOneAndUpdate(
      { _id: req.params.id, companyId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }

    res.status(200).json({ message: 'Room type updated successfully', roomType });
  } catch (error) {
    console.error('Error updating room type:', error);
    res.status(500).json({ message: 'Error updating room type', error: error.message });
  }
};

exports.deleteRoomType = async (req, res) => {
  try {
    const companyId = req.companyId;
    const roomType = await RoomType.findOneAndDelete({ _id: req.params.id, companyId });

    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found' });
    }

    res.status(200).json({ message: 'Room type deleted successfully' });
  } catch (error) {
    console.error('Error deleting room type:', error);
    res.status(500).json({ message: 'Error deleting room type', error: error.message });
  }
};
