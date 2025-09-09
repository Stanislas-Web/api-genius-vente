const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Option:
 *       type: object
 *       required:
 *         - name
 *         - companyId
 *       properties:
 *         name:
 *           type: string
 *           description: Nom de l'option
 *         active:
 *           type: boolean
 *           description: Statut actif/inactif de l'option
 *         companyId:
 *           type: string
 *           description: Référence à l'entreprise propriétaire
 */

const optionSchema = new Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }
}, { timestamps: true, versionKey: false });

// Index pour optimiser les requêtes par entreprise
optionSchema.index({ companyId: 1 });

module.exports.Option = model('Option', optionSchema);
