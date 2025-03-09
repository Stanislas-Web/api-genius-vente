const express = require('express');
const router = express.Router();
const { generateSalesReport, generateProductReport, generateFinancialReport, generateCompanyReport } = require('../controllers/report.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /reports/sales:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Générer un rapport de ventes pour une entreprise
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - startDate
 *               - endDate
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: ID de l'entreprise pour laquelle générer le rapport
 *               startDate:
 *                 type: string
 *                 description: Date de début du rapport (format ISO 8601)
 *               endDate:
 *                 type: string
 *                 description: Date de fin du rapport (format ISO 8601)
 *           example:
 *             companyId: "6734be089acec1931a6e0b42"
 *             startDate: "2025-01-01"
 *             endDate: "2025-12-31"
 *     responses:
 *       200:
 *         description: Rapport de ventes généré avec succès
 *       400:
 *         description: Dates manquantes
 *       404:
 *         description: Aucune vente trouvée pour cette période
 */
router.post('/sales', isLoggedIn, generateSalesReport);

/**
 * @swagger
 * /reports/product:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Générer un rapport sur les produits d'une entreprise
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: ID de l'entreprise pour laquelle générer le rapport des produits
 *           example:
 *             companyId: "6734be089acec1931a6e0b42"
 *     responses:
 *       200:
 *         description: Rapport des produits généré avec succès
 *       404:
 *         description: Aucun produit trouvé pour cette entreprise
 */
router.post('/product', isLoggedIn, generateProductReport);

/**
 * @swagger
 * /reports/financial:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Générer un rapport financier pour une entreprise
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - startDate
 *               - endDate
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: ID de l'entreprise pour laquelle générer le rapport financier
 *               startDate:
 *                 type: string
 *                 description: Date de début du rapport (format ISO 8601)
 *               endDate:
 *                 type: string
 *                 description: Date de fin du rapport (format ISO 8601)
 *           example:
 *             companyId: "6734be089acec1931a6e0b42"
 *             startDate: "2025-01-01"
 *             endDate: "2025-12-31"
 *     responses:
 *       200:
 *         description: Rapport financier généré avec succès
 *       400:
 *         description: Dates manquantes
 */
router.post('/financial', isLoggedIn, generateFinancialReport);

/**
 * @swagger
 * /reports/company:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Générer un rapport complet pour une entreprise
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - startDate
 *               - endDate
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: ID de l'entreprise pour laquelle générer le rapport
 *               startDate:
 *                 type: string
 *                 description: Date de début du rapport (format ISO 8601)
 *               endDate:
 *                 type: string
 *                 description: Date de fin du rapport (format ISO 8601)
 *           example:
 *             companyId: "6734be089acec1931a6e0b42"
 *             startDate: "2025-01-01"
 *             endDate: "2025-12-31"
 *     responses:
 *       200:
 *         description: Rapport d'entreprise généré avec succès
 *       400:
 *         description: Données manquantes
 *       404:
 *         description: Entreprise non trouvée
 */
router.post('/company', isLoggedIn, generateCompanyReport);

module.exports = router;
