# 📚 API Genius Vente - Module Gestion Scolaire

## 📖 Vue d'ensemble

Cette documentation décrit l'API de gestion scolaire complète pour le système Genius Vente. Le module permet de gérer tous les aspects d'une institution éducative : classes, étudiants, enseignants, frais scolaires, paiements, sections et options académiques.

### 🎯 Fonctionnalités principales

- **Gestion des classes** : Création, modification et suivi des classes par année scolaire
- **Gestion des étudiants** : Inscription, transfert et suivi académique
- **Gestion des enseignants** : Assignation aux classes et gestion du personnel
- **Frais scolaires** : Configuration des frais par classe et périodicité
- **Paiements** : Enregistrement, suivi et statistiques des paiements
- **Structure académique** : Sections et options pour organiser le cursus

### 🔗 Informations de connexion

- **URL Locale** : `http://localhost:8000/api/v1`
- **URL Production** : `http://64.23.188.15:8000/api/v1`
- **Documentation Swagger** : `http://localhost:8000/api/v1/docs`

### 🔐 Authentification

Toutes les routes (sauf login/signup) nécessitent un token JWT dans le header :
```
Authorization: Bearer <votre_token>
```

### 📋 Table des matières

1. [Authentification](#authentification)
2. [Classes (Classrooms)](#classes-classrooms)
3. [Étudiants (Students)](#étudiants-students)
4. [Enseignants (Teachers)](#enseignants-teachers)
5. [Frais Scolaires (School Fees)](#frais-scolaires-school-fees)
6. [Paiements (Payments)](#paiements-payments)
7. [Filtres et Recherches Avancées](#filtres-et-recherches-avancées)
8. [Dashboard](#dashboard)
9. [Sections](#sections)
10. [Options](#options)
11. [Exemples de Flux Complets](#exemples-de-flux-complets)
12. [Codes d'Erreur](#codes-derreur)
13. [Notes Importantes](#notes-importantes)

---

## 🔐 Authentification

### 1. Connexion (Login)

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
  "message": "User login Successfully",
  "data": {
    "_id": "69b6d1480bf196c9697b54e5",
    "username": "Makelo Beto",
    "phone": "+243842613000",
    "role": "Admin",
    "companyId": {
      "_id": "69b6d1460bf196c9697b54e2",
      "name": "School Malolo",
      "currency": "United States Dollar",
      "signCurrency": "$",
      "lang": "fr",
      "country": "United States Dollar - USD",
      "category": {
        "_id": "68bb0e4a592180aafde59c0f",
        "name": "École",
        "nameEnglish": "School"
      },
      "createdAt": "2026-03-15T15:33:26.630Z",
      "updatedAt": "2026-03-15T15:33:26.630Z"
    },
    "isActived": true,
    "createdAt": "2026-03-15T15:33:28.076Z",
    "updatedAt": "2026-03-15T15:33:28.076Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFrZWxvIEJldG8iLCJyb2xlIjoiQWRtaW4iLCJwaG9uZSI6IisyNDM4NDI2MTMwMDAiLCJfaWQiOiI2OWI2ZDE0ODBiZjE5NmM5Njk3YjU0ZTUiLCJjb21wYW55SWQiOiI2OWI2ZDE0NjBiZjE5NmM5Njk3YjU0ZTIiLCJpYXQiOjE3NzM5NTAwMjZ9.5WOSXZRn46PbZ6NEyECuCRYiVS8FUeUiEcLgRBxz9Yg"
}
```

**Structure de la réponse:**
- `message`: Message de confirmation
- `data`: Objet contenant les informations de l'utilisateur
  - `_id`: ID de l'utilisateur
  - `username`: Nom d'utilisateur
  - `phone`: Numéro de téléphone
  - `role`: Rôle (Admin, User, etc.)
  - `companyId`: **Objet complet de l'entreprise** incluant:
    - `name`: Nom de l'école/entreprise
    - `currency`: Devise complète
    - `signCurrency`: Symbole de la devise
    - `category`: **Objet catégorie** avec nom en français et anglais
  - `isActived`: Statut actif de l'utilisateur
- `token`: Token JWT à utiliser pour les requêtes authentifiées

---

### 2. Inscription (Sign Up)

**POST** `/signup`

**Body:**
```json
{
  "username": "Directeur École",
  "phone": "+243826016607",
  "password": "1234",
  "companyId": "6734be089acec1931a6e0b41",
  "role": "Admin"
}
```

**Réponse (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "6734be089acec1931a6e0b40",
    "username": "Directeur École",
    "phone": "+243826016607",
    "role": "Admin",
    "companyId": "6734be089acec1931a6e0b41"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🏫 Classes (Classrooms)

### 1. Créer une classe

**POST** `/classrooms` 🔒

**Body:**
```json
{
  "name": "6ème Année A",
  "level": "Primaire",
  "capacity": 40,
  "schoolYear": "2025-2026",
  "sectionId": "6734be089acec1931a6e0b42",
  "optionId": "6734be089acec1931a6e0b43",
  "description": "Classe de 6ème année section scientifique"
}
```

**Champs:**
- `name` (requis): Nom de la classe
- `level` (requis): Niveau (Primaire, Secondaire, etc.)
- `capacity` (optionnel): Capacité maximale
- `schoolYear` (requis): Année scolaire (ex: 2025-2026)
- `sectionId` (optionnel): ID de la section
- `optionId` (optionnel): ID de l'option
- `description` (optionnel): Description

**Réponse (201):**
```json
{
  "message": "Classroom created successfully",
  "classroom": {
    "_id": "6734be089acec1931a6e0b44",
    "companyId": "6734be089acec1931a6e0b41",
    "name": "6ème Année A",
    "level": "Primaire",
    "capacity": 40,
    "schoolYear": "2025-2026",
    "sectionId": {
      "_id": "6734be089acec1931a6e0b42",
      "name": "Scientifique",
      "active": true,
      "companyId": "6734be089acec1931a6e0b41",
      "createdAt": "2026-03-19T18:00:00.000Z",
      "updatedAt": "2026-03-19T18:00:00.000Z"
    },
    "optionId": {
      "_id": "6734be089acec1931a6e0b43",
      "name": "Math-Physique",
      "code": "MP",
      "sectionId": "6734be089acec1931a6e0b42",
      "active": true,
      "companyId": "6734be089acec1931a6e0b41",
      "createdAt": "2026-03-19T18:00:00.000Z",
      "updatedAt": "2026-03-19T18:00:00.000Z"
    },
    "isActive": true,
    "createdAt": "2026-03-19T18:00:00.000Z"
  }
}
```

---

### 2. Lister toutes les classes

**GET** `/classrooms?page=1&limit=10&level=Primaire&schoolYear=2025-2026` 🔒

**Query Parameters:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 10 ou 20)
- `level` (optionnel): Filtrer par niveau (ex: Primaire, Secondaire)
- `schoolYear` (optionnel): Filtrer par année scolaire (ex: 2025-2026)
- `sectionId` (optionnel): Filtrer par ID de section
- `active` (optionnel): Filtrer par statut actif (true/false)
- `name` (optionnel): Rechercher par nom de classe

**Réponse (200):**
```json
{
  "classrooms": [
    {
      "_id": "69bc6a5b0bf196c9697b6ce3",
      "companyId": "69b6d1460bf196c9697b54e2",
      "name": "6ème Année A",
      "level": "Primaire",
      "schoolYear": "2025-2026",
      "capacity": 40,
      "active": true,
      "sectionId": {
        "_id": "69bc6a290bf196c9697b6cd2",
        "name": "Scientifique"
      },
      "optionId": {
        "_id": "69bc6a2a0bf196c9697b6cd4",
        "name": "Math-Physique"
      },
      "createdAt": "2026-03-19T21:27:55.079Z",
      "updatedAt": "2026-03-19T21:27:55.079Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

---

### 3. Récupérer une classe

**GET** `/classrooms/:id` 🔒

**Réponse (200):**
```json
{
  "classroom": {
    "_id": "...",
    "name": "6ème Année A",
    "level": "Primaire",
    "capacity": 40,
    "schoolYear": "2025-2026",
    "sectionId": {...},
    "optionId": {...},
    "students": [...],
    "isActive": true
  }
}
```

---

### 4. Mettre à jour une classe

**PUT** `/classrooms/:id` 🔒

**Body:**
```json
{
  "name": "6ème Année B",
  "capacity": 45
}
```

---

### 5. Supprimer une classe

**DELETE** `/classrooms/:id` 🔒

**Réponse (200):**
```json
{
  "message": "Classroom deleted successfully"
}
```

---

### 6. Activer/Désactiver une classe

**PATCH** `/classrooms/:id/toggle-active` 🔒

**Réponse (200):**
```json
{
  "message": "Classroom status updated",
  "classroom": {
    "_id": "...",
    "isActive": false
  }
}
```

## 💰 Frais Scolaires (School Fees)

### 1. Créer un frais scolaire

**POST** `/school-fees` 🔒

**Body:**
```json
{
  "label": "Minerval Mensuel",
  "periodicity": "mensuel",
  "schoolYear": "2025-2026",
  "currency": "CDF",
  "amount": 50000,
  "classroomIds": ["6734be089acec1931a6e0b44"],
  "active": true
}
```

**Champs:**
- `label` (requis): Libellé du frais (ex: Minerval Mensuel)
- `periodicity` (optionnel): Périodicité - `unique`, `mensuel`, ou `trimestriel` (défaut: mensuel)
- `schoolYear` (requis): Année scolaire (ex: 2025-2026)
- `currency` (optionnel): Devise (défaut: CDF)
- `amount` (requis): Montant fixe du frais
- `classroomIds` (requis): Tableau des IDs de classes concernées
- `active` (optionnel): Statut actif (défaut: true)

**Réponse (201):**
```json
{
  "message": "School fee created successfully",
  "schoolFee": {
    "_id": "6734be089acec1931a6e0b48",
    "companyId": "6734be089acec1931a6e0b41",
    "name": "Frais de scolarité",
    "amount": 100000,
    "type": "tuition",
    "schoolYear": "2025-2026",
    "dueDate": "2026-03-31T00:00:00.000Z",
    "classroomIds": [...],
    "isActive": true,
    "createdAt": "2026-03-19T18:00:00.000Z"
  }
}
```

---

### 2. Lister tous les frais scolaires

**GET** `/school-fees?page=1&limit=10&schoolYear=2025-2026&periodicity=mensuel` 🔒

**Query Parameters:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 10 ou 20)
- `schoolYear` (optionnel): Filtrer par année scolaire (ex: 2025-2026)
- `periodicity` (optionnel): Filtrer par périodicité (`unique`, `mensuel`, `trimestriel`)
- `classroomId` (optionnel): Filtrer par ID de classe
- `active` (optionnel): Filtrer par statut actif (true/false)
- `search` (optionnel): Rechercher par libellé

**Réponse (200):**
```json
{
  "schoolFees": [
    {
      "_id": "6734be089acec1931a6e0b48",
      "companyId": "69b6d1460bf196c9697b54e2",
      "label": "Minerval Mensuel",
      "periodicity": "mensuel",
      "schoolYear": "2025-2026",
      "currency": "CDF",
      "amount": 50000,
      "classroomIds": [
        {
          "_id": "69bc6a5b0bf196c9697b6ce3",
          "name": "6ème Année A"
        }
      ],
      "active": true,
      "createdAt": "2026-03-19T18:00:00.000Z",
      "updatedAt": "2026-03-19T18:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "pages": 1
  }
}
```

---

### 3. Récupérer un frais scolaire

**GET** `/school-fees/:id` 🔒

---

### 4. Mettre à jour un frais scolaire

**PUT** `/school-fees/:id` 🔒

---

### 5. Supprimer un frais scolaire

**DELETE** `/school-fees/:id` 🔒

## 👨‍🎓 Étudiants (Students)

### 1. Créer un étudiant

**POST** `/students` 🔒

**Body:**
```json
{
  "matricule": "ELV-2026-001",
  "firstName": "Jean",
  "lastName": "Dupont",
  "middleName": "Paul",
  "gender": "M",
  "birthDate": "2010-05-15",
  "classroomId": "6734be089acec1931a6e0b44",
  "schoolYear": "2025-2026",
  "tuteur": {
    "name": "Marie Dupont",
    "phone": "+243826016607"
  },
  "status": "actif"
}
```

**Champs:**
- `matricule` (requis): Matricule unique de l'élève (ex: ELV-2026-001)
- `firstName` (requis): Prénom de l'élève
- `lastName` (requis): Nom de famille de l'élève
- `middleName` (optionnel): Nom du milieu
- `gender` (requis): Genre - `M` (Masculin) ou `F` (Féminin)
- `birthDate` (optionnel): Date de naissance (YYYY-MM-DD)
- `classroomId` (requis): ID de la classe
- `schoolYear` (requis): Année scolaire (ex: 2025-2026)
- `tuteur` (optionnel): Objet contenant les informations du tuteur
  - `name`: Nom du tuteur
  - `phone`: Téléphone du tuteur
- `status` (optionnel): Statut - `actif`, `transfert`, ou `sorti` (défaut: actif)

**Réponse (201):**
```json
{
  "message": "Student created successfully",
  "student": {
    "_id": "6734be089acec1931a6e0b45",
    "companyId": "6734be089acec1931a6e0b41",
    "firstName": "Jean",
    "lastName": "Dupont",
    "dateOfBirth": "2010-05-15T00:00:00.000Z",
    "gender": "M",
    "classroomId": {...},
    "parentPhone": "+243826016607",
    "matricule": "STU-2026-001",
    "isActive": true,
    "createdAt": "2026-03-19T18:00:00.000Z"
  }
}
```

---

### 2. Lister tous les étudiants

**GET** `/students?page=1&limit=10&classroomId=...&search=Jean&gender=M` 🔒

**Query Parameters:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 10 ou 20)
- `classroomId` (optionnel): Filtrer par ID de classe
- `schoolYear` (optionnel): Filtrer par année scolaire
- `search` (optionnel): Rechercher par nom, prénom ou matricule
- `gender` (optionnel): Filtrer par genre (`M` ou `F`)
- `status` (optionnel): Filtrer par statut (`actif`, `transfert`, `sorti`)

**Réponse (200):**
```json
{
  "students": [
    {
      "_id": "6734be089acec1931a6e0b45",
      "companyId": "69b6d1460bf196c9697b54e2",
      "matricule": "ELV-2026-001",
      "firstName": "Jean",
      "lastName": "Dupont",
      "middleName": "Paul",
      "gender": "M",
      "birthDate": "2010-05-15T00:00:00.000Z",
      "classroomId": {
        "_id": "69bc6a5b0bf196c9697b6ce3",
        "name": "6ème Année A",
        "level": "Primaire"
      },
      "schoolYear": "2025-2026",
      "tuteur": {
        "name": "Marie Dupont",
        "phone": "+243826016607"
      },
      "status": "actif",
      "createdAt": "2026-03-19T18:00:00.000Z",
      "updatedAt": "2026-03-19T18:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

### 3. Récupérer un étudiant

**GET** `/students/:id` 🔒

**Réponse (200):**
```json
{
  "student": {
    "_id": "...",
    "firstName": "Jean",
    "lastName": "Dupont",
    "dateOfBirth": "2010-05-15T00:00:00.000Z",
    "age": 15,
    "gender": "M",
    "classroomId": {...},
    "parentName": "Marie Dupont",
    "parentPhone": "+243826016607",
    "payments": [...],
    "totalPaid": 500000,
    "totalDue": 100000
  }
}
```

---

### 4. Mettre à jour un étudiant

**PUT** `/students/:id` 🔒

**Body (tous les champs optionnels):**
```json
{
  "matricule": "ELV-2026-001",
  "lastName": "Dupont",
  "middleName": "Pierre",
  "firstName": "Jean",
  "gender": "M",
  "birthDate": "2010-05-15",
  "tuteur": {
    "name": "Marie Dupont",
    "phone": "+243826016607"
  },
  "classroomId": "69bc6a5b0bf196c9697b6ce3",
  "schoolYear": "2025-2026",
  "status": "actif"
}
```

**Réponse (200):**
```json
{
  "message": "Élève mis à jour avec succès",
  "student": {
    "_id": "6734be089acec1931a6e0b45",
    "matricule": "ELV-2026-001",
    "lastName": "Dupont",
    "firstName": "Jean",
    "gender": "M",
    "classroomId": {
      "_id": "69bc6a5b0bf196c9697b6ce3",
      "name": "6ème Année A"
    },
    "status": "actif",
    "updatedAt": "2026-03-19T23:00:00.000Z"
  }
}
```

---

### 5. Supprimer un étudiant

**DELETE** `/students/:id` 🔒

**Réponse (200):**
```json
{
  "message": "Élève supprimé avec succès",
  "deletedStudent": {
    "_id": "6734be089acec1931a6e0b45",
    "matricule": "ELV-2026-001",
    "firstName": "Jean",
    "lastName": "Dupont"
  }
}
```

**Réponse (404):**
```json
{
  "message": "Élève non trouvé ou ne vous appartient pas"
}
```

**Note importante:** La suppression est définitive. Assurez-vous que l'étudiant n'a pas de paiements associés avant de le supprimer, sinon cela pourrait causer des incohérences dans les données.

---

### 6. Transférer un étudiant de classe

**PATCH** `/students/:id/transfer` 🔒

**Body:**
```json
{
  "newClassroomId": "6734be089acec1931a6e0b46"
}
```

## 👨‍🏫 Enseignants (Teachers)

### 1. Créer un enseignant

**POST** `/teachers` 🔒

**Body:**
```json
{
  "code": "PROF-0001",
  "firstName": "Marie",
  "lastName": "Dubois",
  "phone": "+243826016607",
  "email": "marie@example.com",
  "classes": ["6734be089acec1931a6e0b44"],
  "active": true
}
```

**Champs:**
- `code` (optionnel): Code unique du professeur (ex: PROF-0001)
- `firstName` (optionnel): Prénom du professeur
- `lastName` (requis): Nom de famille du professeur
- `phone` (optionnel): Numéro de téléphone
- `email` (optionnel): Adresse email
- `classes` (optionnel): Tableau des IDs de classes assignées
- `active` (optionnel): Statut actif (défaut: true)

**Réponse (201):**
```json
{
  "message": "Teacher created successfully",
  "teacher": {
    "_id": "6734be089acec1931a6e0b47",
    "companyId": "6734be089acec1931a6e0b41",
    "firstName": "Marie",
    "lastName": "Dubois",
    "phone": "+243826016607",
    "email": "marie@example.com",
    "subject": "Mathématiques",
    "hireDate": "2020-09-01T00:00:00.000Z",
    "isActive": true,
    "createdAt": "2026-03-19T18:00:00.000Z"
  }
}
```

---

### 2. Lister tous les enseignants

**GET** `/teachers?page=1&limit=10&search=Marie&active=true` 🔒

**Query Parameters:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 10 ou 20)
- `search` (optionnel): Rechercher par nom, prénom ou code
- `active` (optionnel): Filtrer par statut actif (true/false)
- `classroomId` (optionnel): Filtrer par classe assignée

**Réponse (200):**
```json
{
  "teachers": [
    {
      "_id": "69bc6a2f0bf196c9697b6cdb",
      "companyId": "69b6d1460bf196c9697b54e2",
      "code": "PROF-0001",
      "firstName": "Marie",
      "lastName": "Dubois",
      "phone": "+243826016607",
      "email": "marie@example.com",
      "classes": [
        {
          "_id": "69bc6a5b0bf196c9697b6ce3",
          "name": "6ème Année A"
        }
      ],
      "active": true,
      "createdAt": "2026-03-19T21:27:43.123Z",
      "updatedAt": "2026-03-19T21:27:43.123Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "pages": 1
  }
}
```

---

### 3. Récupérer un enseignant

**GET** `/teachers/:id` 🔒

---

### 4. Mettre à jour un enseignant

**PUT** `/teachers/:id` 🔒

---

### 5. Supprimer un enseignant

**DELETE** `/teachers/:id` 🔒

## 💳 Paiements (Payments)

**Note importante:** Les endpoints de paiements nécessitent généralement un `schoolFeeId` (ID du frais scolaire) pour fonctionner correctement.

### 1. Créer un paiement

**POST** `/payments` 🔒

**Body:**
```json
{
  "studentId": "6734be089acec1931a6e0b45",
  "schoolFeeId": "6734be089acec1931a6e0b48",
  "amount": 50000,
  "paymentDate": "2026-03-19",
  "paymentMethod": "cash",
  "reference": "PAY-2026-001",
  "notes": "Paiement partiel",
  "status": "completed",
  "recordedBy": "6734c09edeeea05c7b02a992"
}
```

**Champs:**
- `studentId` (requis): ID de l'élève
- `schoolFeeId` (requis): ID du frais scolaire
- `amount` (requis): Montant payé (minimum: 0)
- `paymentDate` (requis): Date du paiement (YYYY-MM-DD)
- `paymentMethod` (optionnel): Méthode - `cash`, `bank_transfer`, `mobile_money`, ou `check` (défaut: cash)
- `reference` (optionnel): Référence du paiement (numéro de transaction, chèque, etc.)
- `notes` (optionnel): Notes additionnelles
- `status` (optionnel): Statut - `completed`, `partial`, ou `pending` (défaut: completed)
- `recordedBy` (optionnel): ID de l'utilisateur qui enregistre le paiement

**Réponse (201):**
```json
{
  "message": "Payment created successfully",
  "payment": {
    "_id": "6734be089acec1931a6e0b49",
    "companyId": "69b6d1460bf196c9697b54e2",
    "studentId": {
      "_id": "6734be089acec1931a6e0b45",
      "matricule": "ELV-2026-001",
      "firstName": "Jean",
      "lastName": "Dupont",
      "classroomId": {
        "_id": "69bc6a5b0bf196c9697b6ce3",
        "name": "6ème Année A"
      }
    },
    "schoolFeeId": {
      "_id": "6734be089acec1931a6e0b48",
      "label": "Minerval Mensuel",
      "amount": 50000,
      "periodicity": "mensuel",
      "schoolYear": "2025-2026"
    },
    "amount": 50000,
    "paymentMethod": "cash",
    "paymentDate": "2026-03-19T00:00:00.000Z",
    "reference": "PAY-2026-001",
    "notes": "Paiement partiel",
    "status": "completed",
    "recordedBy": {
      "_id": "6734c09edeeea05c7b02a992",
      "username": "Admin"
    },
    "createdAt": "2026-03-19T18:00:00.000Z",
    "updatedAt": "2026-03-19T18:00:00.000Z"
  }
}
```

**Méthodes de paiement disponibles:**
- `cash`: Espèces (paiement en liquide)
- `bank_transfer`: Virement bancaire
- `mobile_money`: Mobile Money (M-Pesa, Orange Money, Airtel Money, etc.)
- `check`: Chèque bancaire

**Statuts de paiement:**
- `completed`: Paiement complet (montant total payé)
- `partial`: Paiement partiel (montant inférieur au frais)
- `pending`: Paiement en attente (non confirmé)

**Notes importantes:**
- Le montant peut être inférieur au montant du frais (paiement partiel)
- La référence est utile pour tracer les transactions (numéro de chèque, ID transaction mobile money)
- Le champ `recordedBy` enregistre automatiquement l'utilisateur connecté
- Les paiements sont liés à un étudiant ET à un frais scolaire spécifique

---

### 2. Historique des paiements d'un étudiant

**GET** `/payments/student/:studentId` 🔒

**Query Parameters:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 20)
- `schoolFeeId` (optionnel): Filtrer par frais scolaire
- `startDate` (optionnel): Date de début (YYYY-MM-DD)
- `endDate` (optionnel): Date de fin (YYYY-MM-DD)

**Réponse (200):**
```json
{
  "student": {
    "_id": "6734be089acec1931a6e0b45",
    "matricule": "ELV-2026-001",
    "firstName": "Jean",
    "lastName": "Dupont",
    "classroomId": {
      "name": "6ème Année A"
    }
  },
  "payments": [
    {
      "_id": "6734be089acec1931a6e0b49",
      "amount": 50000,
      "paymentDate": "2026-03-19T00:00:00.000Z",
      "paymentMethod": "cash",
      "reference": "PAY-2026-001",
      "status": "completed",
      "schoolFeeId": {
        "label": "Minerval Mensuel",
        "amount": 50000
      },
      "createdAt": "2026-03-19T18:00:00.000Z"
    }
  ],
  "summary": {
    "totalPaid": 150000,
    "paymentCount": 3
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "pages": 1
  }
}
```

---

### 3. Statut de paiement d'un étudiant pour un frais

**GET** `/payments/status/:studentId/:schoolFeeId` 🔒

**Description:** Récupère le statut de paiement d'un élève pour un frais scolaire spécifique.

**Réponse (200):**
```json
{
  "student": {
    "_id": "6734be089acec1931a6e0b45",
    "matricule": "ELV-2026-001",
    "lastName": "Dupont",
    "firstName": "Jean"
  },
  "schoolFee": {
    "_id": "6734be089acec1931a6e0b48",
    "label": "Minerval Mensuel",
    "fixedAmount": 50000,
    "currency": "CDF",
    "periodicity": "mensuel"
  },
  "paymentStatus": {
    "status": "completed",
    "totalPaid": 50000,
    "remainingAmount": 0,
    "isFullyPaid": true,
    "progressPercentage": 100
  },
  "payments": [
    {
      "_id": "6734be089acec1931a6e0b49",
      "amount": 50000,
      "paymentDate": "2026-03-19T00:00:00.000Z",
      "paymentMethod": "cash",
      "reference": "PAY-2026-001"
    }
  ]
}
```

---

### 4. Paiements d'une classe pour un frais

**GET** `/payments/classroom/:classroomId/:schoolFeeId` 🔒

**Description:** Récupère tous les paiements des étudiants d'une classe pour un frais scolaire spécifique.

**Query Parameters:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 20)
- `status` (optionnel): Filtrer par statut (`completed`, `partial`, `pending`)

**Réponse (200):**
```json
{
  "classroom": {
    "_id": "69bc6a5b0bf196c9697b6ce3",
    "name": "6ème Année A",
    "level": "Primaire"
  },
  "schoolFee": {
    "_id": "6734be089acec1931a6e0b48",
    "label": "Minerval Mensuel",
    "fixedAmount": 50000,
    "currency": "CDF"
  },
  "students": [
    {
      "_id": "6734be089acec1931a6e0b45",
      "matricule": "ELV-2026-001",
      "lastName": "Dupont",
      "firstName": "Jean",
      "paymentStatus": {
        "status": "completed",
        "totalPaid": 50000,
        "remainingAmount": 0,
        "isFullyPaid": true,
        "progressPercentage": 100
      },
      "payments": [
        {
          "_id": "6734be089acec1931a6e0b49",
          "amount": 50000,
          "paymentDate": "2026-03-19T00:00:00.000Z",
          "paymentMethod": "cash"
        }
      ]
    }
  ],
  "summary": {
    "totalStudents": 40,
    "completedPayments": 35,
    "partialPayments": 3,
    "pendingPayments": 2
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 40,
    "pages": 2
  }
}
```

---

### 5. Élèves ayant payé un frais dans une classe

**GET** `/payments/paid-students/:classroomId/:schoolFeeId` 🔒

**Description:** Récupère tous les élèves qui ont payé (complètement ou partiellement) un frais spécifique dans une classe.

**Query Parameters:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 20)

**Réponse (200):**
```json
{
  "classroom": {
    "_id": "69bc6a5b0bf196c9697b6ce3",
    "name": "6ème Année A",
    "level": "Primaire"
  },
  "schoolFee": {
    "_id": "6734be089acec1931a6e0b48",
    "label": "Minerval Mensuel",
    "fixedAmount": 50000,
    "currency": "CDF"
  },
  "paidStudents": [
    {
      "_id": "6734be089acec1931a6e0b45",
      "matricule": "ELV-2026-001",
      "lastName": "Dupont",
      "firstName": "Jean",
      "paymentInfo": {
        "totalPaid": 50000,
        "paymentCount": 1,
        "isFullyPaid": true,
        "lastPaymentDate": "2026-03-19T00:00:00.000Z",
        "firstPaymentDate": "2026-03-19T00:00:00.000Z"
      },
      "payments": [
        {
          "_id": "6734be089acec1931a6e0b49",
          "amount": 50000,
          "paymentDate": "2026-03-19T00:00:00.000Z",
          "paymentMethod": "cash"
        }
      ]
    }
  ],
  "summary": {
    "totalStudentsInClass": 40,
    "paidStudentsCount": 35,
    "unpaidStudentsCount": 5,
    "fullyPaidCount": 30,
    "totalAmountCollected": 1750000
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 35,
    "pages": 2
  }
}
```

---

### 6. Paiements récents

**GET** `/payments/recent` 🔒

**Description:** Récupère les paiements les plus récents de l'entreprise.

**Query Parameters:**
- `limit` (optionnel): Nombre de paiements (défaut: 10)
- `page` (optionnel): Numéro de page (défaut: 1)

**Réponse (200):**
```json
{
  "payments": [
    {
      "_id": "6734be089acec1931a6e0b49",
      "amount": 50000,
      "paymentDate": "2026-03-19T00:00:00.000Z",
      "paymentMethod": "cash",
      "status": "completed",
      "reference": "PAY-2026-001",
      "studentId": {
        "_id": "6734be089acec1931a6e0b45",
        "matricule": "ELV-2026-001",
        "lastName": "Dupont",
        "firstName": "Jean",
        "classroomId": {
          "name": "6ème Année A"
        }
      },
      "schoolFeeId": {
        "_id": "6734be089acec1931a6e0b48",
        "label": "Minerval Mensuel",
        "currency": "CDF",
        "fixedAmount": 50000
      },
      "recordedBy": {
        "_id": "6734c09edeeea05c7b02a992",
        "username": "Admin"
      },
      "createdAt": "2026-03-19T18:00:00.000Z"
    }
  ],
  "summary": {
    "totalPayments": 450,
    "recentPaymentsCount": 10,
    "totalAmountCollected": 500000,
    "averageAmount": 50000,
    "paymentMethodsBreakdown": {
      "cash": 6,
      "mobile_money": 3,
      "bank_transfer": 1
    }
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 450,
    "pages": 45
  }
}
```

---

### 7. Élèves ayant complètement payé un frais

**GET** `/payments/fully-paid/:schoolFeeId` 🔒

**Description:** Récupère les élèves qui ont complètement payé un frais scolaire spécifique.

**Query Parameters:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 20)
- `classroomId` (optionnel): Filtrer par classe

**Réponse (200):**
```json
{
  "schoolFee": {
    "_id": "6734be089acec1931a6e0b48",
    "label": "Minerval Mensuel",
    "fixedAmount": 50000,
    "currency": "CDF",
    "periodicity": "mensuel"
  },
  "students": [
    {
      "_id": "6734be089acec1931a6e0b45",
      "matricule": "ELV-2026-001",
      "lastName": "Dupont",
      "firstName": "Jean",
      "classroomId": {
        "_id": "69bc6a5b0bf196c9697b6ce3",
        "name": "6ème Année A",
        "level": "Primaire"
      },
      "paymentInfo": {
        "totalPaid": 50000,
        "requiredAmount": 50000,
        "excessAmount": 0,
        "paymentCount": 1,
        "lastPaymentDate": "2026-03-19T00:00:00.000Z"
      }
    }
  ],
  "summary": {
    "totalStudents": 150,
    "fullyPaidStudents": 120,
    "completionRate": 80
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "pages": 6
  }
}
```

---

### 8. Élèves ayant payé plus qu'un montant

**GET** `/payments/above-amount/:schoolFeeId?minAmount=X` 🔒

**Description:** Récupère les élèves ayant payé plus qu'un montant spécifié.

**Query Parameters:**
- `minAmount` (requis): Montant minimum payé
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 20)
- `classroomId` (optionnel): Filtrer par classe

**Réponse (200):**
```json
{
  "schoolFee": {
    "_id": "6734be089acec1931a6e0b48",
    "label": "Minerval Mensuel",
    "fixedAmount": 50000,
    "currency": "CDF"
  },
  "filterCriteria": {
    "minAmount": 30000,
    "classroomId": null
  },
  "students": [
    {
      "_id": "6734be089acec1931a6e0b45",
      "matricule": "ELV-2026-001",
      "lastName": "Dupont",
      "firstName": "Jean",
      "classroomId": {
        "name": "6ème Année A"
      },
      "paymentInfo": {
        "totalPaid": 50000,
        "requiredAmount": 50000,
        "minAmountRequested": 30000,
        "excessAmount": 0,
        "amountAboveMinimum": 20000,
        "paymentCount": 1,
        "isFullyPaid": true,
        "lastPaymentDate": "2026-03-19T00:00:00.000Z"
      }
    }
  ],
  "summary": {
    "totalStudents": 150,
    "studentsPaidAboveAmount": 95,
    "fullyPaidStudents": 80,
    "averageAmountPaid": 42000
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 95,
    "pages": 5
  }
}
```

---

### 9. Élèves n'ayant pas payé un frais

**GET** `/payments/unpaid/:schoolFeeId` 🔒

**Description:** Récupère les élèves qui n'ont pas payé (ou pas complètement) un frais spécifique.

**Query Parameters:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 20)
- `classroomId` (optionnel): Filtrer par classe

**Réponse (200):**
```json
{
  "schoolFee": {
    "_id": "6734be089acec1931a6e0b48",
    "label": "Minerval Mensuel",
    "amount": 50000,
    "currency": "CDF",
    "periodicity": "mensuel"
  },
  "filterCriteria": {
    "classroomId": null
  },
  "students": [
    {
      "_id": "6734be089acec1931a6e0b46",
      "matricule": "ELV-2026-002",
      "lastName": "Martin",
      "firstName": "Sophie",
      "classroomId": {
        "_id": "69bc6a5b0bf196c9697b6ce3",
        "name": "6ème Année A",
        "level": "Primaire"
      },
      "paymentInfo": {
        "totalPaid": 25000,
        "requiredAmount": 50000,
        "remainingAmount": 25000,
        "paymentCount": 1,
        "isFullyPaid": false,
        "paymentStatus": "partial",
        "progressPercentage": 50,
        "lastPaymentDate": "2026-03-10T00:00:00.000Z"
      }
    }
  ],
  "summary": {
    "totalStudents": 150,
    "unpaidStudents": 30,
    "fullyPaidStudents": 120,
    "totalUnpaidAmount": 1500000,
    "averageUnpaidAmount": 50000
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 30,
    "pages": 2
  }
}
```

---

### 10. Statistiques globales de paiements

**GET** `/payments/statistics?period=current` 🔒

**Description:** Récupère les statistiques globales de l'entreprise pour les paiements.

**Query Parameters:**
- `period` (optionnel): Période (`current`, `lastMonth`, `lastYear`) - défaut: current

**Réponse (200):**
```json
{
  "period": {
    "type": "current",
    "startDate": "2026-03-01T00:00:00.000Z",
    "endDate": "2026-03-31T23:59:59.999Z",
    "label": "Mars 2026"
  },
  "statistics": {
    "totalStudents": 450,
    "totalClassrooms": 15,
    "totalActiveSchoolFees": 8,
    "monthlyPayments": {
      "count": 380,
      "totalAmount": 19000000,
      "amountsByCurrency": {
        "CDF": 15000000,
        "USD": 4000000
      },
      "averageAmount": 50000
    },
    "paymentRate": {
      "global": 84,
      "totalStudentsWithPayments": 380,
      "totalStudentsWithoutPayments": 70,
      "totalRequiredAmount": 22500000,
      "totalPaidAmount": 19000000,
      "completionPercentage": 84
    },
    "paymentMethods": {
      "cash": 250,
      "mobile_money": 100,
      "bank_transfer": 25,
      "check": 5
    },
    "schoolFeesBreakdown": [
      {
        "schoolFeeId": "6734be089acec1931a6e0b48",
        "label": "Minerval Mensuel",
        "amount": 50000,
        "currency": "CDF",
        "totalStudents": 450,
        "studentsWithPayments": 380,
        "studentsWithoutPayments": 70,
        "totalPaid": 19000000,
        "totalRequired": 22500000,
        "paymentRate": 84
      }
    ],
    "classroomsBreakdown": [
      {
        "classroomId": "69bc6a5b0bf196c9697b6ce3",
        "name": "6ème Année A",
        "level": "Primaire",
        "totalStudents": 40,
        "monthlyPayments": 35,
        "monthlyAmount": 1750000
      }
    ]
  }
}
```

---

### 💡 Cas d'usage courants

#### 1. Enregistrer un paiement complet
```bash
POST /api/v1/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "6734be089acec1931a6e0b45",
  "schoolFeeId": "6734be089acec1931a6e0b48",
  "amount": 50000,
  "paymentMethod": "cash",
  "paymentDate": "2026-03-19"
}
```

#### 2. Enregistrer un paiement partiel avec Mobile Money
```bash
POST /api/v1/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "6734be089acec1931a6e0b45",
  "schoolFeeId": "6734be089acec1931a6e0b48",
  "amount": 25000,
  "paymentMethod": "mobile_money",
  "paymentDate": "2026-03-19",
  "reference": "MM-123456789",
  "notes": "Orange Money - Première tranche"
}
```

#### 3. Vérifier l'historique des paiements d'un étudiant
```bash
GET /api/v1/payments/student/6734be089acec1931a6e0b45?page=1&limit=20
Authorization: Bearer <token>
```

#### 4. Vérifier le statut de paiement pour un frais spécifique
```bash
GET /api/v1/payments/status/6734be089acec1931a6e0b45/6734be089acec1931a6e0b48
Authorization: Bearer <token>
```

#### 5. Voir les paiements d'une classe pour un frais
```bash
GET /api/v1/payments/classroom/69bc6a5b0bf196c9697b6ce3/6734be089acec1931a6e0b48
Authorization: Bearer <token>
```

#### 6. Lister les élèves n'ayant pas payé
```bash
GET /api/v1/payments/unpaid/6734be089acec1931a6e0b48?classroomId=69bc6a5b0bf196c9697b6ce3
Authorization: Bearer <token>
```

#### 7. Voir les statistiques globales
```bash
GET /api/v1/payments/statistics?period=current
Authorization: Bearer <token>
```

#### 8. Voir les paiements récents
```bash
GET /api/v1/payments/recent?limit=20
Authorization: Bearer <token>
```

---

## 🔍 Filtres et Recherches Avancées

Cette section regroupe tous les endpoints de filtrage et de recherche pour faciliter l'accès aux données spécifiques.

### 📊 Filtres de Paiements

#### 1. Élèves ayant complètement payé un frais

**GET** `/payments/fully-paid/:schoolFeeId` 🔒

**Description:** Récupère uniquement les élèves qui ont payé **la totalité** d'un frais scolaire spécifique.

**Query Parameters:**
- `classroomId` (optionnel): Filtrer par classe
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Éléments par page (défaut: 20)

**Exemple:**
```bash
# Tous les élèves ayant complètement payé le frais informatique
GET /api/v1/payments/fully-paid/69bc6e2a0bf196c9697b6db3

# Filtrer par classe
GET /api/v1/payments/fully-paid/69bc6e2a0bf196c9697b6db3?classroomId=69bc6a5b0bf196c9697b6ce3
```

**Réponse:**
```json
{
  "schoolFee": {
    "label": "Frais informatique",
    "amount": 10000,
    "currency": "CDF"
  },
  "students": [
    {
      "matricule": "ELV-2026-001",
      "firstName": "Jean",
      "lastName": "Dupont",
      "paymentInfo": {
        "totalPaid": 10000,
        "requiredAmount": 10000,
        "excessAmount": 0,
        "paymentCount": 2
      }
    }
  ],
  "summary": {
    "totalStudents": 40,
    "fullyPaidStudents": 35,
    "completionRate": 88
  }
}
```

---

#### 2. Élèves n'ayant pas payé (ou pas complètement)

**GET** `/payments/unpaid/:schoolFeeId` 🔒

**Description:** Récupère les élèves qui n'ont **pas payé** ou **pas complètement payé** un frais.

**Query Parameters:**
- `classroomId` (optionnel): Filtrer par classe
- `page` (optionnel): Numéro de page
- `limit` (optionnel): Éléments par page

**Exemple:**
```bash
# Tous les élèves n'ayant pas payé
GET /api/v1/payments/unpaid/69bc6e2a0bf196c9697b6db3

# Filtrer par classe
GET /api/v1/payments/unpaid/69bc6e2a0bf196c9697b6db3?classroomId=69bc6a5b0bf196c9697b6ce3
```

**Réponse:**
```json
{
  "students": [
    {
      "matricule": "ELV-2026-002",
      "firstName": "Sophie",
      "lastName": "Martin",
      "paymentInfo": {
        "totalPaid": 5000,
        "requiredAmount": 10000,
        "remainingAmount": 5000,
        "paymentStatus": "partial",
        "progressPercentage": 50
      }
    }
  ],
  "summary": {
    "totalStudents": 40,
    "unpaidStudents": 5,
    "fullyPaidStudents": 35,
    "totalUnpaidAmount": 25000
  }
}
```

---

#### 3. Élèves ayant payé plus qu'un montant

**GET** `/payments/above-amount/:schoolFeeId?minAmount=X` 🔒

**Description:** Récupère les élèves ayant payé **au moins** un montant spécifié.

**Query Parameters:**
- `minAmount` (requis): Montant minimum payé
- `classroomId` (optionnel): Filtrer par classe
- `page` (optionnel): Numéro de page
- `limit` (optionnel): Éléments par page

**Exemple:**
```bash
# Élèves ayant payé au moins 5000 FC
GET /api/v1/payments/above-amount/69bc6e2a0bf196c9697b6db3?minAmount=5000

# Avec filtre par classe
GET /api/v1/payments/above-amount/69bc6e2a0bf196c9697b6db3?minAmount=5000&classroomId=69bc6a5b0bf196c9697b6ce3
```

**Réponse:**
```json
{
  "filterCriteria": {
    "minAmount": 5000
  },
  "students": [
    {
      "matricule": "ELV-2026-001",
      "firstName": "Jean",
      "paymentInfo": {
        "totalPaid": 10000,
        "amountAboveMinimum": 5000,
        "isFullyPaid": true
      }
    }
  ],
  "summary": {
    "studentsPaidAboveAmount": 30,
    "averageAmountPaid": 8500
  }
}
```

---

#### 4. Élèves ayant payé dans une classe pour un frais

**GET** `/payments/paid-students/:classroomId/:schoolFeeId` 🔒

**Description:** Récupère tous les élèves d'une classe qui ont effectué **au moins un paiement** pour un frais.

**Exemple:**
```bash
GET /api/v1/payments/paid-students/69bc6a5b0bf196c9697b6ce3/69bc6e2a0bf196c9697b6db3
```

---

#### 5. Paiements d'une classe pour un frais

**GET** `/payments/classroom/:classroomId/:schoolFeeId` 🔒

**Description:** Vue d'ensemble des paiements de tous les étudiants d'une classe pour un frais spécifique.

**Query Parameters:**
- `status` (optionnel): Filtrer par statut (`completed`, `partial`, `pending`)
- `page` (optionnel): Numéro de page
- `limit` (optionnel): Éléments par page

**Exemple:**
```bash
# Tous les paiements
GET /api/v1/payments/classroom/69bc6a5b0bf196c9697b6ce3/69bc6e2a0bf196c9697b6db3

# Seulement les paiements partiels
GET /api/v1/payments/classroom/69bc6a5b0bf196c9697b6ce3/69bc6e2a0bf196c9697b6db3?status=partial
```

---

### 👨‍🎓 Filtres d'Étudiants

#### 1. Recherche textuelle d'étudiants

**GET** `/students?q=recherche` 🔒

**Query Parameters:**
- `q`: Terme de recherche (nom, prénom, matricule)
- `classroomId`: Filtrer par classe
- `schoolYear`: Filtrer par année scolaire
- `status`: Filtrer par statut (`actif`, `transfert`, `sorti`)
- `page`: Numéro de page
- `limit`: Éléments par page

**Exemple:**
```bash
# Rechercher "jojo"
GET /api/v1/students?q=jojo

# Rechercher dans une classe spécifique
GET /api/v1/students?q=jojo&classroomId=69bc6a5b0bf196c9697b6ce3

# Filtrer par statut
GET /api/v1/students?status=actif

# Filtrer par année scolaire
GET /api/v1/students?schoolYear=2025-2026
```

---

#### 2. Étudiants d'une classe

**GET** `/students/classroom/:classroomId` 🔒

**Query Parameters:**
- `status`: Filtrer par statut
- `q`: Recherche textuelle
- `page`: Numéro de page
- `limit`: Éléments par page

**Exemple:**
```bash
# Tous les étudiants actifs d'une classe
GET /api/v1/students/classroom/69bc6a5b0bf196c9697b6ce3?status=actif

# Rechercher dans la classe
GET /api/v1/students/classroom/69bc6a5b0bf196c9697b6ce3?q=jean
```

---

### 🏫 Filtres de Classes

**GET** `/classrooms?filters` 🔒

**Query Parameters:**
- `schoolYear`: Filtrer par année scolaire
- `level`: Filtrer par niveau (`Primaire`, `Secondaire`)
- `sectionId`: Filtrer par section
- `optionId`: Filtrer par option
- `active`: Filtrer par statut (`true`, `false`)
- `page`: Numéro de page
- `limit`: Éléments par page

**Exemple:**
```bash
# Classes de l'année 2025-2026
GET /api/v1/classrooms?schoolYear=2025-2026

# Classes actives du niveau Primaire
GET /api/v1/classrooms?level=Primaire&active=true

# Classes d'une section
GET /api/v1/classrooms?sectionId=SECTION_ID
```

---

### 💰 Filtres de Frais Scolaires

**GET** `/school-fees?filters` 🔒

**Query Parameters:**
- `schoolYear`: Filtrer par année scolaire
- `periodicity`: Filtrer par périodicité (`unique`, `mensuel`, `trimestriel`)
- `active`: Filtrer par statut (`true`, `false`)
- `classroomId`: Filtrer par classe
- `page`: Numéro de page
- `limit`: Éléments par page

**Exemple:**
```bash
# Frais de l'année en cours
GET /api/v1/school-fees?schoolYear=2025-2026

# Frais mensuels actifs
GET /api/v1/school-fees?periodicity=mensuel&active=true

# Frais d'une classe
GET /api/v1/school-fees?classroomId=69bc6a5b0bf196c9697b6ce3
```

---

### 📈 Statistiques et Rapports

#### 1. Statistiques globales de paiements

**GET** `/payments/statistics?period=current` 🔒

**Query Parameters:**
- `period`: Période (`current`, `lastMonth`, `lastYear`)

**Exemple:**
```bash
# Statistiques du mois en cours
GET /api/v1/payments/statistics?period=current

# Statistiques du mois dernier
GET /api/v1/payments/statistics?period=lastMonth
```

---

#### 2. Paiements récents

**GET** `/payments/recent?limit=20` 🔒

**Query Parameters:**
- `limit`: Nombre de paiements (défaut: 10)
- `page`: Numéro de page

**Exemple:**
```bash
# 50 derniers paiements
GET /api/v1/payments/recent?limit=50
```

---

#### 3. Statut de paiement d'un étudiant

**GET** `/payments/status/:studentId/:schoolFeeId` 🔒

**Description:** Vérifier si un étudiant a complètement payé un frais spécifique.

**Exemple:**
```bash
GET /api/v1/payments/status/69bc6ddc0bf196c9697b6d97/69bc6e2a0bf196c9697b6db3
```

**Réponse:**
```json
{
  "student": {
    "matricule": "ELV-457302",
    "firstName": "jojo"
  },
  "schoolFee": {
    "label": "Frais informatique",
    "amount": 10000
  },
  "paymentStatus": {
    "status": "partial",
    "totalPaid": 6000,
    "remainingAmount": 4000,
    "isFullyPaid": false,
    "progressPercentage": 60
  },
  "payments": [
    {
      "amount": 5000,
      "paymentDate": "2026-03-19"
    },
    {
      "amount": 1000,
      "paymentDate": "2026-03-19"
    }
  ]
}
```

---

### 💡 Conseils d'utilisation des filtres

**Combiner plusieurs filtres:**
```bash
# Étudiants actifs de 6ème année en 2025-2026
GET /api/v1/students?status=actif&schoolYear=2025-2026&q=6ème

# Paiements partiels d'une classe pour un frais
GET /api/v1/payments/classroom/CLASS_ID/FEE_ID?status=partial
```

**Pagination:**
```bash
# Page 2 avec 50 éléments
GET /api/v1/students?page=2&limit=50
```

**Recherche insensible à la casse:**
- Les recherches textuelles (`q`) sont insensibles à la casse
- Exemple: `q=jojo` trouvera "Jojo", "JOJO", "jojo"

---

## � Dashboard

### Tableau de bord scolaire

**GET** `/dashboard/school` 🔒

**Description:** Récupère toutes les statistiques importantes pour le tableau de bord de l'école en une seule requête.

**Query Parameters:**
- `schoolYear` (optionnel): Année scolaire (défaut: année en cours)

**Exemple:**
```bash
GET /api/v1/dashboard/school
Authorization: Bearer <token>

# Avec année scolaire spécifique
GET /api/v1/dashboard/school?schoolYear=2025-2026
Authorization: Bearer <token>
```

**Réponse (200):**
```json
{
  "overview": {
    "totalStudents": 245,
    "totalClassrooms": 12,
    "totalTeachers": 18,
    "totalSchoolFees": 8,
    "paymentsThisMonth": 156,
    "totalAmountThisMonth": 7850000,
    "collectionRate": 78
  },
  "students": {
    "total": 245,
    "byGender": [
      { "gender": "M", "count": 130 },
      { "gender": "F", "count": 115 }
    ]
  },
  "classrooms": {
    "total": 12,
    "byLevel": [
      { "level": "Primaire", "count": 6 },
      { "level": "Secondaire", "count": 6 }
    ],
    "topClassrooms": [
      {
        "name": "6ème Année A",
        "code": "6A",
        "level": "Primaire",
        "studentCount": 35
      },
      {
        "name": "5ème Année B",
        "code": "5B",
        "level": "Primaire",
        "studentCount": 32
      }
    ]
  },
  "teachers": {
    "total": 18
  },
  "schoolFees": {
    "total": 8,
    "byPeriodicity": [
      { "periodicity": "mensuel", "count": 5 },
      { "periodicity": "trimestriel", "count": 2 },
      { "periodicity": "unique", "count": 1 }
    ]
  },
  "payments": {
    "thisMonth": {
      "count": 156,
      "totalAmount": 7850000,
      "byMethod": [
        { "method": "cash", "count": 120, "total": 6000000 },
        { "method": "mobile_money", "count": 30, "total": 1500000 },
        { "method": "bank_transfer", "count": 6, "total": 350000 }
      ]
    },
    "recent": [
      {
        "_id": "...",
        "studentId": {
          "matricule": "ELV-2026-001",
          "firstName": "Jean",
          "lastName": "Dupont"
        },
        "schoolFeeId": {
          "label": "Minerval Mensuel",
          "amount": 50000,
          "currency": "CDF"
        },
        "amount": 50000,
        "paymentDate": "2026-03-19T00:00:00.000Z",
        "paymentMethod": "cash",
        "status": "completed"
      }
    ],
    "financial": {
      "totalExpected": 10000000,
      "totalCollected": 7850000,
      "collectionRate": 78,
      "outstanding": 2150000
    }
  },
  "period": {
    "month": "mars 2026",
    "schoolYear": "2026"
  }
}
```

**Utilisation dans le frontend:**

```javascript
// Exemple React/Vue
const fetchDashboard = async () => {
  const response = await fetch('http://64.23.188.15:8000/api/v1/dashboard/school', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  
  // Utiliser les données
  console.log(`Total étudiants: ${data.overview.totalStudents}`);
  console.log(`Taux de recouvrement: ${data.overview.collectionRate}%`);
  console.log(`Montant collecté ce mois: ${data.payments.thisMonth.totalAmount} CDF`);
};
```

**Données disponibles pour le dashboard:**

1. **Vue d'ensemble (overview)**
   - Nombre total d'étudiants, classes, enseignants, frais
   - Paiements et montant du mois en cours
   - Taux de recouvrement global

2. **Étudiants (students)**
   - Total et répartition par genre

3. **Classes (classrooms)**
   - Total et répartition par niveau
   - Top 5 classes avec le plus d'étudiants

4. **Enseignants (teachers)**
   - Nombre total d'enseignants actifs

5. **Frais scolaires (schoolFees)**
   - Total et répartition par périodicité

6. **Paiements (payments)**
   - Statistiques du mois en cours
   - Répartition par méthode de paiement
   - 5 derniers paiements
   - Situation financière globale (attendu vs collecté)

---

## �� Sections

### 1. Créer une section

**POST** `/sections` 🔒

**Body:**
```json
{
  "name": "Scientifique",
  "description": "Section sciences et mathématiques",
  "code": "SCI"
}
```

---

### 2. Lister les sections

**GET** `/sections` 🔒

---

### 3. Récupérer une section

**GET** `/sections/:id` 🔒

---

### 4. Mettre à jour une section

**PUT** `/sections/:id` 🔒

---

### 5. Supprimer une section

**DELETE** `/sections/:id` 🔒

---

## 🎯 Options

### 1. Créer une option

**POST** `/options` 🔒

**Body:**
```json
{
  "name": "Math-Physique",
  "sectionId": "6734be089acec1931a6e0b42",
  "description": "Option mathématiques et physique",
  "code": "MP"
}
```

---

### 2. Lister les options

**GET** `/options?sectionId=...` 🔒

---

### 3. Récupérer une option

**GET** `/options/:id` 🔒

---

### 4. Mettre à jour une option

**PUT** `/options/:id` 🔒

---

### 5. Supprimer une option

**DELETE** `/options/:id` 🔒

---

## 🎯 Exemples de Flux Complets

### Flux 1: Inscription complète d'un élève

```bash
# 1. Créer une section
POST /api/v1/sections
Authorization: Bearer <token>
{
  "name": "Scientifique",
  "code": "SCI"
}
# Réponse: sectionId = "SEC123"

# 2. Créer une option
POST /api/v1/options
Authorization: Bearer <token>
{
  "name": "Math-Physique",
  "sectionId": "SEC123",
  "code": "MP"
}
# Réponse: optionId = "OPT123"

# 3. Créer une classe
POST /api/v1/classrooms
Authorization: Bearer <token>
{
  "name": "6ème Année A",
  "level": "Primaire",
  "capacity": 40,
  "schoolYear": "2025-2026",
  "sectionId": "SEC123",
  "optionId": "OPT123"
}
# Réponse: classroomId = "CLASS123"

# 4. Créer un étudiant
POST /api/v1/students
Authorization: Bearer <token>
{
  "matricule": "ELV-2026-001",
  "firstName": "Jean",
  "lastName": "Dupont",
  "gender": "M",
  "birthDate": "2010-05-15",
  "classroomId": "CLASS123",
  "schoolYear": "2025-2026",
  "tuteur": {
    "name": "Marie Dupont",
    "phone": "+243826016607"
  },
  "status": "actif"
}
# Réponse: studentId = "STUD123"

# 5. Créer un frais scolaire
POST /api/v1/school-fees
Authorization: Bearer <token>
{
  "label": "Minerval Mensuel",
  "periodicity": "mensuel",
  "schoolYear": "2025-2026",
  "currency": "CDF",
  "amount": 50000,
  "classroomIds": ["CLASS123"],
  "active": true
}
# Réponse: schoolFeeId = "FEE123"

# 6. Enregistrer un paiement
POST /api/v1/payments
Authorization: Bearer <token>
{
  "studentId": "STUD123",
  "schoolFeeId": "FEE123",
  "amount": 50000,
  "paymentMethod": "cash",
  "paymentDate": "2026-03-19",
  "reference": "PAY-2026-001",
  "status": "completed"
}
```

---

### Flux 2: Gestion des enseignants et classes

```bash
# 1. Créer un enseignant
POST /api/v1/teachers
Authorization: Bearer <token>
{
  "firstName": "Marie",
  "lastName": "Dubois",
  "phone": "+243826016607",
  "email": "marie@example.com",
  "subject": "Mathématiques",
  "hireDate": "2020-09-01",
  "salary": 500000
}
# Réponse: teacherId = "TEACH123"

# 2. Assigner à une classe (si endpoint disponible)
PATCH /api/v1/classrooms/CLASS123/assign-teacher
Authorization: Bearer <token>
{
  "teacherId": "TEACH123"
}
```

---

### Flux 3: Suivi des paiements d'un élève

```bash
# 1. Voir tous les paiements d'un élève
GET /api/v1/payments/student/STUD123
Authorization: Bearer <token>

# 2. Voir le détail d'un étudiant avec ses paiements
GET /api/v1/students/STUD123
Authorization: Bearer <token>

# 3. Voir tous les paiements d'une classe
GET /api/v1/payments/classroom/CLASS123
Authorization: Bearer <token>
```

---

## ⚠️ Codes d'Erreur

### Erreurs d'authentification

**401 Unauthorized**
```json
{
  "message": "No token provided" 
}
```

**403 Forbidden**
```json
{
  "message": "Invalid or expired token"
}
```

---

### Erreurs de validation

**400 Bad Request**
```json
{
  "message": "Validation error",
  "errors": [
    "firstName is required",
    "dateOfBirth must be a valid date"
  ]
}
```

---

### Erreurs de ressource

**404 Not Found**
```json
{
  "message": "Student not found"
}
```

**409 Conflict**
```json
{
  "message": "Student with this matricule already exists"
}
```

---

### Erreurs serveur

**500 Internal Server Error**
```json
{
  "message": "Error creating student",
  "error": "Database connection failed"
}
```

---

## 📝 Notes Importantes

### 📅 Formats de données

**Dates:**
- Format ISO 8601: `YYYY-MM-DD` pour les dates simples
- Format complet: `YYYY-MM-DDTHH:mm:ss.sssZ` pour les timestamps
- Exemples: `2026-03-19` ou `2026-03-19T18:00:00.000Z`

**Téléphones:**
- Format international obligatoire: `+[code pays][numéro]`
- Exemple RDC: `+243826016607`
- Exemple: `+243842613000`

**IDs:**
- MongoDB ObjectId: 24 caractères hexadécimaux
- Exemple: `6734be089acec1931a6e0b44`
- Générés automatiquement par la base de données

**Matricules:**
- Format recommandé: `ELV-[ANNÉE]-[NUMÉRO]`
- Exemple: `ELV-2026-001`
- Doivent être uniques par école

### 📊 Pagination

**Paramètres de requête:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Éléments par page (défaut: 10 ou 20)

**Structure de réponse:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 125,
    "pages": 7
  }
}
```

### 🏢 Multi-tenant (Isolation des données)

- Chaque école (company) a ses données **complètement isolées**
- Le `companyId` est **extrait automatiquement** du token JWT
- Impossible d'accéder aux données d'une autre école
- Tous les endpoints filtrent automatiquement par `companyId`

### 💰 Devises

**Configuration:**
- Configurable par école dans les paramètres company
- Champs disponibles:
  - `currency`: Nom complet (ex: "Franc Congolais", "United States Dollar")
  - `signCurrency`: Symbole (ex: "FC", "$", "€")

**Devises courantes:**
- **CDF** (Franc Congolais): Par défaut pour la RDC
- **USD** (Dollar Américain): Accepté
- **EUR** (Euro): Accepté

### 📌 Statuts et États

**Classes:**
- `active`: `true` (active) ou `false` (inactive)

**Étudiants:**
- `actif`: Étudiant inscrit et présent
- `transfert`: Étudiant transféré vers une autre classe/école
- `sorti`: Étudiant qui a quitté l'école

**Enseignants:**
- `active`: `true` (en service) ou `false` (inactif)

**Paiements:**
- `completed`: Paiement complet et validé
- `partial`: Paiement partiel (montant < frais total)
- `pending`: Paiement en attente de confirmation
- `cancelled`: Paiement annulé

**Frais scolaires - Périodicité:**
- `unique`: Frais unique (inscription, examen)
- `mensuel`: Frais mensuel (minerval)
- `trimestriel`: Frais trimestriel

### 🔒 Sécurité

**Authentification:**
- Token JWT requis pour toutes les routes (sauf login/signup)
- Token valide pendant la session
- Header: `Authorization: Bearer <token>`

**Permissions:**
- Les rôles sont gérés au niveau utilisateur
- `Admin`: Accès complet
- `User`: Accès limité selon configuration

### ⚡ Performance

**Bonnes pratiques:**
- Utilisez la pagination pour les grandes listes
- Filtrez les résultats avec les query parameters
- Les endpoints de statistiques peuvent être plus lents (calculs complexes)

**Limites:**
- Pagination max: 100 éléments par page
- Timeout requête: 30 secondes

---

## 📱 Accès et URLs

### Environnements

**🖥️ Développement Local:**
- Base URL: `http://localhost:8000/api/v1`
- Swagger: `http://localhost:8000/api/v1/docs`

**🌐 Production:**
- Base URL: `http://64.23.188.15:8000/api/v1`
- Swagger: `http://64.23.188.15:8000/api/v1/docs`

### Identifiants de test

**Compte École (Production):**
- Téléphone: `+243842613000`
- Mot de passe: `1234`
- École: School Malolo
- Rôle: Admin

---

## 📞 Support et Documentation

### 📚 Documentations complémentaires

- **Swagger UI**: Documentation interactive pour tester les endpoints
- **API-COMPLETE-DOCUMENTATION.md**: Documentation consolidée de tous les modules
- **HOTEL-MANAGEMENT-API.md**: Module de gestion hôtelière
- **SCHOOL-FEE-API-DOCUMENTATION.md**: Détails sur les frais scolaires
- **API-SECTIONS-OPTIONS.md**: Gestion des sections et options académiques

### 🛠️ Outils recommandés

- **Postman**: Pour tester les endpoints
- **Swagger UI**: Interface de test intégrée
- **cURL**: Pour les tests en ligne de commande

### 📝 Changelog

**Version 2.0 - Mars 2026:**
- ✅ Correction `academicYear` → `schoolYear`
- ✅ Ajout endpoint statistiques de paiements
- ✅ Amélioration des réponses avec objets populés
- ✅ Documentation complète des paiements
- ✅ Exemples de flux complets

**Version 1.0 - Février 2026:**
- ✅ Module école initial
- ✅ Gestion classes, étudiants, enseignants
- ✅ Système de paiements
- ✅ Multi-tenant

---

## 🎓 Exemples d'utilisation

### Avec cURL

```bash
# Login
curl -X POST http://64.23.188.15:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"+243842613000","password":"1234"}'

# Créer une classe (avec token)
curl -X POST http://64.23.188.15:8000/api/v1/classrooms \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"6ème A","level":"Primaire","schoolYear":"2025-2026","capacity":40}'

# Lister les étudiants
curl -X GET "http://64.23.188.15:8000/api/v1/students?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Avec JavaScript (Fetch)

```javascript
// Login
const loginResponse = await fetch('http://64.23.188.15:8000/api/v1/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '+243842613000',
    password: '1234'
  })
});
const { token } = await loginResponse.json();

// Créer un étudiant
const studentResponse = await fetch('http://64.23.188.15:8000/api/v1/students', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    matricule: 'ELV-2026-001',
    firstName: 'Jean',
    lastName: 'Dupont',
    gender: 'M',
    classroomId: 'CLASS_ID',
    schoolYear: '2025-2026'
  })
});
```

---

## ✅ Checklist d'intégration

Pour intégrer ce module dans votre application:

- [ ] Obtenir les identifiants d'accès (phone + password)
- [ ] Tester le login et récupérer le token
- [ ] Configurer l'authentification dans votre client HTTP
- [ ] Créer les sections et options académiques
- [ ] Créer les classes pour l'année scolaire
- [ ] Configurer les frais scolaires
- [ ] Inscrire les étudiants
- [ ] Enregistrer les enseignants
- [ ] Commencer à enregistrer les paiements
- [ ] Utiliser les endpoints de statistiques pour le suivi

---

**📅 Dernière mise à jour:** 19 Mars 2026  
**📌 Version:** 2.0  
**👨‍💻 Maintenu par:** Équipe Genius Vente

---

**Développé pour API Genius Vente** 🚀  
**Module:** Gestion Scolaire  
**Version:** 1.0.0  
**Dernière mise à jour:** Mars 2026
