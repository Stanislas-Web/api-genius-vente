const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Sale:
 *       type: object
 *       required:
 *         - companyId
 *         - products
 *         - totalAmount
 *         - userId
 *         - paymentMode
 *       properties:
 *         companyId:
 *           type: string
 *           description: Reference to the company (ID of the Company model)
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Reference to the product (ID of the Product model)
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product sold
 *               unitPrice:
 *                 type: number
 *                 description: Price per unit of the product sold
 *               total:
 *                 type: number
 *                 description: Total price for this product (quantity * unitPrice)
 *         totalAmount:
 *           type: number
 *           description: Total amount of the sale transaction
 *         userId:
 *           type: string
 *           description: Reference to the user who processed the sale (ID of the User model)
 *         paymentMode:
 *           type: string
 *           enum: [Cash, Card]
 *           description: Mode of payment for the transaction
 *         status:
 *           type: string
 *           enum: [completed, pending]
 *           description: Status of the sale transaction (completed or pending)
 *         discount:
 *           type: number
 *           description: Discount applied to the sale transaction
 */
const saleSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      total: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentMode: { type: String, enum: ['Cash', 'Card'], required: true },
  status: { type: String, enum: ['completed', 'pending'], default: 'completed' },
  discount: { type: Number, default: 0 }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Sale', saleSchema);
