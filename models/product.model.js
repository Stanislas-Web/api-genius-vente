const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - purchasePrice
 *         - salePrice
 *         - quantity
 *         - companyId
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product
 *         code:
 *           type: string
 *           description: The code of the product
 *         purchasePrice:
 *           type: number
 *           format: float
 *           description: The price at which the product was purchased
 *         salePrice:
 *           type: number
 *           format: float
 *           description: The price at which the product is sold
 *         quantity:
 *           type: integer
 *           description: The quantity of the product in stock
 *         companyId:
 *           type: string
 *           description: The reference to the company that owns the product (reference to the Company model)
 *         dateAdded:
 *           type: string
 *           format: date-time
 *           description: The date and time when the product was added to the system
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the product record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the product record was last updated
 */
const productSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String},
  purchasePrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  dateAdded: { type: Date, default: Date.now }
}, { timestamps: true, versionKey: false });

module.exports = model('Product', productSchema);
