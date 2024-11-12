const router = require('express').Router();
const { generateSalesReport, generateProductReport, generateFinancialReport, generateCompanyReport } = require('../controllers/report.controller');
const { isLoggedIn } = require('../middleware'); // Import du middleware isLoggedIn

/**
 * @swagger
 * /reports/sales:
 *   post:
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
 *     responses:
 *       200:
 *         description: Rapport de ventes généré avec succès
 *       400:
 *         description: Dates manquantes
 *       404:
 *         description: Aucune vente trouvée pour cette période
 */
router.post('/reports/sales', isLoggedIn, generateSalesReport); // Middleware isLoggedIn ajouté

/**
 * @swagger
 * /reports/product:
 *   post:
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
 *     responses:
 *       200:
 *         description: Rapport des produits généré avec succès
 *       404:
 *         description: Aucun produit trouvé pour cette entreprise
 */
router.post('/reports/product', isLoggedIn, generateProductReport); // Middleware isLoggedIn ajouté

/**
 * @swagger
 * /reports/financial:
 *   post:
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
 *     responses:
 *       200:
 *         description: Rapport financier généré avec succès
 *       400:
 *         description: Dates manquantes
 */
router.post('/reports/financial', isLoggedIn, generateFinancialReport); // Middleware isLoggedIn ajouté

/**
 * @swagger
 * /reports/company:
 *   post:
 *     summary: Générer un rapport complet pour une entreprise, incluant les ventes et les produits
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
 *                 description: ID de l'entreprise pour laquelle générer un rapport complet
 *     responses:
 *       200:
 *         description: Rapport complet de l'entreprise généré avec succès
 *       404:
 *         description: Aucun rapport trouvé pour cette entreprise
 */
router.post('/reports/company', isLoggedIn, generateCompanyReport); // Middleware isLoggedIn ajouté

module.exports = router;
