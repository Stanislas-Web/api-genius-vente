const Sale = require('../models/sale.model');
const Product = require('../models/product.model');
const { Company } = require('../models/company.model');

// Créer une vente
exports.createSale = async (req, res) => {
  try {
    const { companyId, products, userId, paymentMode, discount } = req.body;

    // Validation des champs requis
    if (!companyId || !products || !userId || !paymentMode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Vérifier si l'entreprise existe
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Calculer le montant total de la vente
    let totalAmount = 0;
    for (let product of products) {
      const { productId, quantity, unitPrice } = product;

      // Vérifier si le produit existe et s'il y a suffisamment de stock
      const productRecord = await Product.findById(productId);
      if (!productRecord) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }

      if (productRecord.quantity < quantity) {
        return res.status(400).json({ message: `Not enough stock for product: ${productId}` });
      }

      // Calculer le total pour ce produit
      product.total = unitPrice * quantity;
      totalAmount += product.total;

      // Réduire la quantité du produit en stock
      productRecord.quantity -= quantity;
      await productRecord.save();
    }

    // Appliquer la remise si elle existe
    if (discount) {
      totalAmount -= discount;
    }

    // Créer l'enregistrement de la vente
    const sale = new Sale({
      companyId,
      products,
      totalAmount,
      userId,
      paymentMode,
      discount: discount || 0,
      status: 'completed',
    });
    

    // Sauvegarder la vente
    await sale.save();

    res.status(201).json({ message: 'Sale created successfully', sale });
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ 
      message: 'Error creating sale', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
};

// Obtenir toutes les ventes pour une entreprise
exports.getAllSales = async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    // Récupérer toutes les ventes pour l'entreprise
    const sales = await Sale.find({ companyId }).populate('products.productId companyId userId');

    if (sales.length === 0) {
      return res.status(404).json({ message: 'No sales found for this company' });
    }

    res.status(200).json({ message: 'Sales retrieved successfully', sales });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving sales', error });
  }
};

// Obtenir une vente spécifique par ID
exports.getSaleById = async (req, res) => {
  try {
    const { saleId } = req.params;

    // Trouver la vente par ID
    const sale = await Sale.findById(saleId).populate('products.productId companyId userId');

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.status(200).json({ message: 'Sale retrieved successfully', sale });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving sale', error });
  }
};

// Mettre à jour une vente
exports.updateSale = async (req, res) => {
  try {
    const { saleId } = req.params;
    const { products, paymentMode, discount } = req.body;

    // Trouver la vente par ID
    const sale = await Sale.findById(saleId);

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Calculer le nouveau montant total de la vente
    let totalAmount = 0;
    for (let product of products) {
      const { productId, quantity, unitPrice } = product;

      // Vérifier si le produit existe et s'il y a suffisamment de stock
      const productRecord = await Product.findById(productId);
      if (!productRecord) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }

      if (productRecord.quantity < quantity) {
        return res.status(400).json({ message: `Not enough stock for product: ${productId}` });
      }

      // Calculer le total pour ce produit
      product.total = unitPrice * quantity;
      totalAmount += product.total;

      // Réduire la quantité du produit en stock
      productRecord.quantity -= quantity;
      await productRecord.save();
    }

    // Appliquer la remise si elle existe
    if (discount) {
      totalAmount -= discount;
    }

    // Mettre à jour les informations de la vente
    sale.products = products;
    sale.totalAmount = totalAmount;
    sale.paymentMode = paymentMode;
    sale.discount = discount || 0;
    sale.updatedAt = new Date();

    await sale.save();

    res.status(200).json({ message: 'Sale updated successfully', sale });
  } catch (error) {
    res.status(500).json({ message: 'Error updating sale', error });
  }
};

// Supprimer une vente
exports.deleteSale = async (req, res) => {
  try {
    const { saleId } = req.params;

    // Trouver la vente par ID
    const sale = await Sale.findById(saleId);

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    // Restaurer le stock des produits
    for (let product of sale.products) {
      const productRecord = await Product.findById(product.productId);
      if (productRecord) {
        productRecord.quantity += product.quantity;
        await productRecord.save();
      }
    }

    // Supprimer l'enregistrement de la vente
    await sale.remove();

    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sale', error });
  }
};
