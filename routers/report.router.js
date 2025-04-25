const express = require('express');
const router = express.Router();
const { generateSalesReport, generateProductReport, generateFinancialReport, generateCompanyReport, generateSalesSummary, generateSalesSummaryByPhone } = require('../controllers/report.controller');
const { sendSalesSummaryToWhatsApp } = require('../controllers/whatsapp.controller');
const { sendSimpleTextMessage } = require('../controllers/whatsapp-text.controller');
const { mockWhatsAppMessage } = require('../controllers/whatsapp-mock.controller');
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

/**
 * @swagger
 * /reports/sales-summary:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir le montant total des ventes et les produits les plus et moins vendus
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
 *                 description: ID de l'entreprise pour laquelle générer le résumé des ventes
 *           example:
 *             companyId: "6734be089acec1931a6e0b42"
 *     responses:
 *       200:
 *         description: Résumé des ventes généré avec succès
 *       400:
 *         description: ID de l'entreprise manquant
 *       404:
 *         description: Aucune vente trouvée pour cette entreprise
 */
router.post('/sales-summary', isLoggedIn, generateSalesSummary);

/**
 * @swagger
 * /reports/sales-summary-by-phone:
 *   post:
 *     summary: Obtenir le montant total des ventes et les produits les plus et moins vendus à l'aide d'un numéro de téléphone
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur affilié à l'entreprise
 *           example:
 *             phone: "+243123456789"
 *     responses:
 *       200:
 *         description: Résumé des ventes généré avec succès
 *       400:
 *         description: Numéro de téléphone manquant
 *       404:
 *         description: Utilisateur ou ventes non trouvés
 */
router.post('/sales-summary-by-phone', generateSalesSummaryByPhone);

/**
 * @swagger
 * /reports/send-sales-summary-to-whatsapp:
 *   post:
 *     summary: Envoyer le résumé des ventes via WhatsApp
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - phone
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: ID de l'entreprise pour laquelle envoyer le résumé des ventes
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur affilié à l'entreprise
 *           example:
 *             companyId: "6734be089acec1931a6e0b42"
 *             phone: "+243123456789"
 *     responses:
 *       200:
 *         description: Résumé des ventes envoyé avec succès
 *       400:
 *         description: ID de l'entreprise ou numéro de téléphone manquant
 *       404:
 *         description: Aucune vente trouvée pour cette entreprise
 */
router.post('/send-sales-summary-to-whatsapp', sendSalesSummaryToWhatsApp);

/**
 * @swagger
 * /reports/send-simple-text-message:
 *   post:
 *     summary: Envoyer un message texte simple via WhatsApp
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - message
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur affilié à l'entreprise
 *               message:
 *                 type: string
 *                 description: Message texte à envoyer
 *           example:
 *             phone: "+243123456789"
 *             message: "Bonjour, ceci est un message texte simple"
 *     responses:
 *       200:
 *         description: Message texte envoyé avec succès
 *       400:
 *         description: Numéro de téléphone ou message manquant
 */
router.post('/send-simple-text-message', sendSimpleTextMessage);

/**
 * @swagger
 * /reports/mock-whatsapp-message:
 *   post:
 *     summary: Envoyer un message mock via WhatsApp
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - message
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur affilié à l'entreprise
 *               message:
 *                 type: string
 *                 description: Message texte à envoyer
 *           example:
 *             phone: "+243123456789"
 *             message: "Bonjour, ceci est un message mock"
 *     responses:
 *       200:
 *         description: Message mock envoyé avec succès
 *       400:
 *         description: Numéro de téléphone ou message manquant
 */
router.post('/mock-whatsapp-message', mockWhatsAppMessage);

module.exports = router;
