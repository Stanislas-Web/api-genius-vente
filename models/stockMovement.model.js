const mongoose = require('mongoose');
/**
 * @swagger
 * components:
 *   schemas:
 *     StockMovement:
 *       type: object
 *       required:
 *         - companyId
 *         - productId
 *         - movementType
 *         - quantity
 *       properties:
 *         companyId:
 *           type: string
 *           description: Reference to the company (ID of the Company model)
 *         productId:
 *           type: string
 *           description: Reference to the product (ID of the Product model)
 *         movementType:
 *           type: string
 *           enum: [in, out]
 *           description: Type of movement (either "in" for stock entry or "out" for stock exit)
 *         quantity:
 *           type: number
 *           description: Quantity of the product moved (either added or removed)
 *         movementDate:
 *           type: string
 *           format: date
 *           description: Date of the stock movement
 *         saleId:
 *           type: string
 *           description: Reference to the sale (if applicable, the movement is related to a sale)
 */
const stockMovementSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  movementType: { type: String, enum: ['in', 'out'], required: true },
  quantity: { type: Number, required: true },
  movementDate: { type: Date, default: Date.now },
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('StockMovement', stockMovementSchema);
