const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - name
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the company
 *         address:
 *           type: string
 *           description: The address of the company
 *         currency:
 *           type: string
 *           description: currency of the company
 *         signCurrency:
 *           type: string
 *           description: signCurrency of the company 
 *         lang:
 *           type: string
 *           description: lang of the company
 *         country:
 *           type: string
 *           description: country of the company
 *         category:
 *           type: string
 *           description: The category of the company (reference to the Category model)
 */
const companySchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  currency: { type: String, required: true },
  signCurrency: { type: String, required: true },
  lang: { type: String, required: true },
  country: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: true, versionKey: false });

module.exports = model('Company', companySchema);
