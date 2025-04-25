const axios = require('axios');
const { User } = require('../models/user.model');
const Sale = require('../models/sale.model');
const { Company } = require('../models/company.model');

/**
 * Envoie un rapport de ventes journalier à l'utilisateur via WhatsApp
 */
exports.sendSalesSummaryToWhatsApp = async (req, res) => {
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

    // Aggregate today's sales by product
    const todayProductSales = {};
    todaySales.forEach(sale => {
      if (!sale.products || !Array.isArray(sale.products)) {
        return;
      }
      
      sale.products.forEach(prod => {
        if (!prod || !prod.productId || !prod.productId._id) {
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

    // Convert today's products to array and sort by quantity
    const todayProductSalesArray = Object.values(todayProductSales);
    todayProductSalesArray.sort((a, b) => b.quantity - a.quantity);

    // Get most and least sold products for today
    const mostSoldToday = todayProductSalesArray.length > 0 
      ? todayProductSalesArray[0] 
      : { productName: "Aucun produit" };
      
    const leastSoldToday = todayProductSalesArray.length > 0 
      ? todayProductSalesArray[todayProductSalesArray.length - 1] 
      : { productName: "Aucun produit" };

    // Formatter les montants en utilisant le séparateur de milliers
    const formatAmount = (amount) => {
      return `${signCurrency} ${amount.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}`;
    };

    // Préparer les données pour WhatsApp
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
                "text": formatAmount(todaySalesAmount)
              },
              {
                "type": "text",
                "text": todaySales.length.toString()
              },
              {
                "type": "text",
                "text": mostSoldToday.productName
              },
              {
                "type": "text",
                "text": leastSoldToday.productName
              },
              {
                "type": "text",
                "text": formatAmount(totalSalesAmount)
              }
            ]
          }
        ]
      }
    };

    console.log('Données à envoyer à WhatsApp:', JSON.stringify(whatsappData, null, 2));

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://graph.facebook.com/v16.0/230630080143527/messages',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer EAALOqv96b5kBOyZBK9MAZCF7Ev63btHib6DKyOTudKXvNYFkZBDdYZA6LDE6nssXrTZCEkdLP3hZBRLky3LS4SC5ZByFOtTzXNBVac4SKZCQPIug7YksXgiyeDZAqvGkcusMzz1cDjPPKXNkoVvQ8wrEZA4veGrRIyStcKg7a0MxBD1TE1DRCW76VLJikBEb9DLa8RQYhhKtkn4GWdduA8'
      },
      data: JSON.stringify(whatsappData)
    };

    try {
      // Envoyer la requête à WhatsApp
      const response = await axios.request(config);
      console.log('Réponse WhatsApp:', JSON.stringify(response.data, null, 2));

      // Préparer la réponse pour l'utilisateur
      res.status(200).json({
        message: 'Sales summary sent to WhatsApp successfully',
        user: {
          username: user.username,
          phone: user.phone
        },
        summary: {
          todaySalesAmount,
          salesCountToday: todaySales.length,
          totalSalesAmount
        },
        dailyProducts: {
          mostSoldToday: mostSoldToday.productName,
          leastSoldToday: leastSoldToday.productName
        },
        whatsappResponse: response.data
      });
    } catch (whatsappError) {
      console.error('Erreur spécifique WhatsApp:', whatsappError.message);
      
      // Afficher les détails de l'erreur si disponibles
      if (whatsappError.response) {
        console.error('Détails de l\'erreur WhatsApp:', JSON.stringify(whatsappError.response.data, null, 2));
        
        res.status(500).json({ 
          message: 'Error sending message to WhatsApp', 
          error: whatsappError.message,
          details: whatsappError.response.data
        });
      } else {
        res.status(500).json({ 
          message: 'Error sending message to WhatsApp', 
          error: whatsappError.message
        });
      }
    }
  } catch (error) {
    console.error('Error sending sales summary to WhatsApp:', error);
    res.status(500).json({ 
      message: 'Error sending sales summary to WhatsApp', 
      error: error.message 
    });
  }
};
