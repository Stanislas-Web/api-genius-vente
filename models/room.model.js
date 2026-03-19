const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - companyId
 *         - roomNumber
 *         - roomTypeId
 *       properties:
 *         companyId:
 *           type: string
 *           description: ID de l'entreprise (hôtel)
 *         roomNumber:
 *           type: string
 *           description: Numéro de la chambre (ex. 101, 201, Suite A)
 *         roomTypeId:
 *           type: string
 *           description: ID du type de chambre
 *         status:
 *           type: string
 *           enum: [available, occupied, maintenance, reserved]
 *           description: Statut de la chambre
 *         capacity:
 *           type: number
 *           description: Capacité de cette chambre spécifique
 *         description:
 *           type: string
 *           description: Description spécifique de cette chambre
 *         customHourlyRate:
 *           type: number
 *           description: Tarif horaire personnalisé (optionnel)
 *         customNightRate:
 *           type: number
 *           description: Tarif nuit personnalisé (optionnel)
 *         customFullDayRate:
 *           type: number
 *           description: Tarif 24h personnalisé (optionnel)
 *         floor:
 *           type: number
 *           description: Étage de la chambre
 */
const roomSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  roomTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomType',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available'
  },
  capacity: {
    type: Number
  },
  description: {
    type: String,
    default: ''
  },
  customHourlyRate: {
    type: Number,
    min: 0
  },
  customNightRate: {
    type: Number,
    min: 0
  },
  customFullDayRate: {
    type: Number,
    min: 0
  },
  floor: {
    type: Number
  }
}, { timestamps: true, versionKey: false });

// Index pour éviter les doublons de numéro de chambre dans une même entreprise
roomSchema.index({ companyId: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', roomSchema);
