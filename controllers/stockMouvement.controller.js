const {StockMovement} = require('../models/stockMovement.model'); // Import the StockMovement model
const {Product} = require('../models/product.model'); // Assuming you have a Product model
const {Company} = require('../models/company.model'); // Assuming you have a Company model


const createStockMovement = async (req, res) => {
  try {
    const { companyId, productId, movementType, quantity, saleId } = req.body;

    // Ensure the product and company exist before creating the stock movement
    const companyExists = await Company.findById(companyId);
    const productExists = await Product.findById(productId);

    if (!companyExists || !productExists) {
      return res.status(404).json({ message: 'Company or Product not found' });
    }

    const newStockMovement = new StockMovement({
      companyId,
      productId,
      movementType,
      quantity,
      saleId
    });

    const savedStockMovement = await newStockMovement.save();
    res.status(201).json(savedStockMovement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllStockMovements = async (req, res) => {
  try {
    const stockMovements = await StockMovement.find()
      .populate('companyId', 'name')  // Populate the company name
      .populate('productId', 'name'); // Populate the product name

    res.status(200).json(stockMovements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getStockMovementById = async (req, res) => {
  try {
    const { id } = req.params;
    const stockMovement = await StockMovement.findById(id)
      .populate('companyId', 'name')
      .populate('productId', 'name');

    if (!stockMovement) {
      return res.status(404).json({ message: 'Stock movement not found' });
    }

    res.status(200).json(stockMovement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateStockMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const stockMovement = await StockMovement.findByIdAndUpdate(id, updatedData, { new: true });

    if (!stockMovement) {
      return res.status(404).json({ message: 'Stock movement not found' });
    }

    res.status(200).json(stockMovement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteStockMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStockMovement = await StockMovement.findByIdAndDelete(id);

    if (!deletedStockMovement) {
      return res.status(404).json({ message: 'Stock movement not found' });
    }

    res.status(200).json({ message: 'Stock movement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStockMovement,
  getAllStockMovements,
  getStockMovementById,
  updateStockMovement,
  deleteStockMovement
};
