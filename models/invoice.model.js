const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       required:
 *         - companyId
 *         - bookingId
 *         - invoiceNumber
 *         - totalAmount
 *       properties:
 *         companyId:
 *           type: string
 *           description: ID de l'entreprise (hôtel)
 *         bookingId:
 *           type: string
 *           description: ID de la réservation associée
 *         invoiceNumber:
 *           type: string
 *           description: Numéro de facture unique
 *         clientName:
 *           type: string
 *           description: Nom du client
 *         roomNumber:
 *           type: string
 *           description: Numéro de chambre
 *         roomType:
 *           type: string
 *           description: Type de chambre
 *         checkIn:
 *           type: string
 *           format: date-time
 *           description: Date et heure d'arrivée
 *         checkOut:
 *           type: string
 *           format: date-time
 *           description: Date et heure de départ
 *         duration:
 *           type: object
 *           properties:
 *             hours:
 *               type: number
 *             days:
 *               type: number
 *           description: Durée du séjour
 *         rateApplied:
 *           type: string
 *           description: Type de tarif appliqué (hourly, night, fullDay, negotiated)
 *         rateDetails:
 *           type: string
 *           description: Détails du calcul du tarif
 *         totalAmount:
 *           type: number
 *           description: Montant total de la facture
 *         cardNumber:
 *           type: string
 *           description: Numéro de carte du client (optionnel)
 *         qrCode:
 *           type: string
 *           description: QR code pour vérification
 *         status:
 *           type: string
 *           enum: [draft, issued, paid, cancelled]
 *           description: Statut de la facture
 */
const invoiceSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  clientName: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String
  },
  roomType: {
    type: String
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  duration: {
    hours: { type: Number, default: 0 },
    days: { type: Number, default: 0 }
  },
  rateApplied: {
    type: String
  },
  rateDetails: {
    type: String
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  cardNumber: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'issued', 'paid', 'cancelled'],
    default: 'draft'
  }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Invoice', invoiceSchema);
