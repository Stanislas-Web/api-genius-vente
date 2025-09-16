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
 *         - classroomIds
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
 *         amount:
 *           type: number
 *           description: Montant fixe du frais scolaire
 *           required: true
 *         classroomIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Références aux classes concernées par ce frais
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
  amount: { 
    type: Number, 
    required: true 
  },
  classroomIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Classroom',
    required: true
  }],
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
schoolFeeSchema.index({ classroomIds: 1 });

module.exports.SchoolFee = model('SchoolFee', schoolFeeSchema);
