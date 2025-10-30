# 📚 Documentation de l'API de Gestion Scolaire

## 🎯 Vue d'ensemble

Cette API permet de gérer l'ensemble des aspects liés à la gestion d'un établissement scolaire, y compris les classes, les étudiants, les enseignants, les frais scolaires et les paiements.

### 🔗 URL de Base
```
http://24.199.107.106:8000/
```

## 🔐 Authentification

### Se connecter (Login)
```http
POST /api/v1/auth/login
```
**Corps de la requête :**
```json
{
  "email": "admin@ecole.com",
  "password": "votre_mot_de_passe"
}
```

**Réponse en cas de succès (200 OK) :**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "5f8d0f4d7f4f4a2f3c4d5e6f",
    "name": "Admin User",
    "email": "admin@ecole.com",
    "role": "admin"
  }
}
```

### Utilisation du token
Tous les endpoints (sauf `/auth/login` et `/reports/sales-summary-by-phone`) nécessitent un token d'authentification dans le header :
```
Authorization: Bearer <votre_token>
```

### Rafraîchir le token
```http
POST /api/v1/auth/refresh-token
Authorization: Bearer <votre_refresh_token>
```

### Se déconnecter (Logout)
```http
POST /api/v1/auth/logout
Authorization: Bearer <votre_token>
```

### Récupérer le profil utilisateur
```http
GET /api/v1/auth/me
Authorization: Bearer <votre_token>
```

---

## 🏫 1. Gestion des Classes (Classrooms)

### Créer une nouvelle classe
```http
POST /api/v1/classrooms
```
**Corps de la requête :**
```json
{
  "name": "6ème A",
  "level": "6ème",
  "sectionId": "5f8d0f4d7f4f4a2f3c4d5e6f",
  "schoolYear": "2025-2026",
  "capacity": 40
}
```

### Récupérer toutes les classes
```http
GET /api/v1/classrooms
```

### Récupérer une classe par ID
```http
GET /api/v1/classrooms/:id
```

### Mettre à jour une classe
```http
PUT /api/v1/classrooms/:id
```

### Supprimer une classe
```http
DELETE /api/v1/classrooms/:id
```

### Activer/Désactiver une classe
```http
PATCH /api/v1/classrooms/:id/active
```

## 💰 2. Gestion des Frais Scolaires (School Fees)

### Créer un nouveau frais scolaire
```http
POST /api/v1/school-fees
```
**Corps de la requête :**
```json
{
  "label": "Minerval Mensuel",
  "periodicity": "mensuel",
  "schoolYear": "2025-2026",
  "classroomIds": ["5f8d0f4d7f4f4a2f3c4d5e6f"],
  "fixedAmount": 50000,
  "currency": "CDF"
}
```

### Récupérer tous les frais scolaires
```http
GET /api/v1/school-fees
```

### Récupérer un frais par ID
```http
GET /api/v1/school-fees/:id
```

## 👨‍🎓 3. Gestion des Étudiants (Students)

### Créer un nouvel étudiant
```http
POST /api/v1/students
```
**Corps de la requête :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "dateOfBirth": "2010-05-15",
  "gender": "M",
  "classroomId": "5f8d0f4d7f4f4a2f3c4d5e6f",
  "parentPhone": "+243810000000"
}
```

### Récupérer tous les étudiants
```http
GET /api/v1/students
```

### Récupérer un étudiant par ID
```http
GET /api/v1/students/:id
```

## 👨‍🏫 4. Gestion des Enseignants (Teachers)

### Créer un nouvel enseignant
```http
POST /api/v1/teachers
```
**Corps de la requête :**
```json
{
  "firstName": "Marie",
  "lastName": "Dubois",
  "email": "marie.dubois@ecole.com",
  "phone": "+243820000000",
  "subjects": ["Mathématiques", "Physique"]
}
```

### Récupérer tous les enseignants
```http
GET /api/v1/teachers
```

## 💳 5. Gestion des Paiements (Payments)

### Enregistrer un nouveau paiement
```http
POST /api/v1/payments
```
**Corps de la requête :**
```json
{
  "studentId": "5f8d0f4d7f4f4a2f3c4d5e6f",
  "schoolFeeId": "5f8d0f4d7f4f4a2f3c4d5e6f",
  "amount": 50000,
  "paymentMethod": "mobile_money",
  "paymentDate": "2025-10-30",
  "reference": "PAY-123456"
}
```

### Récupérer les paiements d'un étudiant
```http
GET /api/v1/payments/student/:studentId
```

### Récupérer les paiements d'une classe
```http
GET /api/v1/payments/classroom/:classroomId
```

## 🔍 6. Rapports (Reports)

### Rapport des ventes par téléphone (sans authentification)
```http
GET /api/v1/reports/sales-summary-by-phone?phone=243810000000
```

---

## 📝 Notes importantes

1. Tous les montants sont exprimés en CDF par défaut
2. Les dates doivent être au format ISO 8601 (YYYY-MM-DD)
3. Les identifiants (ID) sont des chaînes de caractères au format MongoDB ObjectId
4. Pour les requêtes nécessitant une pagination, utilisez les paramètres `page` et `limit`
5. Les erreurs sont renvoyées avec un code HTTP approprié et un message d'erreur détaillé
