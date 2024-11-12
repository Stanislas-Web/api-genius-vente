const router = require('express').Router();
const { 
  createStockMovement, 
  getAllStockMovements, 
  getStockMovementById, 
  updateStockMovement, 
  deleteStockMovement 
} = require('../controllers/stockMouvement.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /stock-movements:
 *   post:
 *     summary: Créer un nouveau mouvement de stock
 *     tags: [StockMovements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockMovement'
 *     responses:
 *       201:
 *         description: Mouvement de stock créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockMovement'
 *       400:
 *         description: Données invalides
 */
router.route('/stock-movements').post(isLoggedIn, createStockMovement);

/**
 * @swagger
 * /stock-movements:
 *   get:
 *     summary: Récupérer tous les mouvements de stock
 *     tags: [StockMovements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des mouvements de stock récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockMovement'
 *       401:
 *         description: Authentification échouée
 *       500:
 *         description: Erreur du serveur
 */
router.route('/stock-movements').get(isLoggedIn, getAllStockMovements);

/**
 * @swagger
 * /stock-movements/{id}:
 *   get:
 *     summary: Récupérer un mouvement de stock par ID
 *     tags: [StockMovements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du mouvement de stock à récupérer
 *     responses:
 *       200:
 *         description: Mouvement de stock récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockMovement'
 *       404:
 *         description: Mouvement de stock non trouvé
 *       500:
 *         description: Erreur du serveur
 */
router.route('/stock-movements/:id').get(isLoggedIn, getStockMovementById);

/**
 * @swagger
 * /stock-movements/{id}:
 *   put:
 *     summary: Modifier un mouvement de stock par ID
 *     tags: [StockMovements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du mouvement de stock à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockMovement'
 *     responses:
 *       200:
 *         description: Mouvement de stock modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockMovement'
 *       404:
 *         description: Mouvement de stock non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.route('/stock-movements/:id').put(isLoggedIn, updateStockMovement);

/**
 * @swagger
 * /stock-movements/{id}:
 *   delete:
 *     summary: Supprimer un mouvement de stock par ID
 *     tags: [StockMovements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du mouvement de stock à supprimer
 *     responses:
 *       200:
 *         description: Mouvement de stock supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mouvement de stock supprimé avec succès"
 *       404:
 *         description: Mouvement de stock non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.route('/stock-movements/:id').delete(isLoggedIn, deleteStockMovement);

module.exports = router;
