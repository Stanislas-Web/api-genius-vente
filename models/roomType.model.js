const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     RoomType:
 *       type: object
 *       required:
 *         - companyId
 *         - name
 *         - hourlyRate
 *         - nightRate
 *         - fullDayRate
 *       properties:
 *         companyId:
 *           type: string
 *           description: ID de l'entreprise (hôtel)
 *         name:
 *           type: string
 *           description: Nom du type de chambre (ex. Suite, Standard, Deluxe)
 *         description:
 *           type: string
 *           description: Description du type de chambre
 *         hourlyRate:
 *           type: number
 *           description: Tarif à l'heure
 *         nightRate:
 *           type: number
 *           description: Tarif pour une nuit (12h-24h)
 *         fullDayRate:
 *           type: number
 *           description: Tarif pour 24 heures complètes
 *         capacity:
 *           type: number
 *           description: Capacité standard pour ce type (nombre de personnes)
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des équipements (WiFi, TV, Climatisation, etc.)
 */
const roomTypeSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  nightRate: {
    type: Number,
    required: true,
    min: 0
  },
  fullDayRate: {
    type: Number,
    required: true,
    min: 0
  },
  capacity: {
    type: Number,
    default: 2
  },
  amenities: [{
    type: String
  }]
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('RoomType', roomTypeSchema);
