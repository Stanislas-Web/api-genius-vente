const express = require('express');
const router = express.Router();
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
 * /api/v1/stock-mouvements:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Créer un nouveau mouvement de stock
 *     tags: [StockMouvements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockMouvement'
 *     responses:
 *       201:
 *         description: Mouvement de stock créé avec succès
 */
router.post('/', isLoggedIn, createStockMovement);

/**
 * @swagger
 * /api/v1/stock-mouvements:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer tous les mouvements de stock
 *     tags: [StockMouvements]
 *     responses:
 *       200:
 *         description: Liste des mouvements de stock récupérée avec succès
 */
router.get('/', isLoggedIn, getAllStockMovements);

/**
 * @swagger
 * /api/v1/stock-mouvements/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer un mouvement de stock par ID
 *     tags: [StockMouvements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mouvement de stock récupéré avec succès
 */
router.get('/:id', isLoggedIn, getStockMovementById);

/**
 * @swagger
 * /api/v1/stock-mouvements/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour un mouvement de stock
 *     tags: [StockMouvements]
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
 *             $ref: '#/components/schemas/StockMouvement'
 *     responses:
 *       200:
 *         description: Mouvement de stock mis à jour avec succès
 */
router.put('/:id', isLoggedIn, updateStockMovement);

/**
 * @swagger
 * /api/v1/stock-mouvements/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un mouvement de stock
 *     tags: [StockMouvements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mouvement de stock supprimé avec succès
 */
router.delete('/:id', isLoggedIn, deleteStockMovement);

module.exports = router;
