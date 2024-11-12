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
 *         category:
 *           type: string
 *           description: The category of the company (reference to the Category model)
 */
const companySchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: true, versionKey: false });

module.exports = model('Company', companySchema);
