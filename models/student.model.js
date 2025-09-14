const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - companyId
 *         - matricule
 *         - lastName
 *         - firstName
 *         - gender
 *         - classroomId
 *         - schoolYear
 *       properties:
 *         companyId:
 *           type: string
 *           description: Référence à l'entreprise (Company)
 *         matricule:
 *           type: string
 *           description: Matricule unique de l'élève - ex ELV-123456
 *         lastName:
 *           type: string
 *           description: Nom de famille de l'élève
 *         middleName:
 *           type: string
 *           description: Nom du milieu de l'élève
 *         firstName:
 *           type: string
 *           description: Prénom de l'élève
 *         gender:
 *           type: string
 *           enum: [M, F]
 *           description: Genre de l'élève
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Date de naissance de l'élève
 *         tuteur:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Nom du tuteur
 *             phone:
 *               type: string
 *               description: Téléphone du tuteur
 *         classroomId:
 *           type: string
 *           description: Référence à la classe (Classroom)
 *         schoolYear:
 *           type: string
 *           description: Année scolaire - ex 2025-2026
 *         status:
 *           type: string
 *           enum: [actif, transfert, sorti]
 *           description: Statut de l'élève
 *           default: actif
 */
const studentSchema = new Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true, 
    index: true 
  },
  matricule: { 
    type: String, 
    required: true, 
    uppercase: true, 
    unique: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  middleName: { 
    type: String 
  },
  firstName: { 
    type: String, 
    required: true 
  },
  gender: { 
    type: String, 
    enum: ['M', 'F'], 
    required: true 
  },
  birthDate: { 
    type: Date 
  },
  tuteur: {
    name: { type: String },
    phone: { type: String }
  },
  classroomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Classroom', 
    required: true 
  },
  schoolYear: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['actif', 'transfert', 'sorti'], 
    default: 'actif' 
  }
}, { 
  timestamps: true, 
  versionKey: false 
});

// Index pour optimiser les requêtes multi-tenant
studentSchema.index({ companyId: 1, classroomId: 1, schoolYear: 1 });

// Index de recherche textuelle
studentSchema.index({ 
  lastName: 'text', 
  middleName: 'text', 
  firstName: 'text' 
});

module.exports.Student = model('Student', studentSchema);
