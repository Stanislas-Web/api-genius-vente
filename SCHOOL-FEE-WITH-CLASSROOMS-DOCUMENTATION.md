# 📚 **DOCUMENTATION API - FRAIS SCOLAIRES AVEC CLASSES**

## 🎯 **Vue d'ensemble**

Le système de frais scolaires a été mis à jour pour **obligatoirement** lier chaque frais à une ou plusieurs classes. Cela permet une meilleure organisation et un contrôle précis des frais par niveau d'étude.

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
- `classroomIds` (array) : **OBLIGATOIRE** - IDs des classes concernées

**Champs optionnels :**
- `periodicity` (string) : `unique`, `mensuel`, `trimestriel` (défaut: `mensuel`)
- `currency` (string) : Devise (défaut: `CDF`)
- `allowCustomAmount` (boolean) : Autoriser montant personnalisé (défaut: `false`)
- `fixedAmount` (number) : Montant fixe (défaut: `0`)
- `min` (number) : Montant minimum (défaut: `0`)
- `max` (number) : Montant maximum (défaut: `0`)

---

## 📝 **EXEMPLES DE CRÉATION**

### **1. Frais pour une seule classe**
```json
{
  "label": "Minerval Mensuel - 6ème C",
  "periodicity": "mensuel",
  "schoolYear": "2025-2026",
  "currency": "CDF",
  "allowCustomAmount": false,
  "fixedAmount": 50000,
  "classroomIds": ["68c5f1a1c380a4440b3a5a71"]
}
```

### **2. Frais pour plusieurs classes**
```json
{
  "label": "Frais d'inscription - Classes supérieures",
  "periodicity": "unique",
  "schoolYear": "2025-2026",
  "currency": "CDF",
  "allowCustomAmount": true,
  "fixedAmount": 0,
  "min": 15000,
  "max": 50000,
  "classroomIds": [
    "68c5f1a1c380a4440b3a5a71",
    "68c5eee7c380a4440b3a5a4f"
  ]
}
```

### **3. Frais de transport pour toutes les classes primaires**
```json
{
  "label": "Frais de transport - Primaire",
  "periodicity": "mensuel",
  "schoolYear": "2025-2026",
  "currency": "CDF",
  "allowCustomAmount": false,
  "fixedAmount": 15000,
  "classroomIds": [
    "68c5f1a1c380a4440b3a5a71",
    "68c5eee7c380a4440b3a5a4f",
    "68c5f392c380a4440b3a5a97"
  ]
}
```

---

## 🔍 **VALIDATIONS IMPORTANTES**

### **1. Validation des classroomIds**
- **OBLIGATOIRE** : Le champ `classroomIds` doit être présent
- **Type** : Doit être un tableau (array)
- **Contenu** : Doit contenir au moins un ID de classe
- **Existence** : Toutes les classes doivent exister dans la base de données
- **Propriété** : Toutes les classes doivent appartenir à la même entreprise

### **2. Messages d'erreur**
```json
// Si classroomIds manquant
{
  "message": "classroomIds est requis et doit être un tableau non vide"
}

// Si classe inexistante
{
  "message": "Une ou plusieurs classes non trouvées ou ne vous appartiennent pas"
}
```

---

## 📊 **CONSULTATION DES FRAIS**

### **1. Lister tous les frais**
```http
GET /api/v1/school-fees
```

**Paramètres :**
- `page` : Numéro de page
- `limit` : Nombre d'éléments par page
- `schoolYear` : Année scolaire
- `classroomId` : Filtrer par classe spécifique
- `active` : Statut actif

### **2. Filtrer par classe**
```http
GET /api/v1/school-fees?classroomId=68c5f1a1c380a4440b3a5a71
```

**Réponse :**
```json
{
  "schoolFees": [
    {
      "_id": "68c82fade1ac024cbd4b85bc",
      "label": "Minerval Mensuel - 6ème C",
      "periodicity": "mensuel",
      "schoolYear": "2025-2026",
      "currency": "CDF",
      "fixedAmount": 50000,
      "classroomIds": [
        {
          "_id": "68c5f1a1c380a4440b3a5a71",
          "name": "3 C",
          "code": "3C",
          "schoolYear": "2025-2026"
        }
      ],
      "active": true,
      "createdAt": "2025-09-15T15:24:29.571Z"
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

## 🎯 **AVANTAGES DU NOUVEAU SYSTÈME**

### **1. Organisation précise**
- Chaque frais est lié à des classes spécifiques
- Pas de frais "globaux" non assignés
- Contrôle précis par niveau d'étude

### **2. Flexibilité**
- Un frais peut concerner plusieurs classes
- Possibilité de créer des frais spécifiques par classe
- Gestion des frais par cycle (primaire, secondaire, etc.)

### **3. Traçabilité**
- Historique clair des frais par classe
- Rapports précis par niveau
- Suivi des paiements par classe

---

## 🔄 **MIGRATION DEPUIS L'ANCIEN SYSTÈME**

### **Avant (ancien système)**
```json
{
  "label": "Minerval Mensuel",
  "classroomId": "68c5f1a1c380a4440b3a5a71"  // Une seule classe
}
```

### **Après (nouveau système)**
```json
{
  "label": "Minerval Mensuel",
  "classroomIds": ["68c5f1a1c380a4440b3a5a71"]  // Tableau de classes
}
```

---

## 📋 **CAS D'USAGE TYPIQUES**

### **1. Frais par niveau**
```json
{
  "label": "Minerval Primaire",
  "classroomIds": ["classe1", "classe2", "classe3"]  // Toutes les classes primaires
}
```

### **2. Frais spécifique à une classe**
```json
{
  "label": "Frais de laboratoire - 6ème",
  "classroomIds": ["classe6eme"]  // Seulement la 6ème
}
```

### **3. Frais par cycle**
```json
{
  "label": "Frais de transport - Secondaire",
  "classroomIds": ["classe7", "classe8", "classe9", "classe10"]  // Toutes les classes secondaires
}
```

---

## ⚠️ **IMPORTANT**

1. **Champ obligatoire** : `classroomIds` est maintenant **OBLIGATOIRE**
2. **Validation stricte** : Toutes les classes doivent exister et appartenir à l'entreprise
3. **Rétrocompatibilité** : L'ancien champ `classroomId` n'est plus supporté
4. **Migration** : Les anciens frais sans classes devront être mis à jour

---

## 🚀 **PROCHAINES ÉTAPES**

1. **Créer les frais** avec les `classroomIds` appropriés
2. **Tester la validation** pour s'assurer que les classes existent
3. **Organiser les frais** par niveau ou par cycle
4. **Générer les rapports** par classe

Le système est maintenant plus robuste et organisé ! 🎉
