# API Sections et Options - Documentation

## Vue d'ensemble

Cette API permet aux entreprises (écoles) de gérer leurs propres sections et options de manière indépendante. **Toutes les entreprises peuvent créer et gérer leurs propres sections et options librement.**

### Caractéristiques principales

- ✅ **Multi-tenant** : Chaque entreprise gère ses propres données
- ✅ **Sections obligatoires** : Chaque classe doit avoir une section
- ✅ **Options facultatives** : Les options ne sont pas obligatoires
- ✅ **Aucune donnée par défaut** : Chaque entreprise crée ses propres données
- ✅ **Codes uniques** : Les codes sont uniques par entreprise
- ✅ **Authentification requise** : Tous les endpoints sont protégés

## Modèles de données

### Section
```javascript
{
  name: String,           // Nom de la section (ex: "Primaire")
  code: String,           // Code unique (ex: "PRI")
  description: String,    // Description optionnelle
  levels: [String],       // Niveaux d'enseignement
  active: Boolean,        // Statut actif/inactif
  companyId: ObjectId     // Référence à l'entreprise
}
```

### Option
```javascript
{
  name: String,           // Nom de l'option (ex: "Général")
  code: String,           // Code unique (ex: "GEN")
  description: String,    // Description optionnelle
  subjects: [String],     // Matières de l'option
  active: Boolean,        // Statut actif/inactif
  companyId: ObjectId     // Référence à l'entreprise
}
```

### Classroom (modifié)
```javascript
{
  // ... autres champs existants
  sectionId: ObjectId,    // Référence à la section (obligatoire)
  optionId: ObjectId      // Référence à l'option (facultatif)
}
```

## Endpoints disponibles

### Sections

#### Créer une section
```http
POST /api/v1/sections
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Primaire",
  "code": "PRI",
  "description": "Section primaire",
  "levels": ["1ère année", "2ème année", "3ème année"]
}
```

#### Récupérer toutes les sections
```http
GET /api/v1/sections
Authorization: Bearer <token>
```

#### Récupérer les sections actives
```http
GET /api/v1/sections/active
Authorization: Bearer <token>
```

#### Récupérer une section par ID
```http
GET /api/v1/sections/:id
Authorization: Bearer <token>
```

#### Mettre à jour une section
```http
PUT /api/v1/sections/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Primaire Modifiée",
  "description": "Nouvelle description"
}
```

#### Supprimer une section
```http
DELETE /api/v1/sections/:id
Authorization: Bearer <token>
```

#### Basculer le statut d'une section
```http
PATCH /api/v1/sections/:id/toggle
Authorization: Bearer <token>
```

#### Récupérer les sections par entreprise
```http
GET /api/v1/sections/company/:companyId
Authorization: Bearer <token>
```

### Options

#### Créer une option
```http
POST /api/v1/options
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Général",
  "code": "GEN",
  "description": "Option générale",
  "subjects": ["Mathématiques", "Français", "Histoire"]
}
```

#### Récupérer toutes les options
```http
GET /api/v1/options
Authorization: Bearer <token>
```

#### Récupérer les options actives
```http
GET /api/v1/options/active
Authorization: Bearer <token>
```

#### Récupérer une option par ID
```http
GET /api/v1/options/:id
Authorization: Bearer <token>
```

#### Mettre à jour une option
```http
PUT /api/v1/options/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Général Modifié",
  "description": "Nouvelle description"
}
```

#### Supprimer une option
```http
DELETE /api/v1/options/:id
Authorization: Bearer <token>
```

#### Basculer le statut d'une option
```http
PATCH /api/v1/options/:id/toggle
Authorization: Bearer <token>
```

#### Récupérer les options par entreprise
```http
GET /api/v1/options/company/:companyId
Authorization: Bearer <token>
```

## Sécurité

- **Authentification** : Tous les endpoints nécessitent un token JWT valide
- **Autorisation** : Chaque entreprise ne peut accéder qu'à ses propres données
- **Isolation** : Les données sont isolées par `companyId`
- **Validation** : Les codes sont uniques par entreprise

## Données par défaut

**Le script `scripts/init-school-data.js` ne crée plus de données par défaut.** Chaque entreprise peut créer ses propres sections et options librement.

## Exemples d'utilisation

### 1. Créer une section primaire
```bash
curl -X POST http://localhost:8000/api/v1/sections \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Primaire",
    "code": "PRI",
    "description": "Section primaire pour les élèves de 1ère à 6ème année",
    "levels": ["1ère année", "2ème année", "3ème année", "4ème année", "5ème année", "6ème année"]
  }'
```

### 2. Créer une option générale
```bash
curl -X POST http://localhost:8000/api/v1/options \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Général",
    "code": "GEN",
    "description": "Option générale avec matières de base",
    "subjects": ["Mathématiques", "Français", "Histoire", "Géographie", "Sciences"]
  }'
```

### 3. Récupérer les sections de l'entreprise
```bash
curl -X GET "http://localhost:8000/api/v1/sections/company/YOUR_COMPANY_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Notes importantes

1. **Options facultatives** : Les options ne sont pas obligatoires pour les classes
2. **Codes uniques** : Les codes doivent être uniques par entreprise
3. **Multi-tenant** : Chaque entreprise gère ses données indépendamment
4. **Aucune restriction** : Toutes les entreprises peuvent utiliser ces fonctionnalités
5. **Pas de données par défaut** : Chaque entreprise crée ses propres sections et options

## Documentation Swagger

La documentation complète est disponible à : `http://localhost:8000/api/v1/docs`

## Support

Pour toute question ou problème, contactez l'équipe de développement.
