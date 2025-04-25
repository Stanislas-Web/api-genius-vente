const axios = require('axios');
const { User } = require('../models/user.model');

/**
 * Envoie un message texte simple via WhatsApp
 */
exports.sendSimpleTextMessage = async (req, res) => {
  try {
    const { phone, message } = req.body;

    // Validation des données
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Préparer les données pour WhatsApp (message texte simple)
    const whatsappData = {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": phone,
      "type": "text",
      "text": {
        "preview_url": false,
        "body": message
      }
    };

    console.log('Données à envoyer à WhatsApp (texte simple):', JSON.stringify(whatsappData, null, 2));

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
      console.log('Réponse WhatsApp (texte simple):', JSON.stringify(response.data, null, 2));

      // Préparer la réponse pour l'utilisateur
      res.status(200).json({
        message: 'Simple text message sent to WhatsApp successfully',
        phone: phone,
        sentMessage: message,
        whatsappResponse: response.data
      });
    } catch (whatsappError) {
      console.error('Erreur spécifique WhatsApp (texte simple):', whatsappError.message);
      
      // Afficher les détails de l'erreur si disponibles
      if (whatsappError.response) {
        console.error('Détails de l\'erreur WhatsApp (texte simple):', JSON.stringify(whatsappError.response.data, null, 2));
        
        res.status(500).json({ 
          message: 'Error sending simple text message to WhatsApp', 
          error: whatsappError.message,
          details: whatsappError.response.data
        });
      } else {
        res.status(500).json({ 
          message: 'Error sending simple text message to WhatsApp', 
          error: whatsappError.message
        });
      }
    }
  } catch (error) {
    console.error('Error in simple text message controller:', error);
    res.status(500).json({ 
      message: 'Error processing simple text message request', 
      error: error.message 
    });
  }
};
