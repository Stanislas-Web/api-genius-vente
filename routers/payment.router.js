const router = require('express').Router();
const { 
  createPayment, 
  getStudentPayments, 
  getStudentPaymentStatus,
  getClassroomPayments,
  getFullyPaidStudents,
  getStudentsPaidAboveAmount,
  getPaidStudentsByClassroom,
  getRecentPayments,
  getGlobalStatistics,
  getUnpaidStudents
} = require('../controllers/payment.controller');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Gestion des paiements des élèves
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Enregistrer un paiement
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - schoolFeeId
 *               - amount
 *             properties:
 *               studentId:
 *                 type: string
 *                 description: ID de l'élève
 *               schoolFeeId:
 *                 type: string
 *                 description: ID du frais scolaire
 *               amount:
 *                 type: number
 *                 description: Montant payé
 *               paymentDate:
 *                 type: string
 *                 format: date
 *                 description: Date du paiement (par défaut aujourd'hui)
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, bank_transfer, mobile_money, check]
 *                 description: Méthode de paiement
 *                 default: cash
 *               reference:
 *                 type: string
 *                 description: Référence du paiement
 *               notes:
 *                 type: string
 *                 description: Notes additionnelles
 *     responses:
 *       201:
 *         description: Paiement enregistré avec succès
 *       400:
 *         description: Données invalides ou montant trop élevé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', createPayment);

/**
 * @swagger
 * /payments/student/{studentId}:
 *   get:
 *     summary: Récupérer l'historique des paiements d'un élève
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: ID de l'élève
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
 *         name: schoolFeeId
 *         schema:
 *           type: string
 *         description: Filtrer par frais scolaire
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin
 *     responses:
 *       200:
 *         description: Historique des paiements récupéré avec succès
 *       404:
 *         description: Élève non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/student/:studentId', getStudentPayments);

/**
 * @swagger
 * /payments/status/{studentId}/{schoolFeeId}:
 *   get:
 *     summary: Récupérer le statut de paiement d'un élève pour un frais spécifique
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         description: ID de l'élève
 *         schema:
 *           type: string
 *       - in: path
 *         name: schoolFeeId
 *         required: true
 *         description: ID du frais scolaire
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut de paiement récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     matricule:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                 schoolFee:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     label:
 *                       type: string
 *                     code:
 *                       type: string
 *                     fixedAmount:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     periodicity:
 *                       type: string
 *                 paymentStatus:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [completed, partial, pending]
 *                     totalPaid:
 *                       type: number
 *                     remainingAmount:
 *                       type: number
 *                     isFullyPaid:
 *                       type: boolean
 *                     progressPercentage:
 *                       type: number
 *                 payments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Élève ou frais scolaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/status/:studentId/:schoolFeeId', getStudentPaymentStatus);

/**
 * @swagger
 * /payments/classroom/{classroomId}/{schoolFeeId}:
 *   get:
 *     summary: Récupérer les paiements d'une classe pour un frais spécifique
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         description: ID de la classe
 *         schema:
 *           type: string
 *       - in: path
 *         name: schoolFeeId
 *         required: true
 *         description: ID du frais scolaire
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
 *           enum: [completed, partial, pending]
 *         description: Filtrer par statut de paiement
 *     responses:
 *       200:
 *         description: Paiements de la classe récupérés avec succès
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
 *                 schoolFee:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     label:
 *                       type: string
 *                     code:
 *                       type: string
 *                     fixedAmount:
 *                       type: number
 *                     currency:
 *                       type: string
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       matricule:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       paymentStatus:
 *                         type: object
 *                         properties:
 *                           status:
 *                             type: string
 *                             enum: [completed, partial, pending]
 *                           totalPaid:
 *                             type: number
 *                           remainingAmount:
 *                             type: number
 *                           isFullyPaid:
 *                             type: boolean
 *                           progressPercentage:
 *                             type: number
 *                       payments:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Payment'
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalStudents:
 *                       type: integer
 *                     completedPayments:
 *                       type: integer
 *                     partialPayments:
 *                       type: integer
 *                     pendingPayments:
 *                       type: integer
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
 *         description: Classe ou frais scolaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/classroom/:classroomId/:schoolFeeId', getClassroomPayments);

/**
 * @swagger
 * /payments/paid-students/{classroomId}/{schoolFeeId}:
 *   get:
 *     summary: Récupérer tous les élèves qui ont payé un frais spécifique dans une classe
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classroomId
 *         required: true
 *         description: ID de la classe
 *         schema:
 *           type: string
 *       - in: path
 *         name: schoolFeeId
 *         required: true
 *         description: ID du frais scolaire
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
 *     responses:
 *       200:
 *         description: Liste des élèves ayant payé récupérée avec succès
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
 *                 schoolFee:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     label:
 *                       type: string
 *                     fixedAmount:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     allowCustomAmount:
 *                       type: boolean
 *                 paidStudents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       matricule:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       middleName:
 *                         type: string
 *                       paymentInfo:
 *                         type: object
 *                         properties:
 *                           totalPaid:
 *                             type: number
 *                           paymentCount:
 *                             type: integer
 *                           isFullyPaid:
 *                             type: boolean
 *                           lastPaymentDate:
 *                             type: string
 *                             format: date
 *                           firstPaymentDate:
 *                             type: string
 *                             format: date
 *                       payments:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Payment'
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalStudentsInClass:
 *                       type: integer
 *                     paidStudentsCount:
 *                       type: integer
 *                     unpaidStudentsCount:
 *                       type: integer
 *                     fullyPaidCount:
 *                       type: integer
 *                     totalAmountCollected:
 *                       type: number
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
 *         description: Classe ou frais scolaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/paid-students/:classroomId/:schoolFeeId', getPaidStudentsByClassroom);

/**
 * @swagger
 * /payments/recent:
 *   get:
 *     summary: Récupérer les paiements les plus récents
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "Nombre de paiements à récupérer (défaut: 10)"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *     responses:
 *       200:
 *         description: Paiements récents récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       paymentDate:
 *                         type: string
 *                         format: date
 *                       paymentMethod:
 *                         type: string
 *                         enum: [cash, bank_transfer, mobile_money, check]
 *                       status:
 *                         type: string
 *                         enum: [completed, partial, pending]
 *                       reference:
 *                         type: string
 *                       notes:
 *                         type: string
 *                       studentId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           matricule:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           classroomId:
 *                             type: object
 *                       schoolFeeId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           label:
 *                             type: string
 *                           currency:
 *                             type: string
 *                           fixedAmount:
 *                             type: number
 *                           allowCustomAmount:
 *                             type: boolean
 *                       recordedBy:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           username:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date
 *                       updatedAt:
 *                         type: string
 *                         format: date
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalPayments:
 *                       type: integer
 *                     recentPaymentsCount:
 *                       type: integer
 *                     totalAmountCollected:
 *                       type: number
 *                     averageAmount:
 *                       type: number
 *                     paymentMethodsBreakdown:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
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
 *       500:
 *         description: Erreur serveur
 */
router.get('/recent', getRecentPayments);

/**
 * @swagger
 * /payments/fully-paid/{schoolFeeId}:
 *   get:
 *     summary: Récupérer les élèves qui ont tout payé pour un frais spécifique
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolFeeId
 *         required: true
 *         description: ID du frais scolaire
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
 *         name: classroomId
 *         schema:
 *           type: string
 *         description: Filtrer par classe spécifique
 *     responses:
 *       200:
 *         description: Liste des élèves ayant tout payé récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schoolFee:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     label:
 *                       type: string
 *                     code:
 *                       type: string
 *                     fixedAmount:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     periodicity:
 *                       type: string
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       matricule:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       middleName:
 *                         type: string
 *                       classroomId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           code:
 *                             type: string
 *                           level:
 *                             type: string
 *                           section:
 *                             type: string
 *                           option:
 *                             type: string
 *                       paymentInfo:
 *                         type: object
 *                         properties:
 *                           totalPaid:
 *                             type: number
 *                           requiredAmount:
 *                             type: number
 *                           excessAmount:
 *                             type: number
 *                           paymentCount:
 *                             type: integer
 *                           lastPaymentDate:
 *                             type: string
 *                             format: date
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalStudents:
 *                       type: integer
 *                     fullyPaidStudents:
 *                       type: integer
 *                     completionRate:
 *                       type: integer
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
 *         description: Frais scolaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/fully-paid/:schoolFeeId', getFullyPaidStudents);

/**
 * @swagger
 * /payments/above-amount/{schoolFeeId}:
 *   get:
 *     summary: Récupérer les élèves ayant payé plus qu'un montant sélectionné
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolFeeId
 *         required: true
 *         description: ID du frais scolaire
 *         schema:
 *           type: string
 *       - in: query
 *         name: minAmount
 *         required: true
 *         schema:
 *           type: number
 *         description: Montant minimum payé
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
 *         description: Filtrer par classe spécifique
 *     responses:
 *       200:
 *         description: Liste des élèves ayant payé plus que le montant sélectionné récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schoolFee:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     label:
 *                       type: string
 *                     code:
 *                       type: string
 *                     fixedAmount:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     periodicity:
 *                       type: string
 *                 filterCriteria:
 *                   type: object
 *                   properties:
 *                     minAmount:
 *                       type: number
 *                     classroomId:
 *                       type: string
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       matricule:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       middleName:
 *                         type: string
 *                       classroomId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           code:
 *                             type: string
 *                           level:
 *                             type: string
 *                           section:
 *                             type: string
 *                           option:
 *                             type: string
 *                       paymentInfo:
 *                         type: object
 *                         properties:
 *                           totalPaid:
 *                             type: number
 *                           requiredAmount:
 *                             type: number
 *                           minAmountRequested:
 *                             type: number
 *                           excessAmount:
 *                             type: number
 *                           amountAboveMinimum:
 *                             type: number
 *                           paymentCount:
 *                             type: integer
 *                           isFullyPaid:
 *                             type: boolean
 *                           lastPaymentDate:
 *                             type: string
 *                             format: date
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalStudents:
 *                       type: integer
 *                     studentsPaidAboveAmount:
 *                       type: integer
 *                     fullyPaidStudents:
 *                       type: integer
 *                     averageAmountPaid:
 *                       type: number
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
 *       400:
 *         description: Paramètre minAmount manquant ou invalide
 *       404:
 *         description: Frais scolaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/above-amount/:schoolFeeId', getStudentsPaidAboveAmount);

/**
 * @swagger
 * /payments/unpaid/{schoolFeeId}:
 *   get:
 *     summary: Récupérer les élèves qui n'ont pas payé un frais spécifique
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolFeeId
 *         required: true
 *         description: ID du frais scolaire
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
 *         name: classroomId
 *         schema:
 *           type: string
 *         description: Filtrer par classe spécifique
 *     responses:
 *       200:
 *         description: Liste des élèves non payés récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schoolFee:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     label:
 *                       type: string
 *                     code:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     periodicity:
 *                       type: string
 *                 filterCriteria:
 *                   type: object
 *                   properties:
 *                     classroomId:
 *                       type: string
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       matricule:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       middleName:
 *                         type: string
 *                       classroomId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           code:
 *                             type: string
 *                           level:
 *                             type: string
 *                           section:
 *                             type: string
 *                           option:
 *                             type: string
 *                       paymentInfo:
 *                         type: object
 *                         properties:
 *                           totalPaid:
 *                             type: number
 *                           requiredAmount:
 *                             type: number
 *                           remainingAmount:
 *                             type: number
 *                           paymentCount:
 *                             type: integer
 *                           isFullyPaid:
 *                             type: boolean
 *                           paymentStatus:
 *                             type: string
 *                             enum: [pending, partial, completed]
 *                           progressPercentage:
 *                             type: integer
 *                           lastPaymentDate:
 *                             type: string
 *                             format: date
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalStudents:
 *                       type: integer
 *                     unpaidStudents:
 *                       type: integer
 *                     fullyPaidStudents:
 *                       type: integer
 *                     totalUnpaidAmount:
 *                       type: number
 *                     averageUnpaidAmount:
 *                       type: number
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
 *         description: Frais scolaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/unpaid/:schoolFeeId', getUnpaidStudents);

/**
 * @swagger
 * /payments/statistics:
 *   get:
 *     summary: Récupérer les statistiques globales de l'entreprise
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [current, lastMonth, lastYear]
 *           default: current
 *         description: Période pour les statistiques
 *     responses:
 *       200:
 *         description: Statistiques globales récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 period:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                     label:
 *                       type: string
 *                 statistics:
 *                   type: object
 *                   properties:
 *                     totalStudents:
 *                       type: integer
 *                       description: Nombre total d'élèves
 *                     totalClassrooms:
 *                       type: integer
 *                       description: Nombre total de classes
 *                     totalActiveSchoolFees:
 *                       type: integer
 *                       description: Nombre de frais scolaires actifs
 *                     monthlyPayments:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           description: Nombre de paiements du mois
 *                         totalAmount:
 *                           type: number
 *                           description: Montant total des paiements du mois
 *                         amountsByCurrency:
 *                           type: object
 *                           description: Montants par devise
 *                         averageAmount:
 *                           type: number
 *                           description: Montant moyen des paiements
 *                     paymentRate:
 *                       type: object
 *                       properties:
 *                         global:
 *                           type: integer
 *                           description: Taux de paiement global (%)
 *                         totalStudentsWithPayments:
 *                           type: integer
 *                           description: Nombre d'élèves ayant payé
 *                         totalStudentsWithoutPayments:
 *                           type: integer
 *                           description: Nombre d'élèves sans paiement
 *                         totalRequiredAmount:
 *                           type: number
 *                           description: Montant total requis
 *                         totalPaidAmount:
 *                           type: number
 *                           description: Montant total payé
 *                         completionPercentage:
 *                           type: integer
 *                           description: Pourcentage de completion
 *                     paymentMethods:
 *                       type: object
 *                       description: Répartition par méthode de paiement
 *                     schoolFeesBreakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           schoolFeeId:
 *                             type: string
 *                           label:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           currency:
 *                             type: string
 *                           totalStudents:
 *                             type: integer
 *                           studentsWithPayments:
 *                             type: integer
 *                           studentsWithoutPayments:
 *                             type: integer
 *                           totalPaid:
 *                             type: number
 *                           totalRequired:
 *                             type: number
 *                           paymentRate:
 *                             type: integer
 *                     classroomsBreakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           classroomId:
 *                             type: string
 *                           name:
 *                             type: string
 *                           code:
 *                             type: string
 *                           level:
 *                             type: string
 *                           totalStudents:
 *                             type: integer
 *                           monthlyPayments:
 *                             type: integer
 *                           monthlyAmount:
 *                             type: number
 *       500:
 *         description: Erreur serveur
 */
router.get('/statistics', getGlobalStatistics);

module.exports = router;
