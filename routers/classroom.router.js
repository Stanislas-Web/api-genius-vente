const router = require('express').Router();
const { 
  createClassroom, 
  getAllClassrooms, 
  getClassroomById, 
  updateClassroom, 
  toggleClassroomActive 
} = require('../controllers/classroom.controller');

/**
 * @swagger
 * tags:
 *   name: Classrooms
 *   description: Gestion des classes
 */

/**
 * @swagger
 * /classrooms:
 *   post:
 *     summary: Créer une nouvelle classe
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - schoolYear
 *             properties:
 *               code:
 *                 type: string
 *                 description: Code de la classe - ex 6A-2025
 *               name:
 *                 type: string
 *                 description: Nom de la classe - ex 6ème A
 *               level:
 *                 type: string
 *                 description: Niveau de la classe - ex 6ème
 *               section:
 *                 type: string
 *                 description: Section de la classe - ex Lettres
 *               schoolYear:
 *                 type: string
 *                 description: Année scolaire - ex 2025-2026
 *               capacity:
 *                 type: number
 *                 description: Capacité maximale de la classe
 *               option:
 *                 type: string
 *                 description: Option de la classe - ex Mathématiques, Sciences, etc
 *     responses:
 *       201:
 *         description: Classe créée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', createClassroom);

/**
 * @swagger
 * /classrooms:
 *   get:
 *     summary: Récupérer toutes les classes
 *     tags: [Classrooms]
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
 *         description: Liste des classes récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getAllClassrooms);

/**
 * @swagger
 * /classrooms/{id}:
 *   get:
 *     summary: Récupérer une classe par ID
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la classe à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Classe récupérée avec succès
 *       404:
 *         description: Classe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getClassroomById);

/**
 * @swagger
 * /classrooms/{id}:
 *   put:
 *     summary: Mettre à jour une classe
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la classe à mettre à jour
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
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *               section:
 *                 type: string
 *               schoolYear:
 *                 type: string
 *               capacity:
 *                 type: number
 *               option:
 *                 type: string
 *     responses:
 *       200:
 *         description: Classe mise à jour avec succès
 *       404:
 *         description: Classe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', updateClassroom);

/**
 * @swagger
 * /classrooms/{id}/active:
 *   patch:
 *     summary: Activer/Désactiver une classe
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la classe
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut de la classe modifié avec succès
 *       404:
 *         description: Classe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id/active', toggleClassroomActive);

module.exports = router;
