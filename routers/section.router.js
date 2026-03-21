const router = require('express').Router();
const { isLoggedIn } = require('../middleware');
const {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection,
  toggleSectionStatus,
  getActiveSections,
  getSectionsByCompany
} = require('../controllers/section.controller');

/**
 * @swagger
 * tags:
 *   name: Sections
 *   description: Gestion des sections
 */

/**
 * @swagger
 * /sections:
 *   post:
 *     summary: Créer une nouvelle section
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de la section
 *     responses:
 *       201:
 *         description: Section créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 */
router.route('/').post(isLoggedIn, createSection);

/**
 * @swagger
 * /sections:
 *   get:
 *     summary: Récupérer toutes les sections
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut actif
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
 *     responses:
 *       200:
 *         description: Sections récupérées avec succès
 *       401:
 *         description: Authentification requise
 */
router.route('/').get(isLoggedIn, getAllSections);

/**
 * @swagger
 * /sections/active:
 *   get:
 *     summary: Récupérer les sections actives
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sections actives récupérées avec succès
 *       401:
 *         description: Authentification requise
 */
router.route('/active').get(isLoggedIn, getActiveSections);

/**
 * @swagger
 * /sections/{id}:
 *   get:
 *     summary: Récupérer une section par ID
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la section
 *     responses:
 *       200:
 *         description: Section récupérée avec succès
 *       404:
 *         description: Section non trouvée
 *       401:
 *         description: Authentification requise
 */
router.route('/:id').get(isLoggedIn, getSectionById);

/**
 * @swagger
 * /sections/{id}:
 *   put:
 *     summary: Mettre à jour une section
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la section
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Section mise à jour avec succès
 *       404:
 *         description: Section non trouvée
 *       401:
 *         description: Authentification requise
 */
router.route('/:id').put(isLoggedIn, updateSection);

/**
 * @swagger
 * /sections/{id}:
 *   delete:
 *     summary: Supprimer une section
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la section
 *     responses:
 *       200:
 *         description: Section supprimée avec succès
 *       404:
 *         description: Section non trouvée
 *       401:
 *         description: Authentification requise
 */
router.route('/:id').delete(isLoggedIn, deleteSection);

/**
 * @swagger
 * /sections/{id}/toggle:
 *   patch:
 *     summary: Basculer le statut actif/inactif d'une section
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la section
 *     responses:
 *       200:
 *         description: Statut de la section modifié avec succès
 *       404:
 *         description: Section non trouvée
 *       401:
 *         description: Authentification requise
 */
router.route('/:id/toggle').patch(isLoggedIn, toggleSectionStatus);

/**
 * @swagger
 * /sections/company/{companyId}:
 *   get:
 *     summary: Récupérer les sections par entreprise
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'entreprise
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrer par statut actif (true/false)
 *     responses:
 *       200:
 *         description: Sections de l'entreprise récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sections de l'entreprise récupérées avec succès"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       active:
 *                         type: boolean
 *                 count:
 *                   type: integer
 *       401:
 *         description: Authentification requise
 */
router.route('/company/:companyId').get(isLoggedIn, getSectionsByCompany);

module.exports = router;
