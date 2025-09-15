const router = require('express').Router();
const { 
  createSchoolFee, 
  getAllSchoolFees, 
  getSchoolFeeById, 
  updateSchoolFee, 
  toggleSchoolFeeActive 
} = require('../controllers/schoolFee.controller');

/**
 * @swagger
 * tags:
 *   name: SchoolFees
 *   description: Gestion des frais scolaires
 */

/**
 * @swagger
 * /school-fees:
 *   post:
 *     summary: Créer un nouveau frais scolaire
 *     tags: [SchoolFees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - schoolYear
 *             properties:
 *               label:
 *                 type: string
 *                 description: Libellé du frais - ex Minerval Mensuel
 *               periodicity:
 *                 type: string
 *                 enum: [unique, mensuel, trimestriel]
 *                 description: Périodicité du frais
 *                 default: mensuel
 *               schoolYear:
 *                 type: string
 *                 description: Année scolaire - ex 2025-2026
 *               currency:
 *                 type: string
 *                 description: Devise du frais
 *                 default: CDF
 *               allowCustomAmount:
 *                 type: boolean
 *                 description: Autoriser un montant personnalisé
 *                 default: false
 *               fixedAmount:
 *                 type: number
 *                 description: Montant fixe du frais
 *                 default: 0
 *               min:
 *                 type: number
 *                 description: Montant minimum autorisé
 *                 default: 0
 *               max:
 *                 type: number
 *                 description: Montant maximum autorisé
 *                 default: 0
 *               classroomId:
 *                 type: string
 *                 description: ID de la classe pour override spécifique
 *     responses:
 *       201:
 *         description: Frais scolaire créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', createSchoolFee);

/**
 * @swagger
 * /school-fees:
 *   get:
 *     summary: Récupérer tous les frais scolaires
 *     tags: [SchoolFees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: schoolYear
 *         schema:
 *           type: string
 *         description: Filtrer par année scolaire
 *       - in: query
 *         name: classroomId
 *         schema:
 *           type: string
 *         description: Filtrer par classe (inclut frais globaux et spécifiques)
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut actif
 *     responses:
 *       200:
 *         description: Liste des frais scolaires récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getAllSchoolFees);

/**
 * @swagger
 * /school-fees/{id}:
 *   get:
 *     summary: Récupérer un frais scolaire par ID
 *     tags: [SchoolFees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du frais scolaire à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Frais scolaire récupéré avec succès
 *       404:
 *         description: Frais scolaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getSchoolFeeById);

/**
 * @swagger
 * /school-fees/{id}:
 *   put:
 *     summary: Mettre à jour un frais scolaire
 *     tags: [SchoolFees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du frais scolaire à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               periodicity:
 *                 type: string
 *                 enum: [unique, mensuel, trimestriel]
 *               schoolYear:
 *                 type: string
 *               currency:
 *                 type: string
 *               allowCustomAmount:
 *                 type: boolean
 *               fixedAmount:
 *                 type: number
 *               min:
 *                 type: number
 *               max:
 *                 type: number
 *               classroomId:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Frais scolaire mis à jour avec succès
 *       404:
 *         description: Frais scolaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', updateSchoolFee);

/**
 * @swagger
 * /school-fees/{id}/active:
 *   patch:
 *     summary: Activer/Désactiver un frais scolaire
 *     tags: [SchoolFees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du frais scolaire
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut du frais scolaire modifié avec succès
 *       404:
 *         description: Frais scolaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id/active', toggleSchoolFeeActive);

module.exports = router;
