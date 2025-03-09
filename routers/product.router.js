const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByCompanyId } = require('../controllers/product.controller');

/**
 * @swagger
 * /products:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un nouveau produit
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - purchasePrice
 *               - salePrice
 *               - code
 *               - quantity
 *               - companyId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du produit
 *               description:
 *                 type: string
 *                 description: Description du produit
 *               purchasePrice:
 *                 type: number
 *                 description: Prix d'achat du produit
 *               salePrice:
 *                 type: number
 *                 description: Prix de vente du produit
 *               quantity:
 *                 type: number
 *                 description: Quantité en stock du produit
 *               code:
 *                 type: string
 *                 description: code du produit 
 *               companyId:
 *                 type: string
 *                 description: ID de l'entreprise associée au produit
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 */
router.post('/', isLoggedIn, createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer tous les produits
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Liste des produits récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', isLoggedIn, getAllProducts);

/**
 * @swagger
 * /products/company/{companyId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer tous les produits d'une entreprise par ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         description: ID de l'entreprise pour laquelle récupérer les produits
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des produits récupérée avec succès
 *       404:
 *         description: Aucun produit trouvé pour cette entreprise
 */
router.get('/company/:companyId', isLoggedIn, getProductsByCompanyId);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer un produit par ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 */
router.get('/:id', isLoggedIn, getProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour un produit
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - purchasePrice
 *               - salePrice
 *               - quantity
 *               - companyId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               purchasePrice:
 *                 type: number
 *               salePrice:
 *                 type: number
 *               quantity:
 *                 type: number
 *               companyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *       404:
 *         description: Produit non trouvé
 */
router.put('/:id', isLoggedIn, updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un produit
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       404:
 *         description: Produit non trouvé
 */
router.delete('/:id', isLoggedIn, deleteProduct);

module.exports = router;
