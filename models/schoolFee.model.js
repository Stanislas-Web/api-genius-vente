const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     SchoolFee:
 *       type: object
 *       required:
 *         - companyId
 *         - label
 *         - schoolYear
 *       properties:
 *         companyId:
 *           type: string
 *           description: Référence à l'entreprise (Company)
 *         label:
 *           type: string
 *           description: Libellé du frais - ex Minerval Mensuel
 *         periodicity:
 *           type: string
 *           enum: [unique, mensuel, trimestriel]
 *           description: Périodicité du frais
 *           default: mensuel
 *         schoolYear:
 *           type: string
 *           description: Année scolaire - ex 2025-2026
 *         currency:
 *           type: string
 *           description: Devise du frais
 *           default: CDF
 *         allowCustomAmount:
 *           type: boolean
 *           description: Autoriser un montant personnalisé
 *           default: false
 *         fixedAmount:
 *           type: number
 *           description: Montant fixe du frais
 *           default: 0
 *         min:
 *           type: number
 *           description: Montant minimum autorisé
 *           default: 0
 *         max:
 *           type: number
 *           description: Montant maximum autorisé
 *           default: 0
 *         classroomId:
 *           type: string
 *           description: Référence à la classe pour override spécifique
 *         active:
 *           type: boolean
 *           description: Statut actif du frais
 *           default: true
 */
const schoolFeeSchema = new Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true, 
    index: true 
  },
  label: { 
    type: String, 
    required: true 
  },
  periodicity: { 
    type: String, 
    enum: ['unique', 'mensuel', 'trimestriel'], 
    default: 'mensuel' 
  },
  schoolYear: { 
    type: String, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'CDF' 
  },
  allowCustomAmount: { 
    type: Boolean, 
    default: false 
  },
  fixedAmount: { 
    type: Number, 
    default: 0 
  },
  min: { 
    type: Number, 
    default: 0 
  },
  max: { 
    type: Number, 
    default: 0 
  },
  classroomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Classroom' 
  },
  active: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true, 
  versionKey: false 
});

// Index pour optimiser les requêtes multi-tenant
schoolFeeSchema.index({ companyId: 1, schoolYear: 1 });

module.exports.SchoolFee = model('SchoolFee', schoolFeeSchema);
