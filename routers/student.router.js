const router = require('express').Router();
const { 
  createStudent, 
  getAllStudents, 
  getStudentById, 
  updateStudent, 
  moveStudent,
  getStudentsByClassroom 
} = require('../controllers/student.controller');

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Gestion des élèves
 */

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Créer un nouvel élève
 *     tags: [Students]
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
 *               - firstName
 *               - gender
 *               - classroomId
 *             properties:
 *               matricule:
 *                 type: string
 *                 description: Matricule de l'élève (généré automatiquement si absent)
 *               lastName:
 *                 type: string
 *                 description: Nom de famille
 *               middleName:
 *                 type: string
 *                 description: Nom du milieu
 *               firstName:
 *                 type: string
 *                 description: Prénom
 *               gender:
 *                 type: string
 *                 enum: [M, F]
 *                 description: Genre de l'élève
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: Date de naissance
 *               tuteur:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Nom du tuteur
 *                   phone:
 *                     type: string
 *                     description: Téléphone du tuteur
 *               classroomId:
 *                 type: string
 *                 description: ID de la classe
 *               schoolYear:
 *                 type: string
 *                 description: Année scolaire (déduite de la classe si absent)
 *     responses:
 *       201:
 *         description: Élève créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', createStudent);

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Récupérer tous les élèves
 *     tags: [Students]
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
 *         name: classroomId
 *         schema:
 *           type: string
 *         description: Filtrer par classe
 *       - in: query
 *         name: schoolYear
 *         schema:
 *           type: string
 *         description: Filtrer par année scolaire
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [actif, transfert, sorti]
 *         description: Filtrer par statut
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Recherche textuelle
 *     responses:
 *       200:
 *         description: Liste des élèves récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getAllStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Récupérer un élève par ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'élève à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Élève récupéré avec succès
 *       404:
 *         description: Élève non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getStudentById);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Mettre à jour un élève
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'élève à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricule:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [M, F]
 *               birthDate:
 *                 type: string
 *                 format: date
 *               tuteur:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *               classroomId:
 *                 type: string
 *               schoolYear:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [actif, transfert, sorti]
 *     responses:
 *       200:
 *         description: Élève mis à jour avec succès
 *       404:
 *         description: Élève non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', updateStudent);

/**
 * @swagger
 * /students/{id}/move:
 *   post:
 *     summary: Promouvoir/Transférer un élève
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'élève à transférer
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classroomId
 *             properties:
 *               classroomId:
 *                 type: string
 *                 description: ID de la nouvelle classe
 *               schoolYear:
 *                 type: string
 *                 description: Nouvelle année scolaire (déduite de la classe si absent)
 *     responses:
 *       200:
 *         description: Élève transféré avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Élève non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/:id/move', moveStudent);

/**
 * @swagger
 * /students/classroom/{classroomId}:
 *   get:
 *     summary: Récupérer les élèves d'une classe spécifique
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         description: ID de la classe
 *         schema:
 *           type: string
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [actif, transfert, sorti]
 *         description: Filtrer par statut
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Recherche textuelle
 *     responses:
 *       200:
 *         description: Liste des élèves de la classe récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 classroom:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     code:
 *                       type: string
 *                     level:
 *                       type: string
 *                     section:
 *                       type: string
 *                     option:
 *                       type: string
 *                     schoolYear:
 *                       type: string
 *                     capacity:
 *                       type: number
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       404:
 *         description: Classe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/classroom/:classroomId', getStudentsByClassroom);

module.exports = router;
