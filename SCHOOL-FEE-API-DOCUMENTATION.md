# 📚 **DOCUMENTATION API - FRAIS SCOLAIRES**

## 🎯 **Vue d'ensemble**

Le système de frais scolaires permet de gérer les différents types de frais (Minerval, frais d'inscription, etc.) avec des montants fixes ou personnalisés.

---

## 🔧 **ENDPOINTS DISPONIBLES**

### **1. Créer un frais scolaire**
```http
POST /api/v1/school-fees
```

**Headers requis :**
```json
{
  "Authorization": "Bearer <votre_token>",
  "Content-Type": "application/json"
}
```

**Champs requis :**
- `label` (string) : Libellé du frais
- `schoolYear` (string) : Année scolaire

**Champs optionnels :**
- `periodicity` (string) : `unique`, `mensuel`, `trimestriel` (défaut: `mensuel`)
- `currency` (string) : Devise (défaut: `CDF`)
- `allowCustomAmount` (boolean) : Autoriser montant personnalisé (défaut: `false`)
- `fixedAmount` (number) : Montant fixe (défaut: `0`)
- `min` (number) : Montant minimum (défaut: `0`)
- `max` (number) : Montant maximum (défaut: `0`)
- `classroomId` (string) : ID de la classe pour override spécifique

**Exemple JSON :**
```json
{
  "label": "Minerval Mensuel",
  "periodicity": "mensuel",
  "schoolYear": "2025-2026",
  "currency": "CDF",
  "allowCustomAmount": false,
  "fixedAmount": 50000,
  "min": 0,
  "max": 0
}
```

**Réponse de succès (201) :**
```json
{
  "message": "Frais scolaire créé avec succès",
  "schoolFee": {
    "_id": "68c75ba51e6d7f510b3ac949",
    "companyId": "68bb29a00d5827da1df4f4e5",
    "label": "Minerval Mensuel",
    "periodicity": "mensuel",
    "schoolYear": "2025-2026",
    "currency": "CDF",
    "allowCustomAmount": false,
    "fixedAmount": 50000,
    "min": 0,
    "max": 0,
    "active": true,
    "createdAt": "2025-09-15T00:19:49.218Z",
    "updatedAt": "2025-09-15T00:19:49.218Z"
  }
}
```

---

### **2. Lister tous les frais scolaires**
```http
GET /api/v1/school-fees
```

**Paramètres de requête :**
- `page` (number) : Numéro de page (défaut: 1)
- `limit` (number) : Nombre d'éléments par page (défaut: 20)
- `schoolYear` (string) : Filtrer par année scolaire
- `classroomId` (string) : Filtrer par classe
- `active` (boolean) : Filtrer par statut actif

**Exemple :**
```http
GET /api/v1/school-fees?page=1&limit=10&schoolYear=2025-2026&active=true
```

**Réponse (200) :**
```json
{
  "schoolFees": [
    {
      "_id": "68c75ba51e6d7f510b3ac949",
      "companyId": "68bb29a00d5827da1df4f4e5",
      "label": "Minerval Mensuel",
      "periodicity": "mensuel",
      "schoolYear": "2025-2026",
      "currency": "CDF",
      "allowCustomAmount": false,
      "fixedAmount": 50000,
      "min": 0,
      "max": 0,
      "active": true,
      "createdAt": "2025-09-15T00:19:49.218Z",
      "updatedAt": "2025-09-15T00:19:49.218Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

---

### **3. Récupérer un frais par ID**
```http
GET /api/v1/school-fees/:id
```

**Réponse (200) :**
```json
{
  "schoolFee": {
    "_id": "68c75ba51e6d7f510b3ac949",
    "companyId": "68bb29a00d5827da1df4f4e5",
    "label": "Minerval Mensuel",
    "periodicity": "mensuel",
    "schoolYear": "2025-2026",
    "currency": "CDF",
    "allowCustomAmount": false,
    "fixedAmount": 50000,
    "min": 0,
    "max": 0,
    "active": true,
    "createdAt": "2025-09-15T00:19:49.218Z",
    "updatedAt": "2025-09-15T00:19:49.218Z"
  }
}
```

---

### **4. Mettre à jour un frais**
```http
PUT /api/v1/school-fees/:id
```

**Body JSON :**
```json
{
  "label": "Minerval Mensuel - Mis à jour",
  "fixedAmount": 60000
}
```

---

### **5. Activer/Désactiver un frais**
```http
PATCH /api/v1/school-fees/:id/active
```

**Réponse (200) :**
```json
{
  "message": "Frais scolaire activé avec succès",
  "schoolFee": {
    "_id": "68c75ba51e6d7f510b3ac949",
    "active": true,
    // ... autres champs
  }
}
```

---

## 🎯 **TYPES DE FRAIS SCOLAIRES**

### **1. Frais à montant fixe**
```json
{
  "label": "Minerval Mensuel",
  "periodicity": "mensuel",
  "schoolYear": "2025-2026",
  "allowCustomAmount": false,
  "fixedAmount": 50000
}
```

### **2. Frais à montant personnalisé**
```json
{
  "label": "Frais d'inscription",
  "periodicity": "unique",
  "schoolYear": "2025-2026",
  "allowCustomAmount": true,
  "min": 10000,
  "max": 100000
}
```

### **3. Frais spécifique à une classe**
```json
{
  "label": "Minerval 6ème",
  "periodicity": "mensuel",
  "schoolYear": "2025-2026",
  "fixedAmount": 75000,
  "classroomId": "68c5f392c380a4440b3a5a97"
}
```

---

## 🔄 **PÉRIODICITÉS DISPONIBLES**

- **`unique`** : Frais payé une seule fois (ex: frais d'inscription)
- **`mensuel`** : Frais payé chaque mois (ex: Minerval)
- **`trimestriel`** : Frais payé chaque trimestre

---

## 💡 **EXEMPLES D'UTILISATION**

### **Créer un Minerval mensuel**
```json
{
  "label": "Minerval Mensuel",
  "periodicity": "mensuel",
  "schoolYear": "2025-2026",
  "fixedAmount": 50000
}
```

### **Créer des frais d'inscription**
```json
{
  "label": "Frais d'inscription",
  "periodicity": "unique",
  "schoolYear": "2025-2026",
  "allowCustomAmount": true,
  "min": 15000,
  "max": 50000
}
```

### **Créer des frais de transport**
```json
{
  "label": "Frais de transport",
  "periodicity": "mensuel",
  "schoolYear": "2025-2026",
  "fixedAmount": 15000
}
```

---

## ⚠️ **CODES D'ERREUR**

- **400** : Données invalides
- **401** : Non authentifié
- **403** : Accès refusé
- **404** : Frais scolaire non trouvé
- **500** : Erreur serveur

---

## 📝 **NOTES IMPORTANTES**

1. **Multi-tenancy** : Chaque entreprise ne voit que ses propres frais
2. **Validation** : Les montants doivent respecter les limites min/max
3. **Classe spécifique** : Un frais peut être assigné à une classe particulière
4. **Statut actif** : Seuls les frais actifs sont visibles par défaut
5. **Année scolaire** : Les frais sont organisés par année scolaire

---

## 🔗 **LIENS AVEC LE SYSTÈME DE PAIEMENT**

Les frais scolaires créés ici sont utilisés dans le système de paiement pour :
- Définir le montant à payer
- Calculer les montants restants
- Générer les rapports de paiement
- Suivre l'historique des paiements

---

## 🚀 **PROCHAINES ÉTAPES**

1. Créer les frais scolaires nécessaires
2. Assigner les frais aux élèves
3. Enregistrer les paiements
4. Générer les rapports de paiement
