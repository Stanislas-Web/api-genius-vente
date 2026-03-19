const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - companyId
 *         - roomId
 *         - clientName
 *         - checkIn
 *       properties:
 *         companyId:
 *           type: string
 *           description: ID de l'entreprise (hôtel)
 *         roomId:
 *           type: string
 *           description: ID de la chambre réservée
 *         clientName:
 *           type: string
 *           description: Nom du client
 *         clientPhone:
 *           type: string
 *           description: Téléphone du client
 *         clientEmail:
 *           type: string
 *           description: Email du client
 *         cardNumber:
 *           type: string
 *           description: Numéro de carte du client (optionnel)
 *         checkIn:
 *           type: string
 *           format: date-time
 *           description: Date et heure d'arrivée
 *         checkOut:
 *           type: string
 *           format: date-time
 *           description: Date et heure de départ
 *         status:
 *           type: string
 *           enum: [pending, checked-in, checked-out, cancelled]
 *           description: Statut de la réservation
 *         rateType:
 *           type: string
 *           enum: [standard, negotiated]
 *           description: Type de tarif appliqué
 *         negotiatedRate:
 *           type: number
 *           description: Tarif négocié total (si applicable)
 *         calculatedAmount:
 *           type: number
 *           description: Montant calculé automatiquement
 *         finalAmount:
 *           type: number
 *           description: Montant final à payer
 *         notes:
 *           type: string
 *           description: Notes ou remarques sur la réservation
 */
const bookingSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientPhone: {
    type: String
  },
  clientEmail: {
    type: String
  },
  cardNumber: {
    type: String
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'checked-in', 'checked-out', 'cancelled'],
    default: 'pending'
  },
  rateType: {
    type: String,
    enum: ['standard', 'negotiated'],
    default: 'standard'
  },
  negotiatedRate: {
    type: Number,
    min: 0
  },
  calculatedAmount: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Booking', bookingSchema);
