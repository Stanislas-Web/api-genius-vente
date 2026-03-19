const express = require('express');
const router = express.Router();
const {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  updateRoomStatus
} = require('../controllers/room.controller');

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Gestion des chambres d'hôtel
 */

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Créer une nouvelle chambre
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *           example:
 *             roomNumber: "201"
 *             roomTypeId: "6734be089acec1931a6e0b42"
 *             status: "available"
 *             capacity: 2
 *             description: "Chambre avec vue sur jardin"
 *             floor: 2
 *     responses:
 *       201:
 *         description: Chambre créée avec succès
 *       400:
 *         description: Numéro de chambre déjà existant
 *       404:
 *         description: Type de chambre non trouvé
 */
router.post('/', createRoom);

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Récupérer toutes les chambres
 *     tags: [Rooms]
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
 *           enum: [available, occupied, maintenance, reserved]
 *       - in: query
 *         name: roomTypeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: roomNumber
 *         schema:
 *           type: string
 *       - in: query
 *         name: floor
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des chambres
 */
router.get('/', getAllRooms);

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Récupérer une chambre par ID
 *     tags: [Rooms]
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
 *         description: Chambre trouvée
 *       404:
 *         description: Chambre non trouvée
 */
router.get('/:id', getRoomById);

/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Mettre à jour une chambre
 *     tags: [Rooms]
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
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: Chambre mise à jour
 *       404:
 *         description: Chambre non trouvée
 */
router.put('/:id', updateRoom);

/**
 * @swagger
 * /rooms/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une chambre
 *     tags: [Rooms]
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
 *                 enum: [available, occupied, maintenance, reserved]
 *           example:
 *             status: "maintenance"
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       404:
 *         description: Chambre non trouvée
 */
router.patch('/:id/status', updateRoomStatus);

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Supprimer une chambre
 *     tags: [Rooms]
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
 *         description: Chambre supprimée
 *       404:
 *         description: Chambre non trouvée
 */
router.delete('/:id', deleteRoom);

module.exports = router;
