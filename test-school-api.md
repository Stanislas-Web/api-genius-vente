# Test des nouvelles API scolaires

## Prérequis
- Serveur démarré sur http://localhost:8000
- Token d'authentification valide
- CompanyId valide

## Tests des endpoints
### 1. Créer une classe
```bash
POST /api/v1/classrooms
Headers: 
  Authorization: Bearer <token>
  x-company-id: <companyId> (optionnel si companyId dans le token)

Body:
{
  "code": "6A-2025",
  "name": "6ème A",
  "level": "6ème",
  "section": "Lettres",
  "schoolYear": "2025-2026",
  "capacity": 40
}
```

### 2. Créer un élève
```bash
POST /api/v1/students
Headers: 
  Authorization: Bearer <token>
  x-company-id: <companyId>

Body:
{
  "lastName": "KABILA",
  "firstName": "Junior",
  "gender": "M",
  "parent": {
    "name": "Papa KABILA",
    "phone": "+243123456789"
  },
  "classroomId": "<idClasse>",
  "schoolYear": "2025-2026"
}
```

### 3. Créer un professeur
```bash
POST /api/v1/teachers
Headers: 
  Authorization: Bearer <token>
  x-company-id: <companyId>

Body:
{
  "code": "PROF-0001",
  "lastName": "MULAMBA",
  "firstName": "Sarah",
  "phone": "+243987654321",
  "email": "sarah@exemple.cd",
  "classes": ["<idClasse>"]
}
```

### 4. Créer un frais scolaire
```bash
POST /api/v1/school-fees
Headers: 
  Authorization: Bearer <token>
  x-company-id: <companyId>

Body:
{
  "label": "Minerval Mensuel",
  "code": "MIN",
  "periodicity": "mensuel",
  "schoolYear": "2025-2026",
  "currency": "CDF",
  "allowCustomAmount": false,
  "fixedAmount": 150000
}
```

### 5. Lister les frais avec override classe
```bash
GET /api/v1/school-fees?schoolYear=2025-2026&classroomId=<idClasse>
Headers: 
  Authorization: Bearer <token>
  x-company-id: <companyId>
```

## Endpoints disponibles

### Classrooms
- `POST /api/v1/classrooms` - Créer une classe
- `GET /api/v1/classrooms` - Lister les classes (avec filtres)
- `GET /api/v1/classrooms/:id` - Détail d'une classe
- `PUT /api/v1/classrooms/:id` - Mettre à jour une classe
- `PATCH /api/v1/classrooms/:id/active` - Toggle actif

### Students
- `POST /api/v1/students` - Créer un élève
- `GET /api/v1/students` - Lister les élèves (avec filtres)
- `GET /api/v1/students/:id` - Détail d'un élève
- `PUT /api/v1/students/:id` - Mettre à jour un élève
- `POST /api/v1/students/:id/move` - Promouvoir/transférer un élève

### Teachers
- `POST /api/v1/teachers` - Créer un professeur
- `GET /api/v1/teachers` - Lister les professeurs (avec filtres)
- `GET /api/v1/teachers/:id` - Détail d'un professeur
- `PUT /api/v1/teachers/:id` - Mettre à jour un professeur

### SchoolFees
- `POST /api/v1/school-fees` - Créer un frais scolaire
- `GET /api/v1/school-fees` - Lister les frais (avec filtres)
- `GET /api/v1/school-fees/:id` - Détail d'un frais
- `PUT /api/v1/school-fees/:id` - Mettre à jour un frais
- `PATCH /api/v1/school-fees/:id/active` - Toggle actif

## Documentation Swagger
Accédez à http://localhost:8000/api/v1/docs pour voir la documentation complète avec Swagger UI.
