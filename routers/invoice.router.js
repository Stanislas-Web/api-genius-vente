const express = require('express');
const router = express.Router();
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  getInvoiceByNumber,
  updateInvoiceStatus,
  generateInvoicePDF
} = require('../controllers/invoice.controller');

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Gestion des factures d'hôtel
 */

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Créer une facture à partir d'une réservation
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *           example:
 *             bookingId: "6734be089acec1931a6e0b42"
 *     responses:
 *       201:
 *         description: Facture créée avec succès
 *       400:
 *         description: Réservation doit être check-out ou facture existe déjà
 *       404:
 *         description: Réservation non trouvée
 */
router.post('/', createInvoice);

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Récupérer toutes les factures
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, issued, paid, cancelled]
 *       - in: query
 *         name: clientName
 *         schema:
 *           type: string
 *       - in: query
 *         name: invoiceNumber
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Liste des factures
 */
router.get('/', getAllInvoices);

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Récupérer une facture par ID
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Facture trouvée
 *       404:
 *         description: Facture non trouvée
 */
router.get('/:id', getInvoiceById);

/**
 * @swagger
 * /invoices/number/{invoiceNumber}:
 *   get:
 *     summary: Récupérer une facture par numéro
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Facture trouvée
 *       404:
 *         description: Facture non trouvée
 */
router.get('/number/:invoiceNumber', getInvoiceByNumber);

/**
 * @swagger
 * /invoices/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une facture
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, issued, paid, cancelled]
 *           example:
 *             status: "paid"
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       404:
 *         description: Facture non trouvée
 */
router.patch('/:id/status', updateInvoiceStatus);

/**
 * @swagger
 * /invoices/{id}/pdf:
 *   get:
 *     summary: Générer le PDF d'une facture
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Données de la facture pour génération PDF
 *       404:
 *         description: Facture non trouvée
 */
router.get('/:id/pdf', generateInvoicePDF);

module.exports = router;
