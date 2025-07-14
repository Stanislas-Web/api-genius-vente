const router = require('express').Router();
const { 
    createVersion, 
    getAllVersions, 
    getVersionById, 
    getLatestVersion,
    updateVersion, 
    deleteVersion 
} = require('../controllers/version.controller');
const { isLoggedIn } = require('../middleware');

/**
 * @swagger
 * /versions:
 *   post:
 *     summary: Créer une nouvelle version
 *     tags: [Versions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Version'
 *     responses:
 *       201:
 *         description: Version créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Version'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur du serveur
 */
router.route('/versions').post(isLoggedIn, createVersion);

/**
 * @swagger
 * /versions:
 *   get:
 *     summary: Récupérer toutes les versions
 *     tags: [Versions]
 *     responses:
 *       200:
 *         description: Liste des versions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Version'
 *       500:
 *         description: Erreur du serveur
 */
router.route('/versions').get(getAllVersions);

/**
 * @swagger
 * /versions/latest:
 *   get:
 *     summary: Récupérer la dernière version
 *     tags: [Versions]
 *     responses:
 *       200:
 *         description: Dernière version récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Version'
 *       404:
 *         description: Aucune version trouvée
 *       500:
 *         description: Erreur du serveur
 */
router.route('/versions/latest').get(getLatestVersion);

/**
 * @swagger
 * /versions/{id}:
 *   get:
 *     summary: Récupérer une version par ID
 *     tags: [Versions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la version à récupérer
 *     responses:
 *       200:
 *         description: Version récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Version'
 *       404:
 *         description: Version non trouvée
 *       500:
 *         description: Erreur du serveur
 */
router.route('/versions/:id').get(getVersionById);

/**
 * @swagger
 * /versions/{id}:
 *   put:
 *     summary: Modifier une version
 *     tags: [Versions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la version à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               android:
 *                 type: string
 *                 example: "21"
 *               ios:
 *                 type: string
 *                 example: "27"
 *               description:
 *                 type: string
 *                 example: "Correction de bugs et amélioration des performances"
 *     responses:
 *       200:
 *         description: Version modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Version'
 *       404:
 *         description: Version non trouvée
 *       500:
 *         description: Erreur du serveur
 */
router.route('/versions/:id').put(isLoggedIn, updateVersion);

/**
 * @swagger
 * /versions/{id}:
 *   delete:
 *     summary: Supprimer une version
 *     tags: [Versions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la version à supprimer
 *     responses:
 *       200:
 *         description: Version supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Version supprimée avec succès"
 *       404:
 *         description: Version non trouvée
 *       500:
 *         description: Erreur du serveur
 */
router.route('/versions/:id').delete(isLoggedIn, deleteVersion);

module.exports = router; 