const express = require('express');
const router = express.Router();
const { createSale, getAllSales, getSaleById, updateSale, deleteSale, createManySales } = require('../controllers/sale.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Sale:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier of the sale
 *         companyId:
 *           type: string
 *           description: ID of the company making the sale
 *         productId:
 *           type: string
 *           description: ID of the product sold
 *         quantity:
 *           type: number
 *           description: Quantity of the product sold
 *         salePrice:
 *           type: number
 *           description: Sale price of the product
 */

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: ID of the company making the sale
 *               products:
 *                 type: array
 *                 description: List of products sold
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID of the product being sold
 *                     quantity:
 *                       type: number
 *                       description: Quantity of the product sold
 *                     unitPrice:
 *                       type: number
 *                       description: Price per unit of the product
 *                     total:
 *                       type: number
 *                       description: Total price for the product (quantity * unitPrice)
 *               totalAmount:
 *                 type: number
 *                 description: Total amount of the sale transaction
 *               userId:
 *                 type: string
 *                 description: ID of the user processing the sale
 *               paymentMode:
 *                 type: string
 *                 enum: [Cash, Card]
 *                 description: Payment mode for the transaction
 *               status:
 *                 type: string
 *                 enum: [completed, pending]
 *                 description: Status of the sale transaction
 *               discount:
 *                 type: number
 *                 description: Discount applied to the sale transaction
 *     responses:
 *       201:
 *         description: Sale created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Missing required fields or invalid data
 *       404:
 *         description: Company or Product not found
 */

/**
 * @swagger
 * /many:
 *   post:
 *     summary: Create multiple sales in a single request
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sales
 *             properties:
 *               sales:
 *                 type: array
 *                 description: Array of sales to create
 *                 items:
 *                   type: object
 *                   required:
 *                     - companyId
 *                     - products
 *                     - userId
 *                     - paymentMode
 *                   properties:
 *                     companyId:
 *                       type: string
 *                       description: ID of the company making the sale
 *                     products:
 *                       type: array
 *                       description: List of products sold
 *                       items:
 *                         type: object
 *                         required:
 *                           - productId
 *                           - quantity
 *                           - unitPrice
 *                         properties:
 *                           productId:
 *                             type: string
 *                             description: ID of the product sold
 *                           quantity:
 *                             type: number
 *                             description: Quantity of the product sold
 *                           unitPrice:
 *                             type: number
 *                             description: Price per unit of the product
 *                     userId:
 *                       type: string
 *                       description: ID of the user processing the sale
 *                     paymentMode:
 *                       type: string
 *                       enum: [Cash, Card]
 *                       description: Mode of payment for the transaction
 *                     discount:
 *                       type: number
 *                       description: Discount applied to the sale (optional)
 *     responses:
 *       201:
 *         description: Sales created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully created 3 sales
 *                 sales:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Sale'
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       index:
 *                         type: number
 *                         description: Index of the sale in the input array that caused an error
 *                       message:
 *                         type: string
 *                         description: Error message
 *       400:
 *         description: Bad request, validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all sales for a company
 *     tags: [Sales]
 *     parameters:
 *       - in: query
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the company to get sales for
 *     responses:
 *       200:
 *         description: List of sales retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Company ID is required
 *       404:
 *         description: No sales found for this company
 */

/**
 * @swagger
 * /{saleId}:
 *   get:
 *     summary: Get a specific sale by ID
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: saleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sale to retrieve
 *     responses:
 *       200:
 *         description: Sale retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       404:
 *         description: Sale not found
 */

/**
 * @swagger
 * /{saleId}:
 *   put:
 *     summary: Update a sale
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: saleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sale to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: Updated company ID associated with the sale
 *               products:
 *                 type: array
 *                 description: List of updated products sold
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Updated product ID
 *                     quantity:
 *                       type: number
 *                       description: Updated quantity of the product sold
 *                     unitPrice:
 *                       type: number
 *                       description: Updated price per unit of the product
 *                     total:
 *                       type: number
 *                       description: Updated total price for the product
 *               totalAmount:
 *                 type: number
 *                 description: Updated total amount of the sale transaction
 *               userId:
 *                 type: string
 *                 description: Updated user ID who processed the sale
 *               paymentMode:
 *                 type: string
 *                 enum: [Cash, Card]
 *                 description: Updated mode of payment
 *               status:
 *                 type: string
 *                 enum: [completed, pending]
 *                 description: Updated status of the sale
 *               discount:
 *                 type: number
 *                 description: Updated discount on the sale
 *     responses:
 *       200:
 *         description: Sale updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       400:
 *         description: Invalid data or missing required fields
 *       404:
 *         description: Sale not found
 */

/**
 * @swagger
 * /{saleId}:
 *   delete:
 *     summary: Delete a sale
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: saleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sale to delete
 *     responses:
 *       200:
 *         description: Sale deleted successfully
 *       404:
 *         description: Sale not found
 */

// Routes
router.post('/', isLoggedIn, createSale);
router.post('/many', isLoggedIn, createManySales);
router.get('/', isLoggedIn, getAllSales);
router.get('/:saleId', isLoggedIn, getSaleById);
router.put('/:saleId', isLoggedIn, updateSale);
router.delete('/:saleId', isLoggedIn, deleteSale);

module.exports = router;
