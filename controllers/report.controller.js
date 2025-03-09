const Report = require('../models/report.model');
const Company = require('../models/company.model');
const Product = require('../models/product.model');
const Sale = require('../models/sale.model');

// Fonction utilitaire pour générer un rapport de ventes
const generateSalesReportData = async (companyId, startDate, endDate) => {
  // Retrieve sales data for the company within the specified date range
  const sales = await Sale.find({
    companyId,
    ...(startDate && endDate ? {
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    } : {})
  })
  .populate('products.productId', 'name')
  .populate('userId', 'name')
  .lean();

  if (!sales || sales.length === 0) {
    throw new Error('No sales found for the specified period');
  }

  // Aggregate sales data
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalQuantitySold = sales.reduce((acc, sale) => 
    acc + sale.products.reduce((prodAcc, prod) => prodAcc + prod.quantity, 0), 0
  );

  // Produits les plus vendus
  const productSales = {};
  sales.forEach(sale => {
    sale.products.forEach(prod => {
      if (!productSales[prod.productId._id]) {
        productSales[prod.productId._id] = {
          productName: prod.productId.name,
          quantity: 0,
          revenue: 0
        };
      }
      productSales[prod.productId._id].quantity += prod.quantity;
      productSales[prod.productId._id].revenue += prod.total;
    });
  });

  const topProducts = Object.entries(productSales)
    .map(([productId, data]) => ({
      productId,
      ...data
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Modes de paiement
  const paymentModes = sales.reduce((acc, sale) => {
    acc[sale.paymentMode] = (acc[sale.paymentMode] || 0) + sale.totalAmount;
    return acc;
  }, {});

  return {
    companyId,
    period: {
      startDate,
      endDate
    },
    summary: {
      totalRevenue,
      totalQuantitySold,
      numberOfSales: sales.length,
      averageTransactionValue: totalRevenue / sales.length
    },
    topProducts,
    paymentModes,
    salesByDay: sales.reduce((acc, sale) => {
      const date = sale.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          revenue: 0,
          numberOfSales: 0,
          quantity: 0
        };
      }
      acc[date].revenue += sale.totalAmount;
      acc[date].numberOfSales += 1;
      acc[date].quantity += sale.products.reduce((sum, prod) => sum + prod.quantity, 0);
      return acc;
    }, {}),
    sales: sales.map(sale => ({
      id: sale._id,
      date: sale.createdAt,
      totalAmount: sale.totalAmount,
      paymentMode: sale.paymentMode,
      status: sale.status,
      seller: sale.userId.name,
      products: sale.products.map(prod => ({
        name: prod.productId.name,
        quantity: prod.quantity,
        unitPrice: prod.unitPrice,
        total: prod.total
      }))
    }))
  };
};

// Fonction utilitaire pour générer un rapport de produits
const generateProductReportData = async (companyId) => {
  // Retrieve products for the company
  const products = await Product.find({ companyId });

  if (products.length === 0) {
    throw new Error('No products found for this company');
  }

  // Get all sales for these products
  const sales = await Sale.find({
    companyId,
    'products.productId': { $in: products.map(p => p._id) }
  }).lean();

  // Generate a report of product stock levels and sales
  return await Promise.all(products.map(async (product) => {
    const productSales = sales.reduce((acc, sale) => {
      const productInSale = sale.products.find(p => p.productId.toString() === product._id.toString());
      if (productInSale) {
        acc.totalQuantitySold += productInSale.quantity;
        acc.totalRevenue += productInSale.total;
      }
      return acc;
    }, { totalQuantitySold: 0, totalRevenue: 0 });

    return {
      productId: product._id,
      productName: product.name,
      stockLevel: product.quantity,
      ...productSales,
      averageSellingPrice: productSales.totalQuantitySold > 0 
        ? productSales.totalRevenue / productSales.totalQuantitySold 
        : 0
    };
  }));
};

// Generate a sales report for a specific company
exports.generateSalesReport = async (req, res) => {
  try {
    const { companyId, startDate, endDate } = req.body;

    // Validation of dates
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide both start and end dates' });
    }

    const report = await generateSalesReportData(companyId, startDate, endDate);
    res.status(200).json({ message: 'Sales report generated successfully', report });
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ message: 'Error generating sales report', error: error.message });
  }
};

// Generate a product report (stock levels, sold quantity, etc.)
exports.generateProductReport = async (req, res) => {
  try {
    const { companyId } = req.body;
    const productReport = await generateProductReportData(companyId);
    res.status(200).json({ message: 'Product report generated successfully', productReport });
  } catch (error) {
    console.error('Error generating product report:', error);
    res.status(500).json({ message: 'Error generating product report', error: error.message });
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

    const report = await generateSalesReportData(companyId, startDate, endDate);
    res.status(200).json({ message: 'Financial report generated successfully', report });
  } catch (error) {
    console.error('Error generating financial report:', error);
    res.status(500).json({ message: 'Error generating financial report', error: error.message });
  }
};

// Generate an overall report for a company (including product and sales data)
exports.generateCompanyReport = async (req, res) => {
  try {
    const { companyId, startDate, endDate } = req.body;

    // Validation des données
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    // Vérifier si l'entreprise existe
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Générer les rapports
    const [salesReport, productReport] = await Promise.all([
      generateSalesReportData(companyId, startDate, endDate),
      generateProductReportData(companyId)
    ]);

    // Combiner les rapports
    const companyReport = {
      company: {
        id: company._id,
        name: company.name
      },
      period: {
        startDate,
        endDate
      },
      salesReport,
      productReport
    };

    res.status(200).json({ 
      message: 'Company report generated successfully', 
      report: companyReport 
    });
  } catch (error) {
    console.error('Error generating company report:', error);
    res.status(500).json({ 
      message: 'Error generating company report', 
      error: error.message 
    });
  }
};
