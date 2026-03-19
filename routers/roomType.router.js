const express = require('express');
const router = express.Router();
const {
  createRoomType,
  getAllRoomTypes,
  getRoomTypeById,
  updateRoomType,
  deleteRoomType
} = require('../controllers/roomType.controller');

/**
 * @swagger
 * tags:
 *   name: RoomTypes
 *   description: Gestion des types de chambres d'hôtel
 */

/**
 * @swagger
 * /room-types:
 *   post:
 *     summary: Créer un nouveau type de chambre
 *     tags: [RoomTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomType'
 *           example:
 *             name: "Suite Deluxe"
 *             description: "Suite luxueuse avec vue sur la ville"
 *             hourlyRate: 15
 *             nightRate: 60
 *             fullDayRate: 100
 *             capacity: 2
 *             amenities: ["WiFi", "TV", "Climatisation", "Mini-bar"]
 *     responses:
 *       201:
 *         description: Type de chambre créé avec succès
 *       500:
 *         description: Erreur serveur
 */
router.post('/', createRoomType);

/**
 * @swagger
 * /room-types:
 *   get:
 *     summary: Récupérer tous les types de chambres
 *     tags: [RoomTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrer par nom
 *     responses:
 *       200:
 *         description: Liste des types de chambres
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getAllRoomTypes);

/**
 * @swagger
 * /room-types/{id}:
 *   get:
 *     summary: Récupérer un type de chambre par ID
 *     tags: [RoomTypes]
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
 *         description: Type de chambre trouvé
 *       404:
 *         description: Type de chambre non trouvé
 */
router.get('/:id', getRoomTypeById);

/**
 * @swagger
 * /room-types/{id}:
 *   put:
 *     summary: Mettre à jour un type de chambre
 *     tags: [RoomTypes]
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
 *             $ref: '#/components/schemas/RoomType'
 *     responses:
 *       200:
 *         description: Type de chambre mis à jour
 *       404:
 *         description: Type de chambre non trouvé
 */
router.put('/:id', updateRoomType);

/**
 * @swagger
 * /room-types/{id}:
 *   delete:
 *     summary: Supprimer un type de chambre
 *     tags: [RoomTypes]
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
 *         description: Type de chambre supprimé
 *       404:
 *         description: Type de chambre non trouvé
 */
router.delete('/:id', deleteRoomType);

module.exports = router;
