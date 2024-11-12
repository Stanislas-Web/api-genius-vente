const {Report} = require('../models/report.model'); // Si vous avez un modèle spécifique pour les rapports
const {Company} = require('../models/company.model');
const {Product} = require('../models/product.model');
const {Sale} = require('../models/sale.model'); // Assurez-vous d'avoir un modèle de ventes

// Generate a sales report for a specific company
exports.generateSalesReport = async (req, res) => {
  try {
    const { companyId, startDate, endDate } = req.body;

    // Validation of dates
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide both start and end dates' });
    }

    // Retrieve sales data for the company within the specified date range
    const sales = await Sale.find({
      companyId,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).populate('productId companyId');

    if (sales.length === 0) {
      return res.status(404).json({ message: 'No sales found for the specified date range' });
    }

    // Aggregate sales data (total revenue, total quantity sold, etc.)
    const totalRevenue = sales.reduce((acc, sale) => acc + (sale.salePrice * sale.quantity), 0);
    const totalQuantitySold = sales.reduce((acc, sale) => acc + sale.quantity, 0);

    const report = {
      companyId,
      startDate,
      endDate,
      totalRevenue,
      totalQuantitySold,
      sales
    };

    res.status(200).json({ message: 'Sales report generated successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Error generating sales report', error });
  }
};

// Generate a product report (stock levels, sold quantity, etc.)
exports.generateProductReport = async (req, res) => {
  try {
    const { companyId } = req.body;

    // Retrieve products for the company
    const products = await Product.find({ companyId });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this company' });
    }

    // Generate a report of product stock levels and sales
    const productReport = await Promise.all(products.map(async (product) => {
      const salesData = await Sale.aggregate([
        { $match: { productId: product._id, companyId } },
        { $group: { _id: '$productId', totalQuantitySold: { $sum: '$quantity' }, totalRevenue: { $sum: { $multiply: ['$salePrice', '$quantity'] } } } }
      ]);

      return {
        productId: product._id,
        productName: product.name,
        stockLevel: product.quantity,
        totalQuantitySold: salesData[0] ? salesData[0].totalQuantitySold : 0,
        totalRevenue: salesData[0] ? salesData[0].totalRevenue : 0
      };
    }));

    res.status(200).json({ message: 'Product report generated successfully', productReport });
  } catch (error) {
    res.status(500).json({ message: 'Error generating product report', error });
  }
};

// Generate a company financial report (revenue, expenses, profits)
exports.generateFinancialReport = async (req, res) => {
  try {
    const { companyId, startDate, endDate } = req.body;

    // Validation of dates
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide both start and end dates' });
    }

    // Retrieve the company's sales and expenses data within the specified date range
    const sales = await Sale.find({
      companyId,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    // Assuming you have an Expense model to track company expenses
    const expenses = await Expense.find({
      companyId,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    // Calculate total revenue from sales and total expenses
    const totalRevenue = sales.reduce((acc, sale) => acc + (sale.salePrice * sale.quantity), 0);
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const profit = totalRevenue - totalExpenses;

    const report = {
      companyId,
      startDate,
      endDate,
      totalRevenue,
      totalExpenses,
      profit,
      sales,
      expenses
    };

    res.status(200).json({ message: 'Financial report generated successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Error generating financial report', error });
  }
};

// Generate an overall report for a company (including product and sales data)
exports.generateCompanyReport = async (req, res) => {
  try {
    const { companyId } = req.body;

    // Get sales and product data for the company
    const salesReport = await this.generateSalesReport({ body: { companyId } });
    const productReport = await this.generateProductReport({ body: { companyId } });

    // Combine both reports into one comprehensive report
    const companyReport = {
      companyId,
      salesReport: salesReport.report,
      productReport: productReport.productReport
    };

    res.status(200).json({ message: 'Company report generated successfully', companyReport });
  } catch (error) {
    res.status(500).json({ message: 'Error generating company report', error });
  }
};
