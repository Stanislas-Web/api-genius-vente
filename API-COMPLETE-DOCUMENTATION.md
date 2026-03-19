# 📚 API Genius Vente - Documentation Complète

## 🎯 Vue d'ensemble

API complète de gestion multi-modules pour les entreprises. Supporte la gestion des ventes, des stocks, des écoles et des hôtels avec un système multi-tenant.

**Base URL:** `http://localhost:8000/api/v1`

**Documentation Swagger:** `http://localhost:8000/api/v1/docs`

---

## 📋 Table des matières

1. [Authentification](#authentification)
2. [Catégories & Entreprises](#catégories--entreprises)
3. [Module Ventes & Stock](#module-ventes--stock)
4. [Module École](#module-école)
5. [Module Hôtel](#module-hôtel)
6. [Rapports](#rapports)
7. [Versions](#versions)

---

## 🔐 Authentification

### 1. Inscription (Sign Up)

**POST** `/signup`

**Body:**
```json
{
  "username": "John Doe",
  "phone": "+243826016607",
  "password": "1234",
  "role": "admin",
  "companyId": "6734be089acec1931a6e0b40"
}
```

**Réponse (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "...",
    "username": "John Doe",
    "phone": "+243826016607",
    "role": "admin"
  }
}
```

---

### 2. Connexion (Login)

**POST** `/login`

**Body:**
```json
{
  "phone": "+243826016607",
  "password": "1234"
}
```

**Réponse (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "John Doe",
    "phone": "+243826016607",
    "role": "admin",
    "companyId": "..."
  }
}
```

**⚠️ Important:** Utilisez le token dans le header `Authorization: Bearer <token>` pour toutes les requêtes protégées.

---

## 🏢 Catégories & Entreprises

### 1. Lister les catégories (Public)

**GET** `/categories`

**Réponse (200):**
```json
{
  "categories": [
    {
      "_id": "673b409eea61dc597ae62f73",
      "name": "Restaurants et fast-foods",
      "nameEnglish": "Restaurants and fast-food"
    },
    {
      "_id": "69bb913200ce258021e852cf",
      "name": "Hotel",
      "nameEnglish": "Hotel"
    }
  ]
}
```

**Catégories disponibles:**
- Restaurants et fast-foods
- Boutiques de vêtements
- Supermarchés
- École
- Hotel
- Et plus...

---

### 2. Créer une entreprise (Public)

**POST** `/companies`

**Body:**
```json
{
  "name": "Mon Entreprise",
  "address": "123 Avenue des Palmiers, Kinshasa",
  "currency": "USD",
  "signCurrency": "$",
  "category": "69bb913200ce258021e852cf"
}
```

**Réponse (201):**
```json
{
  "message": "Company created successfully",
  "company": {
    "_id": "...",
    "name": "Mon Entreprise",
    "address": "123 Avenue des Palmiers, Kinshasa",
    "currency": "USD",
    "signCurrency": "$",
    "category": "..."
  }
}
```

---

### 3. Récupérer une entreprise

**GET** `/companies/:id` 🔒

---

### 4. Mettre à jour une entreprise

**PUT** `/companies/:id` 🔒

---

## 🛒 Module Ventes & Stock

### Produits

#### 1. Créer un produit

**POST** `/products` 🔒

**Body:**
```json
{
  "name": "Coca-Cola 500ml",
  "price": 2.5,
  "quantity": 100,
  "category": "Boissons",
  "description": "Boisson gazeuse",
  "barcode": "123456789"
}
```

---

#### 2. Lister les produits

**GET** `/products?page=1&limit=10&search=Coca` 🔒

**Query Parameters:**
- `page`: Numéro de page
- `limit`: Nombre d'éléments par page
- `search`: Rechercher par nom
- `category`: Filtrer par catégorie

---

#### 3. Récupérer un produit

**GET** `/products/:id` 🔒

---

#### 4. Mettre à jour un produit

**PUT** `/products/:id` 🔒

---

#### 5. Supprimer un produit

**DELETE** `/products/:id` 🔒

---

### Ventes

#### 1. Créer une vente

**POST** `/sales` 🔒

**Body:**
```json
{
  "products": [
    {
      "productId": "6734be089acec1931a6e0b42",
      "quantity": 2,
      "price": 2.5,
      "total": 5
    }
  ],
  "totalAmount": 5,
  "paymentMethod": "cash",
  "customerName": "Client ABC",
  "customerPhone": "+243826016607"
}
```

---

#### 2. Lister les ventes

**GET** `/sales?startDate=2026-03-01&endDate=2026-03-31` 🔒

---

#### 3. Récupérer une vente

**GET** `/sales/:id` 🔒

---

### Mouvements de Stock

#### 1. Créer un mouvement

**POST** `/stock-mouvements` 🔒

**Body:**
```json
{
  "productId": "6734be089acec1931a6e0b42",
  "type": "in",
  "quantity": 50,
  "reason": "Réapprovisionnement",
  "date": "2026-03-19"
}
```

**Types:**
- `in`: Entrée de stock
- `out`: Sortie de stock

---

#### 2. Lister les mouvements

**GET** `/stock-mouvements?productId=...&type=in` 🔒

---

## 🎓 Module École

### Classes (Classrooms)

#### 1. Créer une classe

**POST** `/classrooms` 🔒

**Body:**
```json
{
  "name": "6ème Année",
  "level": "Primaire",
  "capacity": 30,
  "academicYear": "2025-2026"
}
```

---

#### 2. Lister les classes

**GET** `/classrooms?level=Primaire` 🔒

---

### Élèves (Students)

#### 1. Créer un élève

**POST** `/students` 🔒

**Body:**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "dateOfBirth": "2010-05-15",
  "gender": "M",
  "classroomId": "6734be089acec1931a6e0b42",
  "parentName": "Marie Dupont",
  "parentPhone": "+243826016607",
  "address": "123 Rue de la Paix"
}
```

---

#### 2. Lister les élèves

**GET** `/students?classroomId=...&search=Jean` 🔒

---

### Enseignants (Teachers)

#### 1. Créer un enseignant

**POST** `/teachers` 🔒

**Body:**
```json
{
  "firstName": "Paul",
  "lastName": "Martin",
  "phone": "+243826016607",
  "email": "paul@example.com",
  "subject": "Mathématiques",
  "hireDate": "2020-09-01"
}
```

---

#### 2. Lister les enseignants

**GET** `/teachers?subject=Mathématiques` 🔒

---

### Frais Scolaires (School Fees)

#### 1. Créer un frais scolaire

**POST** `/school-fees` 🔒

**Body:**
```json
{
  "name": "Frais de scolarité",
  "amount": 100,
  "type": "tuition",
  "academicYear": "2025-2026",
  "dueDate": "2026-03-31"
}
```

---

#### 2. Lister les frais

**GET** `/school-fees?type=tuition` 🔒

---

### Paiements (Payments)

#### 1. Créer un paiement

**POST** `/payments` 🔒

**Body:**
```json
{
  "studentId": "6734be089acec1931a6e0b42",
  "schoolFeeId": "6734be089acec1931a6e0b43",
  "amount": 100,
  "paymentMethod": "cash",
  "paymentDate": "2026-03-19"
}
```

---

#### 2. Lister les paiements

**GET** `/payments?studentId=...&status=paid` 🔒

---

### Sections

#### 1. Créer une section

**POST** `/sections` 🔒

**Body:**
```json
{
  "name": "Scientifique",
  "description": "Section sciences"
}
```

---

### Options

#### 1. Créer une option

**POST** `/options` 🔒

**Body:**
```json
{
  "name": "Math-Physique",
  "sectionId": "6734be089acec1931a6e0b42"
}
```

---

## 🏨 Module Hôtel

### Types de Chambres (RoomTypes)

#### 1. Créer un type de chambre

**POST** `/room-types` 🔒

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

**Tarifs:**
- `hourlyRate`: Tarif à l'heure
- `nightRate`: Tarif nuit (12h-24h)
- `fullDayRate`: Tarif 24 heures

---

#### 2. Lister les types de chambres

**GET** `/room-types?page=1&limit=10` 🔒

---

#### 3. Récupérer un type

**GET** `/room-types/:id` 🔒

---

#### 4. Mettre à jour un type

**PUT** `/room-types/:id` 🔒

---

#### 5. Supprimer un type

**DELETE** `/room-types/:id` 🔒

---

### Chambres (Rooms)

#### 1. Créer une chambre

**POST** `/rooms` 🔒

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

**Statuts:**
- `available`: Disponible
- `occupied`: Occupée
- `maintenance`: En maintenance
- `reserved`: Réservée

**Tarifs personnalisés (optionnels):**
- `customHourlyRate`
- `customNightRate`
- `customFullDayRate`

---

#### 2. Lister les chambres

**GET** `/rooms?status=available&floor=2` 🔒

---

#### 3. Récupérer une chambre

**GET** `/rooms/:id` 🔒

---

#### 4. Mettre à jour une chambre

**PUT** `/rooms/:id` 🔒

---

#### 5. Mettre à jour le statut

**PATCH** `/rooms/:id/status` 🔒

**Body:**
```json
{
  "status": "maintenance"
}
```

---

#### 6. Supprimer une chambre

**DELETE** `/rooms/:id` 🔒

---

### Réservations (Bookings)

#### 1. Créer une réservation

**POST** `/bookings` 🔒

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
  "notes": "Client régulier"
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
  "notes": "Tarif spécial long séjour"
}
```

**Calcul automatique (si `rateType: "standard"`):**
- **< 12h** → `heures × hourlyRate`
- **12h - 24h** → `nightRate`
- **≥ 24h** → `jours × fullDayRate`

---

#### 2. Lister les réservations

**GET** `/bookings?status=checked-in&clientName=Jean` 🔒

**Statuts:**
- `pending`: En attente
- `checked-in`: Client arrivé
- `checked-out`: Client parti
- `cancelled`: Annulée

---

#### 3. Récupérer une réservation

**GET** `/bookings/:id` 🔒

---

#### 4. Mettre à jour une réservation

**PUT** `/bookings/:id` 🔒

---

#### 5. Check-in (Arrivée)

**POST** `/bookings/:id/check-in` 🔒

Change le statut à `checked-in` et met la chambre en `occupied`.

---

#### 6. Check-out (Départ)

**POST** `/bookings/:id/check-out` 🔒

**Body (optionnel):**
```json
{
  "checkOut": "2026-03-25T11:00:00Z"
}
```

Calcule le montant final et libère la chambre.

---

#### 7. Annuler une réservation

**POST** `/bookings/:id/cancel` 🔒

---

### Factures (Invoices)

#### 1. Créer une facture

**POST** `/invoices` 🔒

**Body:**
```json
{
  "bookingId": "6734be089acec1931a6e0b44"
}
```

Génère une facture avec numéro automatique (format: `INV-YYYYMM-XXXXX`).

**Réponse:**
```json
{
  "message": "Invoice created successfully",
  "invoice": {
    "invoiceNumber": "INV-202603-00001",
    "clientName": "Jean Dupont",
    "roomNumber": "201",
    "roomType": "Suite Deluxe",
    "duration": {
      "hours": 117,
      "days": 4
    },
    "rateApplied": "fullDay",
    "rateDetails": "4 jour(s) × 100 = 400",
    "totalAmount": 400,
    "status": "issued"
  }
}
```

---

#### 2. Lister les factures

**GET** `/invoices?status=paid&clientName=Jean` 🔒

**Statuts:**
- `draft`: Brouillon
- `issued`: Émise
- `paid`: Payée
- `cancelled`: Annulée

---

#### 3. Récupérer une facture par ID

**GET** `/invoices/:id` 🔒

---

#### 4. Récupérer par numéro

**GET** `/invoices/number/:invoiceNumber` 🔒

**Exemple:** `/invoices/number/INV-202603-00001`

---

#### 5. Mettre à jour le statut

**PATCH** `/invoices/:id/status` 🔒

**Body:**
```json
{
  "status": "paid"
}
```

---

#### 6. Données pour PDF

**GET** `/invoices/:id/pdf` 🔒

Retourne les données formatées pour génération PDF.

---

## 📊 Rapports

### 1. Résumé des ventes

**GET** `/reports/sales-summary` 🔒

---

### 2. Résumé par téléphone (Public)

**POST** `/sales-summary-by-phone`

**Body:**
```json
{
  "phone": "+243826016607"
}
```

**Réponse:**
```json
{
  "message": "Sales summary generated successfully",
  "user": {
    "username": "John Doe",
    "phone": "+243826016607"
  },
  "summary": {
    "totalSalesAmount": 15000,
    "todaySalesAmount": 500,
    "salesCountToday": 12
  },
  "allTimeProducts": {
    "mostSold": {
      "productName": "Coca-Cola 500ml",
      "quantity": 150,
      "revenue": 375
    },
    "leastSold": {...}
  },
  "dailyProducts": {
    "todayDate": "2026-03-19",
    "mostSoldToday": {...},
    "leastSoldToday": {...}
  }
}
```

---

## 📱 Versions

### 1. Lister toutes les versions (Public)

**GET** `/versions`

---

### 2. Dernière version (Public)

**GET** `/versions/latest`

---

### 3. Version par ID (Public)

**GET** `/versions/:id`

---

## 🎯 Exemples de Flux Complets

### Flux 1: Créer une entreprise et un utilisateur

```bash
# 1. Créer l'entreprise
POST /api/v1/companies
{
  "name": "Restaurant Le Gourmet",
  "address": "123 Avenue de la Liberté",
  "currency": "USD",
  "signCurrency": "$",
  "category": "673b409eea61dc597ae62f73"
}
# Réponse: companyId = "ABC123"

# 2. Créer l'utilisateur admin
POST /api/v1/signup
{
  "username": "Admin Restaurant",
  "phone": "+243826016607",
  "password": "1234",
  "role": "admin",
  "companyId": "ABC123"
}

# 3. Se connecter
POST /api/v1/login
{
  "phone": "+243826016607",
  "password": "1234"
}
# Réponse: token = "eyJhbGc..."
```

---

### Flux 2: Vente complète

```bash
# 1. Créer un produit
POST /api/v1/products
Authorization: Bearer <token>
{
  "name": "Pizza Margherita",
  "price": 12,
  "quantity": 50,
  "category": "Plats"
}
# Réponse: productId = "PROD123"

# 2. Créer une vente
POST /api/v1/sales
Authorization: Bearer <token>
{
  "products": [
    {
      "productId": "PROD123",
      "quantity": 2,
      "price": 12,
      "total": 24
    }
  ],
  "totalAmount": 24,
  "paymentMethod": "cash",
  "customerName": "Client ABC"
}

# 3. Voir le rapport
POST /api/v1/sales-summary-by-phone
{
  "phone": "+243826016607"
}
```

---

### Flux 3: Réservation hôtel complète

```bash
# 1. Créer un type de chambre
POST /api/v1/room-types
Authorization: Bearer <token>
{
  "name": "Standard",
  "hourlyRate": 10,
  "nightRate": 50,
  "fullDayRate": 80,
  "capacity": 2
}
# Réponse: roomTypeId = "TYPE123"

# 2. Créer une chambre
POST /api/v1/rooms
Authorization: Bearer <token>
{
  "roomNumber": "101",
  "roomTypeId": "TYPE123",
  "status": "available"
}
# Réponse: roomId = "ROOM123"

# 3. Créer une réservation (3 jours)
POST /api/v1/bookings
Authorization: Bearer <token>
{
  "roomId": "ROOM123",
  "clientName": "Marie Martin",
  "clientPhone": "+243826016607",
  "checkIn": "2026-03-20T14:00:00Z",
  "checkOut": "2026-03-23T11:00:00Z",
  "rateType": "standard"
}
# Calcul auto: 3 jours × 80 = 240$
# Réponse: bookingId = "BOOK123"

# 4. Check-in
POST /api/v1/bookings/BOOK123/check-in
Authorization: Bearer <token>

# 5. Check-out
POST /api/v1/bookings/BOOK123/check-out
Authorization: Bearer <token>

# 6. Créer la facture
POST /api/v1/invoices
Authorization: Bearer <token>
{
  "bookingId": "BOOK123"
}
# Réponse: invoiceNumber = "INV-202603-00001"

# 7. Marquer comme payée
PATCH /api/v1/invoices/INV_ID/status
Authorization: Bearer <token>
{
  "status": "paid"
}
```

---

### Flux 4: Gestion scolaire

```bash
# 1. Créer une classe
POST /api/v1/classrooms
Authorization: Bearer <token>
{
  "name": "6ème Année",
  "level": "Primaire",
  "capacity": 30,
  "academicYear": "2025-2026"
}
# Réponse: classroomId = "CLASS123"

# 2. Créer un élève
POST /api/v1/students
Authorization: Bearer <token>
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "dateOfBirth": "2010-05-15",
  "gender": "M",
  "classroomId": "CLASS123",
  "parentName": "Marie Dupont",
  "parentPhone": "+243826016607"
}
# Réponse: studentId = "STUD123"

# 3. Créer un frais scolaire
POST /api/v1/school-fees
Authorization: Bearer <token>
{
  "name": "Frais de scolarité",
  "amount": 100,
  "type": "tuition",
  "academicYear": "2025-2026",
  "dueDate": "2026-03-31"
}
# Réponse: schoolFeeId = "FEE123"

# 4. Enregistrer un paiement
POST /api/v1/payments
Authorization: Bearer <token>
{
  "studentId": "STUD123",
  "schoolFeeId": "FEE123",
  "amount": 100,
  "paymentMethod": "cash",
  "paymentDate": "2026-03-19"
}
```

---

## 🔑 Points Importants

### Authentification
- 🔒 = Nécessite un token JWT
- Routes publiques: `/login`, `/signup`, `/companies` (POST), `/categories` (GET), `/sales-summary-by-phone`, `/versions`

### Multi-tenant
- Chaque entreprise (company) a ses propres données isolées
- Le `companyId` est automatiquement extrait du token JWT

### Pagination
- Paramètres: `page` (défaut: 1) et `limit` (défaut: 10)
- Réponse inclut: `totalPages`, `currentPage`, `total`

### Formats de dates
- ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Exemple: `2026-03-19T14:00:00Z`

### Devises
- Configurable par entreprise
- Champs: `currency` (ex: "USD") et `signCurrency` (ex: "$")

### Hiérarchie des tarifs (Hôtel)
1. **Tarif négocié** (priorité max)
2. **Tarif personnalisé de la chambre**
3. **Tarif du type de chambre** (défaut)

---

## 📱 Accès

- **API Base:** `http://localhost:8000/api/v1`
- **Swagger:** `http://localhost:8000/api/v1/docs`
- **Serveur:** PM2 (port 8000)

---

## 🎯 Modules Disponibles

| Module | Catégorie | Endpoints |
|--------|-----------|-----------|
| **Ventes & Stock** | Tous | `/products`, `/sales`, `/stock-mouvements` |
| **École** | École | `/classrooms`, `/students`, `/teachers`, `/school-fees`, `/payments`, `/sections`, `/options` |
| **Hôtel** | Hotel | `/room-types`, `/rooms`, `/bookings`, `/invoices` |
| **Rapports** | Tous | `/reports/*`, `/sales-summary-by-phone` |

---

## 📞 Support

Pour toute question ou problème, consultez:
- **Documentation Swagger** pour tester les endpoints
- **Fichiers de documentation spécifiques:**
  - `HOTEL-MANAGEMENT-API.md` - Module hôtel détaillé
  - `SCHOOL-MANAGEMENT-API.md` - Module école détaillé
  - `SCHOOL-FEE-API-DOCUMENTATION.md` - Frais scolaires
  - `API-SECTIONS-OPTIONS.md` - Sections et options

---

**Développé pour API Genius Vente** 🚀  
**Version:** 1.0.0  
**Dernière mise à jour:** Mars 2026
