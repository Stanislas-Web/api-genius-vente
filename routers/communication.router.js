const router = require('express').Router();
const { 
  sendMessageToParent, 
  sendMessageToClass, 
  sendMessageToSchool 
} = require('../controllers/communication.controller');

/**
 * @swagger
 * tags:
 *   name: Communication
 *   description: Communication avec les parents/tuteurs via SMS
 */

/**
 * @swagger
 * /communication/student/{studentId}:
 *   post:
 *     summary: Envoyer un message au parent/tuteur d'un élève spécifique
 *     tags: [Communication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: ID de l'élève
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: Contenu du message à envoyer
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *                 description: Heure programmée pour l'envoi (optionnel, pour version future)
 *     responses:
 *       200:
 *         description: Message envoyé avec succès
 *       400:
 *         description: Données invalides ou numéro de téléphone manquant
 *       404:
 *         description: Élève non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/student/:studentId', sendMessageToParent);

/**
 * @swagger
 * /communication/classroom/{classroomId}:
 *   post:
 *     summary: Envoyer un message à tous les parents d'une classe
 *     tags: [Communication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         description: ID de la classe
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: Contenu du message à envoyer
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *                 description: Heure programmée pour l'envoi (optionnel)
 *     responses:
 *       200:
 *         description: Messages envoyés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 classroom:
 *                   type: object
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalStudents:
 *                       type: integer
 *                     studentsWithPhone:
 *                       type: integer
 *                     messagesSent:
 *                       type: integer
 *                     messagesFailed:
 *                       type: integer
 *                 results:
 *                   type: array
 *                 errors:
 *                   type: array
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Classe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post('/classroom/:classroomId', sendMessageToClass);

/**
 * @swagger
 * /communication/school:
 *   post:
 *     summary: Envoyer un message à tous les parents de l'école
 *     tags: [Communication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: Contenu du message à envoyer à toute l'école
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *                 description: Heure programmée pour l'envoi (optionnel)
 *     responses:
 *       200:
 *         description: Messages envoyés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalStudents:
 *                       type: integer
 *                     studentsWithPhone:
 *                       type: integer
 *                     messagesSent:
 *                       type: integer
 *                     messagesFailed:
 *                       type: integer
 *                 byClass:
 *                   type: object
 *                   description: Résumé par classe
 *                 results:
 *                   type: array
 *                 errors:
 *                   type: array
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Aucun élève trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/school', sendMessageToSchool);

module.exports = router;
