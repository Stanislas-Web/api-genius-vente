const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Section:
 *       type: object
 *       required:
 *         - name
 *         - companyId
 *       properties:
 *         name:
 *           type: string
 *           description: Nom de la section
 *         active:
 *           type: boolean
 *           description: Statut actif/inactif de la section
 *         companyId:
 *           type: string
 *           description: Référence à l'entreprise propriétaire
 */

const sectionSchema = new Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }
}, { timestamps: true, versionKey: false });

// Index pour optimiser les requêtes par entreprise
sectionSchema.index({ companyId: 1 });

module.exports.Section = model('Section', sectionSchema);
