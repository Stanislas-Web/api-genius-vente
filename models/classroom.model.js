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
 *         section:
 *           type: string
 *           description: Section de la classe - ex Lettres
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
 *         option:
 *           type: string
 *           description: Option de la classe - ex Mathématiques, Sciences, etc
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
  section: { 
    type: String 
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
  option: { 
    type: String 
  }
}, { 
  timestamps: true, 
  versionKey: false 
});

// Index pour optimiser les requêtes multi-tenant
classroomSchema.index({ companyId: 1, schoolYear: 1, name: 1 });

module.exports.Classroom = model('Classroom', classroomSchema);
