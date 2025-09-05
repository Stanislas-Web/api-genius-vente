const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - companyId
 *         - studentId
 *         - schoolFeeId
 *         - amount
 *         - paymentDate
 *       properties:
 *         companyId:
 *           type: string
 *           description: Référence à l'entreprise (Company)
 *         studentId:
 *           type: string
 *           description: Référence à l'élève (Student)
 *         schoolFeeId:
 *           type: string
 *           description: Référence au frais scolaire (SchoolFee)
 *         amount:
 *           type: number
 *           description: Montant payé
 *         paymentDate:
 *           type: string
 *           format: date
 *           description: Date du paiement
 *         paymentMethod:
 *           type: string
 *           enum: [cash, bank_transfer, mobile_money, check]
 *           description: Méthode de paiement
 *           default: cash
 *         reference:
 *           type: string
 *           description: Référence du paiement (numéro de chèque, transaction, etc.)
 *         notes:
 *           type: string
 *           description: Notes additionnelles sur le paiement
 *         status:
 *           type: string
 *           enum: [completed, partial, pending]
 *           description: Statut du paiement
 *           default: completed
 *         recordedBy:
 *           type: string
 *           description: ID de l'utilisateur qui a enregistré le paiement
 */
const paymentSchema = new Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true, 
    index: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true, 
    index: true 
  },
  schoolFeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SchoolFee', 
    required: true, 
    index: true 
  },
  amount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  paymentDate: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'bank_transfer', 'mobile_money', 'check'], 
    default: 'cash' 
  },
  reference: { 
    type: String 
  },
  notes: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['completed', 'partial', 'pending'], 
    default: 'completed' 
  },
  recordedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { 
  timestamps: true, 
  versionKey: false 
});

// Index pour optimiser les requêtes multi-tenant
paymentSchema.index({ companyId: 1, studentId: 1, schoolFeeId: 1 });
paymentSchema.index({ companyId: 1, paymentDate: -1 });

module.exports.Payment = model('Payment', paymentSchema);
