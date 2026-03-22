const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  checkIn,
  checkOut,
  cancelBooking,
  payBooking,
  getBookingReportSummary,
  getBookingReportDetailed,
  getBookingReportByRoom
} = require('../controllers/booking.controller');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Gestion des réservations d'hôtel
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Créer une nouvelle réservation
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *           example:
 *             roomId: "6734be089acec1931a6e0b42"
 *             clientName: "Jean Dupont"
 *             clientPhone: "+243826016607"
 *             clientEmail: "jean@example.com"
 *             cardNumber: "1234-5678-9012"
 *             checkIn: "2026-03-20T14:00:00Z"
 *             checkOut: "2026-03-25T11:00:00Z"
 *             rateType: "negotiated"
 *             negotiatedRate: 400
 *             notes: "Client VIP"
 *             nomFemme: "Marie Dupont"
 *             paidAmount: 200
 *             paymentMethod: "cash"
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *       400:
 *         description: Chambre occupée ou en maintenance
 *       404:
 *         description: Chambre non trouvée
 */
router.post('/', createBooking);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Récupérer toutes les réservations
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, checked-in, checked-out, cancelled]
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: string
 *       - in: query
 *         name: clientName
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Liste des réservations
 */
router.get('/', getAllBookings);

/**
 * @swagger
 * /bookings/reports/summary:
 *   get:
 *     summary: Rapport résumé des réservations (totaux, par statut, par jour)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, checked-in, checked-out, cancelled]
 *         description: Filtrer par statut
 *     responses:
 *       200:
 *         description: Rapport résumé des réservations
 */
router.get('/reports/summary', getBookingReportSummary);

/**
 * @swagger
 * /bookings/reports/detailed:
 *   get:
 *     summary: Rapport détaillé des réservations (prix, durée, heure)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, checked-in, checked-out, cancelled]
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rapport détaillé des réservations
 */
router.get('/reports/detailed', getBookingReportDetailed);

/**
 * @swagger
 * /bookings/reports/by-room:
 *   get:
 *     summary: Rapport des réservations par chambre
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Rapport par chambre
 */
router.get('/reports/by-room', getBookingReportByRoom);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Récupérer une réservation par ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation trouvée
 *       404:
 *         description: Réservation non trouvée
 */
router.get('/:id', getBookingById);

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Mettre à jour une réservation
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: Réservation mise à jour
 *       404:
 *         description: Réservation non trouvée
 */
router.put('/:id', updateBooking);

/**
 * @swagger
 * /bookings/{id}/check-in:
 *   post:
 *     summary: Effectuer le check-in d'une réservation
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Check-in effectué avec succès
 *       400:
 *         description: Réservation ne peut pas être check-in
 *       404:
 *         description: Réservation non trouvée
 */
router.post('/:id/check-in', checkIn);

/**
 * @swagger
 * /bookings/{id}/check-out:
 *   post:
 *     summary: Effectuer le check-out d'une réservation
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *           example:
 *             checkOut: "2026-03-25T11:00:00Z"
 *     responses:
 *       200:
 *         description: Check-out effectué avec succès
 *       400:
 *         description: Réservation n'est pas check-in
 *       404:
 *         description: Réservation non trouvée
 */
router.post('/:id/check-out', checkOut);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   post:
 *     summary: Annuler une réservation
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation annulée avec succès
 *       400:
 *         description: Impossible d'annuler cette réservation
 *       404:
 *         description: Réservation non trouvée
 */
router.post('/:id/cancel', cancelBooking);

/**
 * @swagger
 * /bookings/{id}/pay:
 *   post:
 *     summary: Effectuer un paiement sur une réservation en attente
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Montant à payer
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, mobile_money, bank_transfer, card]
 *                 description: Méthode de paiement
 *           example:
 *             amount: 200
 *             paymentMethod: "cash"
 *     responses:
 *       200:
 *         description: Paiement effectué avec succès
 *       400:
 *         description: Montant invalide ou réservation non en attente
 *       404:
 *         description: Réservation non trouvée
 */
router.post('/:id/pay', payBooking);

module.exports = router;
