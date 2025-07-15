const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - phone
 *         - role
 *         - companyId
 *       properties:
 *         username:
 *           type: string
 *           description: Nom d'utilisateur
 *         password:
 *           type: string
 *           description: Mot de passe de l'utilisateur
 *         phone:
 *           type: string
 *           description: Numéro de téléphone de l'utilisateur
 *         role:
 *           type: string
 *           enum: [Admin, Seller]
 *           description: Rôle de l'utilisateur dans l'entreprise
 *         companyId:
 *           type: string
 *           description: Référence à l'entreprise à laquelle l'utilisateur est affilié
 */

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Admin', 'Seller'], required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  lastLogin: { type: Date },
  isActived: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false });

module.exports.User = model('User', userSchema);