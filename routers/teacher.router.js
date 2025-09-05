const router = require('express').Router();
const { 
  createTeacher, 
  getAllTeachers, 
  getTeacherById, 
  updateTeacher 
} = require('../controllers/teacher.controller');

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: Gestion des professeurs
 */

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Créer un nouveau professeur
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lastName
 *             properties:
 *               code:
 *                 type: string
 *                 description: Code du professeur - ex PROF-0001
 *               lastName:
 *                 type: string
 *                 description: Nom de famille
 *               firstName:
 *                 type: string
 *                 description: Prénom
 *               phone:
 *                 type: string
 *                 description: Numéro de téléphone
 *               email:
 *                 type: string
 *                 description: Adresse email
 *               classes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des IDs des classes assignées
 *     responses:
 *       201:
 *         description: Professeur créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', createTeacher);

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Récupérer tous les professeurs
 *     tags: [Teachers]
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
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut actif
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Recherche textuelle
 *     responses:
 *       200:
 *         description: Liste des professeurs récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getAllTeachers);

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Récupérer un professeur par ID
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du professeur à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Professeur récupéré avec succès
 *       404:
 *         description: Professeur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getTeacherById);

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Mettre à jour un professeur
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du professeur à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               lastName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               classes:
 *                 type: array
 *                 items:
 *                   type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Professeur mis à jour avec succès
 *       404:
 *         description: Professeur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', updateTeacher);

module.exports = router;
