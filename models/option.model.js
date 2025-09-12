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
 *         code:
 *           type: string
 *           description: Code unique de l'option
 *         sectionId:
 *           type: string
 *           description: Référence à la section (Section) - optionnel
 *         active:
 *           type: boolean
 *           description: Statut actif/inactif de l'option
 *           default: true
 *         companyId:
 *           type: string
 *           description: Référence à l'entreprise propriétaire
 */

const optionSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String },
  sectionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Section' 
  },
  active: { type: Boolean, default: true },
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true,
    index: true 
  }
}, { timestamps: true, versionKey: false });

// Index pour optimiser les requêtes par entreprise
optionSchema.index({ companyId: 1 });

// Index composite unique avec gestion des valeurs null
optionSchema.index({ 
  companyId: 1, 
  sectionId: 1, 
  code: 1 
}, { 
  unique: true,
  sparse: true,
  partialFilterExpression: {
    sectionId: { $exists: true, $ne: null },
    code: { $exists: true, $ne: null }
  }
});

module.exports.Option = model('Option', optionSchema);
