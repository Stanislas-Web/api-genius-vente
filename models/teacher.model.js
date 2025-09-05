const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - companyId
 *         - lastName
 *       properties:
 *         companyId:
 *           type: string
 *           description: Référence à l'entreprise (Company)
 *         code:
 *           type: string
 *           description: Code unique du professeur - ex PROF-0001
 *         lastName:
 *           type: string
 *           description: Nom de famille du professeur
 *         firstName:
 *           type: string
 *           description: Prénom du professeur
 *         phone:
 *           type: string
 *           description: Numéro de téléphone du professeur
 *         email:
 *           type: string
 *           description: Adresse email du professeur
 *         classes:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste des classes assignées au professeur
 *         active:
 *           type: boolean
 *           description: Statut actif du professeur
 *           default: true
 */
const teacherSchema = new Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true, 
    index: true 
  },
  code: { 
    type: String, 
    uppercase: true, 
    unique: true, 
    sparse: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  firstName: { 
    type: String 
  },
  phone: { 
    type: String 
  },
  email: { 
    type: String 
  },
  classes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Classroom' 
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
teacherSchema.index({ companyId: 1, lastName: 1 });

module.exports.Teacher = model('Teacher', teacherSchema);
