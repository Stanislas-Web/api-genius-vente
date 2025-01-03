const mongoose = require('mongoose');
const Product  = require('../models/product.model');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, purchasePrice, salePrice, code, quantity, companyId } = req.body;

    // Validate required fields
    if (!name || !purchasePrice || !salePrice || !quantity || !companyId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate companyId
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid companyId" });
    }

    // Create and save product
    const product = new Product({ name, description, purchasePrice, salePrice, code, quantity, companyId });
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};


// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('companyId');
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};


// Get products by Company ID
exports.getProductsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params; // Récupérer le companyId depuis les paramètres de l'URL
    const products = await Product.find({ companyId }).populate('companyId');
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found for this company' });
    }
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products for company', error });
  }
};


// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('companyId');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
