# 🏨 API de Gestion Hôtelière - Documentation

## Vue d'ensemble

Module complet de gestion d'hôtel intégré à l'API Genius Vente. Ce module permet de gérer les chambres, les types de chambres, les réservations et la facturation avec support du marchandage.

**Base URL:** `http://localhost:8000/api/v1`

**Authentification:** Toutes les routes nécessitent un token JWT (Bearer Token)

---

## 📋 Table des matières

1. [Types de Chambres (RoomTypes)](#types-de-chambres)
2. [Chambres (Rooms)](#chambres)
3. [Réservations (Bookings)](#réservations)
4. [Paiement sur réservation](#paiement-sur-réservation)
5. [Rapports des réservations](#rapports-des-réservations)
6. [Factures (Invoices)](#factures)
7. [Exemples de flux complets](#exemples-de-flux)

---

## Types de Chambres

### 1. Créer un type de chambre

**POST** `/room-types`

Crée un nouveau type de chambre avec ses tarifs (heure, nuit, 24h).

**Body:**
```json
{
  "name": "Suite Deluxe",
  "description": "Suite luxueuse avec vue sur la ville",
  "hourlyRate": 15,
  "nightRate": 60,
  "fullDayRate": 100,
  "capacity": 2,
  "amenities": ["WiFi", "TV", "Climatisation", "Mini-bar"]
}
```

**Réponse (201):**
```json
{
  "message": "Room type created successfully",
  "roomType": {
    "_id": "6734be089acec1931a6e0b42",
    "companyId": "6734be089acec1931a6e0b40",
    "name": "Suite Deluxe",
    "description": "Suite luxueuse avec vue sur la ville",
    "hourlyRate": 15,
    "nightRate": 60,
    "fullDayRate": 100,
    "capacity": 2,
    "amenities": ["WiFi", "TV", "Climatisation", "Mini-bar"],
    "createdAt": "2026-03-19T06:00:00.000Z"
  }
}
```

---

### 2. Lister tous les types de chambres

**GET** `/room-types?page=1&limit=10&name=Suite`

**Query Parameters:**
- `page` (optional): Numéro de page (défaut: 1)
- `limit` (optional): Nombre d'éléments par page (défaut: 10)
- `name` (optional): Filtrer par nom

**Réponse (200):**
```json
{
  "roomTypes": [...],
  "totalPages": 2,
  "currentPage": 1,
  "total": 15
}
```

---

### 3. Récupérer un type de chambre

**GET** `/room-types/:id`

---

### 4. Mettre à jour un type de chambre

**PUT** `/room-types/:id`

---

### 5. Supprimer un type de chambre

**DELETE** `/room-types/:id`

---

## Chambres

### 1. Créer une chambre

**POST** `/rooms`

Crée une nouvelle chambre. Les tarifs sont hérités du type, mais peuvent être personnalisés.

**Body:**
```json
{
  "roomNumber": "201",
  "roomTypeId": "6734be089acec1931a6e0b42",
  "status": "available",
  "capacity": 2,
  "description": "Chambre avec vue sur jardin",
  "floor": 2,
  "customFullDayRate": 120
}
```

**Champs optionnels pour tarifs personnalisés:**
- `customHourlyRate`: Tarif horaire personnalisé
- `customNightRate`: Tarif nuit personnalisé
- `customFullDayRate`: Tarif 24h personnalisé

**Réponse (201):**
```json
{
  "message": "Room created successfully",
  "room": {
    "_id": "6734be089acec1931a6e0b43",
    "companyId": "6734be089acec1931a6e0b40",
    "roomNumber": "201",
    "roomTypeId": {...},
    "status": "available",
    "capacity": 2,
    "description": "Chambre avec vue sur jardin",
    "floor": 2,
    "customFullDayRate": 120,
    "createdAt": "2026-03-19T06:00:00.000Z"
  }
}
```

---

### 2. Lister toutes les chambres

**GET** `/rooms?status=available&floor=2`

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filtrer par statut (`available`, `occupied`, `maintenance`, `reserved`)
- `roomTypeId`: Filtrer par type de chambre
- `roomNumber`: Rechercher par numéro
- `floor`: Filtrer par étage

---

### 3. Récupérer une chambre

**GET** `/rooms/:id`

---

### 4. Mettre à jour une chambre

**PUT** `/rooms/:id`

---

### 5. Mettre à jour le statut d'une chambre

**PATCH** `/rooms/:id/status`

**Body:**
```json
{
  "status": "maintenance"
}
```

**Statuts possibles:**
- `available`: Disponible
- `occupied`: Occupée
- `maintenance`: En maintenance
- `reserved`: Réservée

---

### 6. Supprimer une chambre

**DELETE** `/rooms/:id`

---

## Réservations

### 1. Créer une réservation

**POST** `/bookings`

Crée une réservation. Le montant est calculé automatiquement selon la durée et les tarifs.

**Body (Tarif Standard):**
```json
{
  "roomId": "6734be089acec1931a6e0b43",
  "clientName": "Jean Dupont",
  "clientPhone": "+243826016607",
  "clientEmail": "jean@example.com",
  "cardNumber": "1234-5678-9012",
  "checkIn": "2026-03-20T14:00:00Z",
  "checkOut": "2026-03-25T11:00:00Z",
  "rateType": "standard",
  "notes": "Client régulier",
  "nomFemme": "Marie Dupont"
}
```

**Body (Tarif Négocié - Marchandage):**
```json
{
  "roomId": "6734be089acec1931a6e0b43",
  "clientName": "Jean Dupont",
  "clientPhone": "+243826016607",
  "checkIn": "2026-03-20T14:00:00Z",
  "checkOut": "2026-04-20T11:00:00Z",
  "rateType": "negotiated",
  "negotiatedRate": 1000,
  "notes": "Tarif spécial long séjour (30 jours)",
  "nomFemme": ""
}
```

> **Note :** Le champ `nomFemme` est **optionnel**. Il permet d'enregistrer le nom de la femme du client.

**Logique de calcul automatique (si `rateType: "standard"`):**
- **< 12h** → `heures × hourlyRate`
- **12h - 24h** → `nightRate`
- **≥ 24h** → `jours × fullDayRate`

**Réponse (201):**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "6734be089acec1931a6e0b44",
    "companyId": "6734be089acec1931a6e0b40",
    "roomId": {...},
    "clientName": "Jean Dupont",
    "clientPhone": "+243826016607",
    "cardNumber": "1234-5678-9012",
    "checkIn": "2026-03-20T14:00:00.000Z",
    "checkOut": "2026-03-25T11:00:00.000Z",
    "status": "pending",
    "rateType": "standard",
    "calculatedAmount": 500,
    "finalAmount": 500,
    "paidAmount": 0,
    "remainingAmount": 500,
    "nomFemme": "Marie Dupont",
    "createdAt": "2026-03-19T06:00:00.000Z"
  }
}
```

---

### 2. Lister toutes les réservations

**GET** `/bookings?status=checked-in&clientName=Jean`

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filtrer par statut (`pending`, `checked-in`, `checked-out`, `cancelled`)
- `roomId`: Filtrer par chambre
- `clientName`: Rechercher par nom de client
- `startDate`, `endDate`: Filtrer par période

---

### 3. Récupérer une réservation

**GET** `/bookings/:id`

---

### 4. Mettre à jour une réservation

**PUT** `/bookings/:id`

---

### 5. Check-in (Arrivée du client)

**POST** `/bookings/:id/check-in`

Change le statut de la réservation à `checked-in` et met la chambre en statut `occupied`.

**Réponse (200):**
```json
{
  "message": "Check-in successful",
  "booking": {...}
}
```

---

### 6. Check-out (Départ du client)

**POST** `/bookings/:id/check-out`

Effectue le check-out, calcule le montant final et libère la chambre.

**Body (optionnel):**
```json
{
  "checkOut": "2026-03-25T11:00:00Z"
}
```

Si `checkOut` n'est pas fourni, utilise la date/heure actuelle.

**Réponse (200):**
```json
{
  "message": "Check-out successful",
  "booking": {
    "_id": "6734be089acec1931a6e0b44",
    "status": "checked-out",
    "checkOut": "2026-03-25T11:00:00.000Z",
    "finalAmount": 500,
    ...
  }
}
```

---

### 7. Annuler une réservation

**POST** `/bookings/:id/cancel`

Annule une réservation et libère la chambre.

---

## Paiement sur réservation

### 8. Effectuer un paiement sur une réservation en attente

**POST** `/bookings/:id/pay`

Effectue un paiement (total ou partiel) sur une réservation en statut `pending`. Le paiement peut être effectué en plusieurs fois.

**Body:**
```json
{
  "amount": 200,
  "paymentMethod": "cash"
}
```

**Champs du body:**
- `amount` (required): Montant à payer (doit être > 0)
- `paymentMethod` (optional): Méthode de paiement (`cash`, `mobile_money`, `bank_transfer`, `card`). Défaut: `cash`

**Règles:**
- Le paiement ne peut être effectué que sur une réservation **en attente (pending)**
- Le montant ne peut pas dépasser le montant restant à payer
- Les paiements partiels sont cumulés

**Réponse (200) - Paiement partiel:**
```json
{
  "message": "Paiement partiel effectué",
  "booking": {...},
  "paymentDetails": {
    "amountPaid": 200,
    "totalPaid": 200,
    "remainingAmount": 300,
    "finalAmount": 500,
    "paymentMethod": "cash",
    "paymentDate": "2026-03-20T10:30:00.000Z"
  }
}
```

**Réponse (200) - Paiement complet:**
```json
{
  "message": "Paiement complet effectué",
  "booking": {...},
  "paymentDetails": {
    "amountPaid": 300,
    "totalPaid": 500,
    "remainingAmount": 0,
    "finalAmount": 500,
    "paymentMethod": "mobile_money",
    "paymentDate": "2026-03-20T11:00:00.000Z"
  }
}
```

---

## Rapports des réservations

### 9. Rapport résumé

**GET** `/bookings/reports/summary?startDate=2026-03-01&endDate=2026-03-31`

Retourne un résumé complet des réservations avec totaux, statistiques par statut, par jour, par type de tarif et par méthode de paiement.

**Query Parameters:**
- `startDate` (optional): Date de début (filtre sur checkIn)
- `endDate` (optional): Date de fin
- `status` (optional): Filtrer par statut

**Réponse (200):**
```json
{
  "summary": {
    "totalBookings": 45,
    "totalFinalAmount": 22500,
    "totalPaidAmount": 18000,
    "totalRemainingAmount": 4500,
    "averageAmount": 500,
    "minAmount": 50,
    "maxAmount": 2000
  },
  "bookingsByStatus": [
    { "_id": "checked-out", "count": 20, "totalAmount": 12000, "totalPaid": 12000 },
    { "_id": "pending", "count": 15, "totalAmount": 7500, "totalPaid": 3000 },
    { "_id": "checked-in", "count": 8, "totalAmount": 2500, "totalPaid": 2500 },
    { "_id": "cancelled", "count": 2, "totalAmount": 500, "totalPaid": 500 }
  ],
  "bookingsByDay": [
    { "_id": "2026-03-20", "count": 5, "totalAmount": 2500, "totalPaid": 2000 },
    { "_id": "2026-03-21", "count": 3, "totalAmount": 1500, "totalPaid": 1500 }
  ],
  "bookingsByRateType": [
    { "_id": "standard", "count": 35, "totalAmount": 17500 },
    { "_id": "negotiated", "count": 10, "totalAmount": 5000 }
  ],
  "bookingsByPaymentMethod": [
    { "_id": "cash", "count": 25, "totalPaid": 12000 },
    { "_id": "mobile_money", "count": 10, "totalPaid": 5000 },
    { "_id": "bank_transfer", "count": 3, "totalPaid": 1000 }
  ]
}
```

---

### 10. Rapport détaillé

**GET** `/bookings/reports/detailed?startDate=2026-03-01&endDate=2026-03-31&status=checked-out&page=1&limit=50`

Retourne la liste détaillée des réservations avec informations enrichies: durée de séjour, heures formatées, nom de la chambre, statut de paiement.

**Query Parameters:**
- `startDate`, `endDate`: Période
- `status`: Filtrer par statut
- `roomId`: Filtrer par chambre
- `page`, `limit`: Pagination

**Réponse (200):**
```json
{
  "bookings": [
    {
      "_id": "6734be089acec1931a6e0b44",
      "clientName": "Jean Dupont",
      "nomFemme": "Marie Dupont",
      "checkIn": "2026-03-20T14:00:00.000Z",
      "checkOut": "2026-03-25T11:00:00.000Z",
      "checkInFormatted": "20/03/2026 15:00:00",
      "checkOutFormatted": "25/03/2026 12:00:00",
      "durationHours": 117,
      "durationText": "4j 21h",
      "status": "checked-out",
      "finalAmount": 500,
      "paidAmount": 500,
      "remainingAmount": 0,
      "roomName": "Suite 201",
      "roomTypeName": "Suite Deluxe",
      "isPaid": true,
      "paymentStatus": "paid",
      "paymentMethod": "cash"
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 1
}
```

**Valeurs `paymentStatus`:**
- `paid`: Entièrement payé
- `partial`: Paiement partiel
- `unpaid`: Non payé
- `no-amount`: Montant non défini

---

### 11. Rapport par chambre

**GET** `/bookings/reports/by-room?startDate=2026-03-01&endDate=2026-03-31`

Retourne les statistiques de réservations regroupées par chambre.

**Réponse (200):**
```json
{
  "reportByRoom": [
    {
      "roomId": "6734be089acec1931a6e0b43",
      "roomName": "Suite 201",
      "roomTypeName": "Suite Deluxe",
      "totalBookings": 12,
      "totalAmount": 6000,
      "totalPaid": 5500,
      "totalRemaining": 500,
      "avgAmount": 500
    }
  ]
}
```

---

## Factures

### 1. Créer une facture

**POST** `/invoices`

Génère une facture à partir d'une réservation qui a été check-out.

**Body:**
```json
{
  "bookingId": "6734be089acec1931a6e0b44"
}
```

**Réponse (201):**
```json
{
  "message": "Invoice created successfully",
  "invoice": {
    "_id": "6734be089acec1931a6e0b45",
    "companyId": "6734be089acec1931a6e0b40",
    "bookingId": "6734be089acec1931a6e0b44",
    "invoiceNumber": "INV-202603-00001",
    "clientName": "Jean Dupont",
    "roomNumber": "201",
    "roomType": "Suite Deluxe",
    "checkIn": "2026-03-20T14:00:00.000Z",
    "checkOut": "2026-03-25T11:00:00.000Z",
    "duration": {
      "hours": 117,
      "days": 4
    },
    "rateApplied": "fullDay",
    "rateDetails": "4 jour(s) × 120 = 480",
    "totalAmount": 500,
    "cardNumber": "1234-5678-9012",
    "status": "issued",
    "createdAt": "2026-03-25T11:30:00.000Z"
  }
}
```

---

### 2. Lister toutes les factures

**GET** `/invoices?status=paid&clientName=Jean`

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Filtrer par statut (`draft`, `issued`, `paid`, `cancelled`)
- `clientName`: Rechercher par nom de client
- `invoiceNumber`: Rechercher par numéro de facture
- `startDate`, `endDate`: Filtrer par période de création

---

### 3. Récupérer une facture par ID

**GET** `/invoices/:id`

---

### 4. Récupérer une facture par numéro

**GET** `/invoices/number/:invoiceNumber`

**Exemple:** `/invoices/number/INV-202603-00001`

---

### 5. Mettre à jour le statut d'une facture

**PATCH** `/invoices/:id/status`

**Body:**
```json
{
  "status": "paid"
}
```

**Statuts possibles:**
- `draft`: Brouillon
- `issued`: Émise
- `paid`: Payée
- `cancelled`: Annulée

---

### 6. Générer les données pour PDF

**GET** `/invoices/:id/pdf`

Retourne les données de la facture formatées pour génération PDF.

---

## Exemples de flux complets

### Flux 1: Réservation simple avec tarif standard

```bash
# 1. Créer un type de chambre
POST /api/v1/room-types
{
  "name": "Standard",
  "hourlyRate": 10,
  "nightRate": 50,
  "fullDayRate": 80,
  "capacity": 2
}

# 2. Créer une chambre
POST /api/v1/rooms
{
  "roomNumber": "101",
  "roomTypeId": "TYPE_ID",
  "status": "available"
}

# 3. Créer une réservation (3 jours)
POST /api/v1/bookings
{
  "roomId": "ROOM_ID",
  "clientName": "Marie Martin",
  "clientPhone": "+243826016607",
  "checkIn": "2026-03-20T14:00:00Z",
  "checkOut": "2026-03-23T11:00:00Z",
  "rateType": "standard"
}
# Calcul auto: 3 jours × 80 = 240$

# 4. Check-in
POST /api/v1/bookings/BOOKING_ID/check-in

# 5. Check-out
POST /api/v1/bookings/BOOKING_ID/check-out

# 6. Créer la facture
POST /api/v1/invoices
{
  "bookingId": "BOOKING_ID"
}

# 7. Marquer comme payée
PATCH /api/v1/invoices/INVOICE_ID/status
{
  "status": "paid"
}
```

---

### Flux 2: Réservation longue durée avec marchandage

```bash
# 1. Créer une réservation avec tarif négocié (30 jours)
POST /api/v1/bookings
{
  "roomId": "ROOM_ID",
  "clientName": "Paul Dubois",
  "clientPhone": "+243826016607",
  "cardNumber": "9876-5432-1098",
  "checkIn": "2026-03-20T14:00:00Z",
  "checkOut": "2026-04-20T11:00:00Z",
  "rateType": "negotiated",
  "negotiatedRate": 1500,
  "notes": "Tarif spécial long séjour - 30 jours au lieu de 2400$"
}
# Tarif standard serait: 30 jours × 80 = 2400$
# Tarif négocié: 1500$ (économie de 900$)

# 2. Check-in
POST /api/v1/bookings/BOOKING_ID/check-in

# 3. Check-out (après 30 jours)
POST /api/v1/bookings/BOOKING_ID/check-out

# 4. Facture générée avec tarif négocié
POST /api/v1/invoices
{
  "bookingId": "BOOKING_ID"
}
# La facture montrera:
# - calculatedAmount: 2400 (tarif standard)
# - finalAmount: 1500 (tarif négocié)
# - rateApplied: "negotiated"
```

---

### Flux 3: Chambre avec tarif personnalisé

```bash
# 1. Créer une chambre VIP avec tarifs personnalisés
POST /api/v1/rooms
{
  "roomNumber": "Suite 501",
  "roomTypeId": "STANDARD_TYPE_ID",
  "status": "available",
  "customHourlyRate": 20,
  "customNightRate": 100,
  "customFullDayRate": 150,
  "description": "Suite VIP avec tarifs premium"
}

# 2. Réservation (5 jours)
POST /api/v1/bookings
{
  "roomId": "ROOM_ID",
  "clientName": "Sophie Laurent",
  "checkIn": "2026-03-20T14:00:00Z",
  "checkOut": "2026-03-25T11:00:00Z",
  "rateType": "standard"
}
# Calcul: 5 jours × 150 (tarif personnalisé) = 750$
```

---

## 🔑 Points importants

### Hiérarchie des tarifs
1. **Tarif négocié** (priorité maximale si `rateType: "negotiated"`)
2. **Tarif personnalisé de la chambre** (si défini)
3. **Tarif du type de chambre** (par défaut)

### Statuts des chambres
- `available` → Disponible pour réservation
- `reserved` → Réservée (après création de booking)
- `occupied` → Occupée (après check-in)
- `maintenance` → En maintenance

### Statuts des réservations
- `pending` → En attente
- `checked-in` → Client arrivé
- `checked-out` → Client parti
- `cancelled` → Annulée

### Statuts des factures
- `draft` → Brouillon
- `issued` → Émise
- `paid` → Payée
- `cancelled` → Annulée

---

## 📱 Accès Swagger

Documentation interactive disponible sur:
**http://localhost:8000/api/v1/docs**

Recherchez les tags:
- **RoomTypes** - Types de chambres
- **Rooms** - Chambres
- **Bookings** - Réservations
- **Invoices** - Factures

---

## 🎯 Catégorie Hotel

Le module utilise la catégorie **"Hotel"** créée dans la base de données.

Pour créer une entreprise hôtelière:
```bash
POST /api/v1/companies
{
  "name": "Hôtel Paradise",
  "address": "123 Avenue des Palmiers, Kinshasa",
  "currency": "USD",
  "signCurrency": "$",
  "category": "HOTEL_CATEGORY_ID"
}
```

---

**Développé pour l'API Genius Vente** 🚀
