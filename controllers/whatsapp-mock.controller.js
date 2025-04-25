const fs = require('fs');
const path = require('path');
const { User } = require('../models/user.model');
const Sale = require('../models/sale.model');

/**
 * Simule l'envoi d'un message WhatsApp en stockant le message dans un fichier de logs
 */
exports.mockWhatsAppMessage = async (req, res) => {
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
      return amount.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    };

    // Créer le contenu du message qui serait envoyé à WhatsApp
    const messageContent = `
📊 *Résumé des ventes pour ${user.username}*

*Ventes du jour :* ${formatAmount(todaySalesAmount)} FC
*Nombre de ventes :* ${todaySales.length}
*Produit le plus vendu :* ${mostSoldToday.productName}
*Produit le moins vendu :* ${leastSoldToday.productName}
*Total des ventes :* ${formatAmount(totalSalesAmount)} FC

_Généré par Genius Vente le ${today.toLocaleDateString('fr-FR')} à ${today.toLocaleTimeString('fr-FR')}_
    `;

    // Créer un dossier logs s'il n'existe pas
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }

    // Écrire le message dans un fichier de logs
    const logFileName = `whatsapp_message_${Date.now()}.txt`;
    const logFilePath = path.join(logsDir, logFileName);
    fs.writeFileSync(logFilePath, `Destinataire: ${phone}\n\n${messageContent}`);

    // Retourner la réponse simulée
    res.status(200).json({
      message: 'WhatsApp message simulation completed successfully',
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
      whatsappMessageSimulation: {
        status: 'success',
        message: messageContent,
        logFile: logFileName
      }
    });
  } catch (error) {
    console.error('Error in WhatsApp mock controller:', error);
    res.status(500).json({ 
      message: 'Error processing WhatsApp mock request', 
      error: error.message 
    });
  }
};
