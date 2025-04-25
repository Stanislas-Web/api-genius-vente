const Report = require('../models/report.model');
const { Company } = require('../models/company.model');
const Product = require('../models/product.model');
const Sale = require('../models/sale.model');
const { User } = require('../models/user.model');

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

// Generate a sales summary with top and bottom selling products
exports.generateSalesSummary = async (req, res) => {
  try {
    const { companyId } = req.body;

    // Validation des données
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    // Retrieve all sales for the company
    const sales = await Sale.find({ companyId })
      .populate('products.productId', 'name price')
      .lean();

    if (!sales || sales.length === 0) {
      return res.status(404).json({ message: 'No sales found for this company' });
    }

    // Calculate total sales amount
    const totalSalesAmount = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

    // Calculate today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of today
    
    const todaySales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= today;
    });
    
    const todaySalesAmount = todaySales.reduce((acc, sale) => acc + sale.totalAmount, 0);

    // Aggregate sales by product
    const productSales = {};
    sales.forEach(sale => {
      // Vérifier si products existe
      if (!sale.products || !Array.isArray(sale.products)) {
        console.log('Sale missing products array:', sale._id);
        return;
      }
      
      sale.products.forEach(prod => {
        // Vérifier si productId existe et a un _id
        if (!prod || !prod.productId || !prod.productId._id) {
          console.log('Invalid product in sale:', sale._id);
          return;
        }
        
        const productId = prod.productId._id.toString();
        if (!productSales[productId]) {
          productSales[productId] = {
            productId,
            productName: prod.productId.name,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[productId].quantity += prod.quantity;
        productSales[productId].revenue += prod.total;
      });
    });

    // Aggregate today's sales by product
    const todayProductSales = {};
    todaySales.forEach(sale => {
      // Vérifier si products existe
      if (!sale.products || !Array.isArray(sale.products)) {
        console.log('Sale missing products array today:', sale._id);
        return;
      }
      
      sale.products.forEach(prod => {
        // Vérifier si productId existe et a un _id
        if (!prod || !prod.productId || !prod.productId._id) {
          console.log('Invalid product in today sale:', sale._id);
          return;
        }
        
        const productId = prod.productId._id.toString();
        if (!todayProductSales[productId]) {
          todayProductSales[productId] = {
            productId,
            productName: prod.productId.name,
            quantity: 0,
            revenue: 0
          };
        }
        todayProductSales[productId].quantity += prod.quantity;
        todayProductSales[productId].revenue += prod.total;
      });
    });

    // Convert to array and sort by quantity
    const productSalesArray = Object.values(productSales);
    productSalesArray.sort((a, b) => b.quantity - a.quantity);

    // Convert today's products to array and sort by quantity
    const todayProductSalesArray = Object.values(todayProductSales);
    todayProductSalesArray.sort((a, b) => b.quantity - a.quantity);

    // Get most and least sold products
    const mostSoldProduct = productSalesArray.length > 0 ? productSalesArray[0] : null;
    const leastSoldProduct = productSalesArray.length > 0 ? productSalesArray[productSalesArray.length - 1] : null;

    // Get most and least sold products for today
    const todayMostSoldProduct = todayProductSalesArray.length > 0 ? todayProductSalesArray[0] : null;
    const todayLeastSoldProduct = todayProductSalesArray.length > 0 
      ? todayProductSalesArray[todayProductSalesArray.length - 1] 
      : null;

    res.status(200).json({
      message: 'Sales summary generated successfully',
      summary: {
        totalSalesAmount,
        todaySalesAmount,
        salesCountToday: todaySales.length
      },
      allTimeProducts: {
        mostSold: mostSoldProduct,
        leastSold: leastSoldProduct
      },
      dailyProducts: {
        todayDate: today.toISOString().split('T')[0],
        mostSoldToday: todayMostSoldProduct,
        leastSoldToday: todayLeastSoldProduct
      }
    });
  } catch (error) {
    console.error('Error generating sales summary:', error);
    res.status(500).json({ message: 'Error generating sales summary', error: error.message });
  }
};

// Generate a sales summary with top and bottom selling products using phone number
exports.generateSalesSummaryByPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validation des données
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Find user by phone number
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this phone number' });
    }

    const companyId = user.companyId;

    // Récupérer les informations de l'entreprise pour la devise
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found for this user' });
    }

    // Récupérer la devise
    const currency = company.currency || "FC";
    const signCurrency = company.signCurrency || "";

    // Retrieve all sales for the company
    const sales = await Sale.find({ companyId })
      .populate('products.productId', 'name price')
      .lean();

    if (!sales || sales.length === 0) {
      return res.status(404).json({ message: 'No sales found for this company' });
    }

    // Calculate total sales amount
    const totalSalesAmount = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
    
    // Calculate today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of today
    
    const todaySales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= today;
    });
    
    const todaySalesAmount = todaySales.reduce((acc, sale) => acc + sale.totalAmount, 0);

    // Aggregate sales by product
    const productSales = {};
    sales.forEach(sale => {
      // Vérifier si products existe
      if (!sale.products || !Array.isArray(sale.products)) {
        console.log('Sale missing products array:', sale._id);
        return;
      }
      
      sale.products.forEach(prod => {
        // Vérifier si productId existe et a un _id
        if (!prod || !prod.productId || !prod.productId._id) {
          console.log('Invalid product in sale:', sale._id);
          return;
        }
        
        const productId = prod.productId._id.toString();
        if (!productSales[productId]) {
          productSales[productId] = {
            productId,
            productName: prod.productId.name || 'Unknown Product',
            quantity: 0,
            revenue: 0
          };
        }
        productSales[productId].quantity += prod.quantity || 0;
        productSales[productId].revenue += prod.total || 0;
      });
    });

    // Aggregate today's sales by product
    const todayProductSales = {};
    todaySales.forEach(sale => {
      // Vérifier si products existe
      if (!sale.products || !Array.isArray(sale.products)) {
        console.log('Sale missing products array today:', sale._id);
        return;
      }
      
      sale.products.forEach(prod => {
        // Vérifier si productId existe et a un _id
        if (!prod || !prod.productId || !prod.productId._id) {
          console.log('Invalid product in today sale:', sale._id);
          return;
        }
        
        const productId = prod.productId._id.toString();
        if (!todayProductSales[productId]) {
          todayProductSales[productId] = {
            productId,
            productName: prod.productId.name || 'Unknown Product',
            quantity: 0,
            revenue: 0
          };
        }
        todayProductSales[productId].quantity += prod.quantity || 0;
        todayProductSales[productId].revenue += prod.total || 0;
      });
    });

    // Convert to array and sort by quantity
    const productSalesArray = Object.values(productSales);
    productSalesArray.sort((a, b) => b.quantity - a.quantity);

    // Convert today's products to array and sort by quantity
    const todayProductSalesArray = Object.values(todayProductSales);
    todayProductSalesArray.sort((a, b) => b.quantity - a.quantity);

    // Get most and least sold products
    const mostSoldProduct = productSalesArray.length > 0 ? productSalesArray[0] : null;
    const leastSoldProduct = productSalesArray.length > 0 ? productSalesArray[productSalesArray.length - 1] : null;

    // Get most and least sold products for today
    const todayMostSoldProduct = todayProductSalesArray.length > 0 ? todayProductSalesArray[0] : null;
    const todayLeastSoldProduct = todayProductSalesArray.length > 0 
      ? todayProductSalesArray[todayProductSalesArray.length - 1] 
      : null;

    // Formatter pour l'affichage des montants
    const formatAmount = (amount) => {
      return amount.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
    };

    // Préparer les données à retourner à l'API
    const apiResponse = {
      message: 'Sales summary generated successfully',
      user: {
        username: user.username,
        phone: user.phone,
        role: user.role
      },
      summary: {
        totalSalesAmount,
        todaySalesAmount,
        salesCountToday: todaySales.length
      },
      allTimeProducts: {
        mostSold: mostSoldProduct,
        leastSold: leastSoldProduct
      },
      dailyProducts: {
        todayDate: today.toISOString().split('T')[0],
        mostSoldToday: todayMostSoldProduct,
        leastSoldToday: todayLeastSoldProduct
      }
    };

    // Tentative d'envoi WhatsApp
    try {
      const axios = require('axios');

      // Données pour WhatsApp
      const whatsappData = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "template",
        "template": {
          "name": "price_day",
          "language": {
            "code": "fr"
          },
          "components": [
            {
              "type": "body",
              "parameters": [
                {
                  "type": "text",
                  "text": `${signCurrency} ${formatAmount(todaySalesAmount)}`
                },
                {
                  "type": "text",
                  "text": todaySales.length.toString()
                },
                {
                  "type": "text",
                  "text": todayMostSoldProduct ? todayMostSoldProduct.productName : "Aucun produit"
                },
                {
                  "type": "text",
                  "text": todayLeastSoldProduct ? todayLeastSoldProduct.productName : "Aucun produit"
                },
                {
                  "type": "text",
                  "text": `${signCurrency} ${formatAmount(totalSalesAmount)}`
                }
              ]
            }
          ]
        }
      };

      console.log('Tentative d\'envoi WhatsApp pour:', phone);
      console.log('Données WhatsApp:', JSON.stringify(whatsappData, null, 2));

      const whatsappConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://graph.facebook.com/v16.0/230630080143527/messages',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer EAALOqv96b5kBOyZBK9MAZCF7Ev63btHib6DKyOTudKXvNYFkZBDdYZA6LDE6nssXrTZCEkdLP3hZBRLky3LS4SC5ZByFOtTzXNBVac4SKZCQPIug7YksXgiyeDZAqvGkcusMzz1cDjPPKXNkoVvQ8wrEZA4veGrRIyStcKg7a0MxBD1TE1DRCW76VLJikBEb9DLa8RQYhhKtkn4GWdduA8'
        },
        data: JSON.stringify(whatsappData)
      };

      // Envoyer la requête WhatsApp de manière asynchrone (ne pas attendre la réponse)
      axios.request(whatsappConfig)
        .then(response => {
          console.log('Réponse WhatsApp:', JSON.stringify(response.data, null, 2));
        })
        .catch(error => {
          console.error('Erreur WhatsApp:', error.message);
          if (error.response) {
            console.error('Détails de l\'erreur WhatsApp:', JSON.stringify(error.response.data, null, 2));
          }
        });

      // Ajouter une indication que la tentative d'envoi WhatsApp a été faite
      apiResponse.whatsapp = {
        status: 'pending',
        message: 'WhatsApp message sending initiated'
      };
    } catch (whatsappError) {
      console.error('Erreur lors de la préparation du message WhatsApp:', whatsappError);
      // Ne pas bloquer la réponse API en cas d'erreur WhatsApp
      apiResponse.whatsapp = {
        status: 'error',
        message: 'Error preparing WhatsApp message'
      };
    }

    // Renvoyer la réponse API
    res.status(200).json(apiResponse);
  } catch (error) {
    console.error('Error generating sales summary by phone:', error);
    res.status(500).json({ message: 'Error generating sales summary', error: error.message });
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
