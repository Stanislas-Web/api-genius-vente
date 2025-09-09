const router = require('express').Router();
const { isLoggedIn } = require('../middleware');
const {
  createOption,
  getAllOptions,
  getOptionById,
  updateOption,
  deleteOption,
  toggleOptionStatus,
  getActiveOptions,
  getOptionsByCompany
} = require('../controllers/option.controller');

/**
 * @swagger
 * tags:
 *   name: Options
 *   description: Gestion des options
 */

/**
 * @swagger
 * /options:
 *   post:
 *     summary: Créer une nouvelle option
 *     tags: [Options]
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
 *                 description: Nom de l'option
 *     responses:
 *       201:
 *         description: Option créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification requise
 */
router.route('/').post(isLoggedIn, createOption);

/**
 * @swagger
 * /options:
 *   get:
 *     summary: Récupérer toutes les options
 *     tags: [Options]
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
 *         description: Options récupérées avec succès
 *       401:
 *         description: Authentification requise
 */
router.route('/').get(isLoggedIn, getAllOptions);

/**
 * @swagger
 * /options/active:
 *   get:
 *     summary: Récupérer les options actives
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Options actives récupérées avec succès
 *       401:
 *         description: Authentification requise
 */
router.route('/active').get(isLoggedIn, getActiveOptions);

/**
 * @swagger
 * /options/{id}:
 *   get:
 *     summary: Récupérer une option par ID
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'option
 *     responses:
 *       200:
 *         description: Option récupérée avec succès
 *       404:
 *         description: Option non trouvée
 *       401:
 *         description: Authentification requise
 */
router.route('/:id').get(isLoggedIn, getOptionById);

/**
 * @swagger
 * /options/{id}:
 *   put:
 *     summary: Mettre à jour une option
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'option
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
 *         description: Option mise à jour avec succès
 *       404:
 *         description: Option non trouvée
 *       401:
 *         description: Authentification requise
 */
router.route('/:id').put(isLoggedIn, updateOption);

/**
 * @swagger
 * /options/{id}:
 *   delete:
 *     summary: Supprimer une option
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'option
 *     responses:
 *       200:
 *         description: Option supprimée avec succès
 *       404:
 *         description: Option non trouvée
 *       401:
 *         description: Authentification requise
 */
router.route('/:id').delete(isLoggedIn, deleteOption);

/**
 * @swagger
 * /options/{id}/toggle:
 *   patch:
 *     summary: Basculer le statut actif/inactif d'une option
 *     tags: [Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'option
 *     responses:
 *       200:
 *         description: Statut de l'option modifié avec succès
 *       404:
 *         description: Option non trouvée
 *       401:
 *         description: Authentification requise
 */
router.route('/:id/toggle').patch(isLoggedIn, toggleOptionStatus);

/**
 * @swagger
 * /options/company/{companyId}:
 *   get:
 *     summary: Récupérer les options par entreprise
 *     tags: [Options]
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
 *         description: Options de l'entreprise récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Options de l'entreprise récupérées avec succès"
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
router.route('/company/:companyId').get(isLoggedIn, getOptionsByCompany);

module.exports = router;
