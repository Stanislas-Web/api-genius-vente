const router = require('express').Router();
const { getSchoolDashboard } = require('../controllers/dashboard.controller');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Tableau de bord et statistiques de l'école
 */

/**
 * @swagger
 * /dashboard/school:
 *   get:
 *     summary: Récupérer les statistiques complètes du tableau de bord scolaire
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: schoolYear
 *         schema:
 *           type: string
 *         description: Année scolaire (optionnel, par défaut année en cours)
 *     responses:
 *       200:
 *         description: Statistiques du tableau de bord récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overview:
 *                   type: object
 *                   properties:
 *                     totalStudents:
 *                       type: integer
 *                       description: Nombre total d'étudiants actifs
 *                     totalClassrooms:
 *                       type: integer
 *                       description: Nombre total de classes actives
 *                     totalTeachers:
 *                       type: integer
 *                       description: Nombre total d'enseignants actifs
 *                     totalSchoolFees:
 *                       type: integer
 *                       description: Nombre total de frais scolaires actifs
 *                     paymentsThisMonth:
 *                       type: integer
 *                       description: Nombre de paiements ce mois
 *                     totalAmountThisMonth:
 *                       type: number
 *                       description: Montant total collecté ce mois
 *                     collectionRate:
 *                       type: integer
 *                       description: Taux de recouvrement en pourcentage
 *                 students:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     byGender:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           gender:
 *                             type: string
 *                           count:
 *                             type: integer
 *                 classrooms:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     byLevel:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           level:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     topClassrooms:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           studentCount:
 *                             type: integer
 *                 payments:
 *                   type: object
 *                   properties:
 *                     thisMonth:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                         totalAmount:
 *                           type: number
 *                         byMethod:
 *                           type: array
 *                     recent:
 *                       type: array
 *                       description: 5 derniers paiements
 *                     financial:
 *                       type: object
 *                       properties:
 *                         totalExpected:
 *                           type: number
 *                         totalCollected:
 *                           type: number
 *                         collectionRate:
 *                           type: integer
 *                         outstanding:
 *                           type: number
 *       500:
 *         description: Erreur serveur
 */
router.get('/school', getSchoolDashboard);

module.exports = router;
