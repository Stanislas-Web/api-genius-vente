const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Classroom:
 *       type: object
 *       required:
 *         - companyId
 *         - code
 *         - name
 *         - schoolYear
 *       properties:
 *         companyId:
 *           type: string
 *           description: Référence à l'entreprise (Company)
 *         code:
 *           type: string
 *           description: Code de la classe - ex 6A-2025
 *         name:
 *           type: string
 *           description: Nom de la classe - ex 6ème A
 *         level:
 *           type: string
 *           description: Niveau de la classe - ex 6ème
 *         sectionId:
 *           type: string
 *           description: Référence à la section (Section) - optionnel
 *         schoolYear:
 *           type: string
 *           description: Année scolaire - ex 2025-2026
 *         capacity:
 *           type: number
 *           description: Capacité maximale de la classe
 *           default: 0
 *         active:
 *           type: boolean
 *           description: Statut actif de la classe
 *           default: true
 *         optionId:
 *           type: string
 *           description: Référence à l'option (Option) - facultatif
 */
const classroomSchema = new Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true, 
    index: true 
  },
  code: { 
    type: String, 
    required: true, 
    uppercase: true, 
    trim: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  level: { 
    type: String 
  },
  sectionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Section' 
  },
  schoolYear: { 
    type: String, 
    required: true 
  },
  capacity: { 
    type: Number, 
    default: 0 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  optionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Option' 
  }
}, { 
  timestamps: true, 
  versionKey: false 
});
// Index pour optimiser les requêtes multi-tenant
classroomSchema.index({ companyId: 1, schoolYear: 1, name: 1 });
module.exports.Classroom = model('Classroom', classroomSchema);
