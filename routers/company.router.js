const router = require('express').Router();
const { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany } = require('../controllers/company.controller');

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Gestion des entreprises
 */

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Créer une nouvelle entreprise
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de l'entreprise
 *               address:
 *                 type: string
 *                 description: Adresse de l'entreprise
 *               category:
 *                 type: string
 *                 description: Catégorie de l'entreprise
 *     responses:
 *       201:
 *         description: Entreprise créée avec succès
 */
router.post('/companies', createCompany);

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Récupérer toutes les entreprises
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Liste des entreprises récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 */
router.get('/companies', getAllCompanies);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Récupérer une entreprise par ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'entreprise à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entreprise récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Entreprise non trouvée
 */
router.get('/companies/:id', getCompanyById);

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Mettre à jour une entreprise
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'entreprise à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - contact
 *               - category
 *               - users
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Entreprise mise à jour avec succès
 *       404:
 *         description: Entreprise non trouvée
 */
router.put('/companies/:id', updateCompany);

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Supprimer une entreprise
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'entreprise à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entreprise supprimée avec succès
 *       404:
 *         description: Entreprise non trouvée
 */
router.delete('/companies/:id', deleteCompany);

module.exports = router;
