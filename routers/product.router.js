const router = require('express').Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByCompanyId } = require('../controllers/product.controller');
const { isLoggedIn } = require('../middleware');  // Import du middleware isLoggedIn

/**
 * @swagger
 * /products:
 *   post:
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
 *               companyId:
 *                 type: string
 *                 description: ID de l'entreprise associée au produit
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 */
router.post('/products', isLoggedIn, createProduct);  // Ajout du middleware isLoggedIn

/**
 * @swagger
 * /products:
 *   get:
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
router.get('/products', isLoggedIn, getAllProducts);  // Ajout du middleware isLoggedIn

/**
 * @swagger
 * /products/{id}:
 *   get:
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
router.get('/products/:id', isLoggedIn, getProductById);  // Ajout du middleware isLoggedIn

/**
 * @swagger
 * /products/company/{companyId}:
 *   get:
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
router.get('/products/company/:companyId', isLoggedIn, getProductsByCompanyId);  // Ajout du middleware isLoggedIn

/**
 * @swagger
 * /products/{id}:
 *   put:
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
router.put('/products/:id', isLoggedIn, updateProduct);  // Ajout du middleware isLoggedIn

/**
 * @swagger
 * /products/{id}:
 *   delete:
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
router.delete('/products/:id', isLoggedIn, deleteProduct);  // Ajout du middleware isLoggedIn

module.exports = router;
