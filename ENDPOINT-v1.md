# CAHIER DES CHARGES - MODULE SCHOOL WEB

## 1. CONTEXTE ET OBJECTIFS

### 1.1 Contexte
Ce cahier des charges définit les spécifications pour le développement de la partie web du module "School" de l'application Genius Vente. L'application mobile Flutter existante gère déjà la gestion scolaire avec des fonctionnalités complètes, et il s'agit maintenant de créer une interface web correspondante.

### 1.2 Objectifs
- Créer une interface web responsive pour la gestion scolaire
- Permettre l'accès aux fonctionnalités depuis un navigateur web
- Maintenir la cohérence avec l'application mobile existante
- Assurer une expérience utilisateur optimale sur desktop et tablette

## 2. ARCHITECTURE TECHNIQUE

### 2.1 Backend API
- **Base URL**: `http://24.199.107.106:8000/api/v1/`
- **Authentification**: Bearer Token
- **Format**: JSON
- **Méthodes**: GET, POST, PUT, DELETE

### 2.2 Technologies Recommandées
- **Frontend**: React.js avec TypeScript ou Vue.js
- **UI Framework**: Material-UI, Ant Design, ou Tailwind CSS
- **State Management**: Redux, Zustand, ou Pinia
- **HTTP Client**: Axios ou Fetch API
- **Routing**: React Router ou Vue Router

## 3. FONCTIONNALITÉS PRINCIPALES

### 3.1 Dashboard Scolaire
**Description**: Tableau de bord principal avec statistiques et actions rapides

**Fonctionnalités**:
- Affichage des KPIs (nombre d'élèves, classes, paiements mensuels, taux de paiement)
- Graphiques de tendances des paiements
- Alertes et notifications
- Actions rapides (créer classe, ajouter élève, nouveau paiement)

**API Endpoints**:
- `GET /dashboard/stats` - Statistiques du dashboard
- `GET /dashboard/charts` - Données pour graphiques
- `GET /dashboard/alerts` - Alertes système

### 3.2 Gestion des Élèves
**Description**: Interface complète pour la gestion des élèves

**Fonctionnalités**:
- Liste des élèves avec recherche et filtres
- Création d'un nouvel élève
- Modification des informations d'un élève
- Transfert d'élève entre classes
- Historique des paiements par élève
- Gestion des informations du tuteur

**Champs de l'élève**:
```json
{
  "matricule": "string (obligatoire)",
  "firstName": "string (obligatoire)",
  "lastName": "string (obligatoire)", 
  "middleName": "string (optionnel)",
  "gender": "M|F (obligatoire)",
  "birthDate": "YYYY-MM-DD (obligatoire)",
  "classroomId": "string (obligatoire)",
  "tuteur": {
    "name": "string (obligatoire)",
    "phone": "string (obligatoire)"
  }
}
```

**API Endpoints**:
- `GET /students` - Liste des élèves
- `POST /students` - Créer un élève
- `PUT /students/{id}` - Modifier un élève
- `DELETE /students/{id}` - Supprimer un élève
- `GET /students/{id}/payments` - Paiements d'un élève

### 3.3 Gestion des Classes
**Description**: Interface pour la gestion des classes et sections

**Fonctionnalités**:
- Liste des classes avec informations détaillées
- Création d'une nouvelle classe
- Modification des informations de classe
- Gestion des sections et options
- Assignation des élèves aux classes

**Champs de la classe**:
```json
{
  "code": "string (obligatoire)",
  "name": "string (obligatoire)",
  "level": "string (optionnel)",
  "sectionId": "string (optionnel)",
  "schoolYear": "string (obligatoire)",
  "capacity": "number (optionnel)",
  "optionId": "string (optionnel)",
  "active": "boolean"
}
```

**API Endpoints**:
- `GET /classrooms` - Liste des classes
- `POST /classrooms` - Créer une classe
- `PUT /classrooms/{id}` - Modifier une classe
- `DELETE /classrooms/{id}` - Supprimer une classe

### 3.4 Gestion des Paiements
**Description**: Interface complète pour la gestion des paiements scolaires

**Fonctionnalités**:
- Gestion des frais scolaires (création, modification, suppression)
- Enregistrement des paiements
- Suivi des statuts de paiement
- Rapports de paiements
- Filtrage par classe et frais

**Types de frais scolaires**:
- Unique
- Mensuel  
- Trimestriel

**Champs du frais scolaire**:
```json
{
  "label": "string (obligatoire)",
  "periodicity": "unique|mensuel|trimestriel",
  "schoolYear": "string (obligatoire)",
  "currency": "string (défaut: CDF)",
  "amount": "number (obligatoire)",
  "classroomIds": "array of strings (optionnel)"
}
```

**Champs du paiement**:
```json
{
  "studentId": "string (obligatoire)",
  "schoolFeeId": "string (obligatoire)",
  "amount": "number (obligatoire)",
  "paymentMethod": "cash|transfer|check|mobile_money",
  "paymentDate": "YYYY-MM-DD",
  "description": "string (optionnel)"
}
```

**API Endpoints**:
- `GET /school-fees` - Liste des frais scolaires
- `POST /school-fees` - Créer un frais scolaire
- `PUT /school-fees/{id}` - Modifier un frais scolaire
- `DELETE /school-fees/{id}` - Supprimer un frais scolaire
- `GET /payments` - Liste des paiements
- `POST /payments` - Enregistrer un paiement
- `GET /payments/recent` - Paiements récents

### 3.5 Rapports et Statistiques
**Description**: Interface pour la génération de rapports détaillés

**Fonctionnalités**:
- Rapports par classe et frais scolaire
- Statistiques de paiement (complets, partiels, non payés)
- Filtrage par montant minimum
- Export des données
- Graphiques de tendances

**Types de rapports**:
- Paiements par classe
- Élèves avec paiements au-dessus d'un montant
- Élèves sans paiement
- Statistiques globales

**API Endpoints**:
- `GET /reports/classroom-payments` - Paiements par classe
- `GET /reports/above-amount` - Paiements au-dessus d'un montant
- `GET /reports/unpaid` - Paiements non effectués
- `GET /reports/statistics` - Statistiques globales

## 4. INTERFACE UTILISATEUR

### 4.1 Structure de Navigation
```
Dashboard
├── Élèves
│   ├── Liste des élèves
│   ├── Créer un élève
│   └── Historique des paiements
├── Classes
│   ├── Liste des classes
│   ├── Créer une classe
│   └── Gestion des sections
├── Paiements
│   ├── Frais scolaires
│   ├── Enregistrer paiement
│   └── Statuts de paiement
├── Rapports
│   ├── Paiements par classe
│   ├── Statistiques
│   └── Exports
└── Paramètres
    ├── Informations de l'école
    └── Configuration système
```

### 4.2 Design et UX
- **Responsive Design**: Adaptation desktop, tablette, mobile
- **Thème**: Cohérent avec l'application mobile (couleurs primaires)
- **Navigation**: Sidebar avec icônes et labels
- **Cartes**: Design moderne avec ombres et bordures arrondies
- **Formulaires**: Validation en temps réel avec messages d'erreur
- **Tableaux**: Tri, filtrage, pagination
- **Modales**: Pour les actions de création/modification

### 4.3 Composants UI Requis
- **Dashboard Cards**: Affichage des KPIs
- **Data Tables**: Listes avec tri et filtrage
- **Forms**: Formulaires de création/modification
- **Charts**: Graphiques pour les statistiques
- **Modals**: Dialogs pour les actions
- **Filters**: Composants de filtrage avancé
- **Status Badges**: Indicateurs de statut
- **Progress Bars**: Barres de progression pour les paiements

## 5. GESTION D'ÉTAT ET DONNÉES

### 5.1 État Global
- **Authentification**: Token de session
- **Utilisateur**: Informations du compte connecté
- **École**: Informations de l'établissement
- **Données**: Cache des données fréquemment utilisées

### 5.2 Gestion des Erreurs
- **Messages d'erreur**: Affichage clair des erreurs API
- **Retry Logic**: Possibilité de réessayer les requêtes échouées
- **Loading States**: Indicateurs de chargement
- **Offline Support**: Gestion de la perte de connexion

### 5.3 Optimisations
- **Lazy Loading**: Chargement à la demande
- **Pagination**: Pour les grandes listes
- **Debouncing**: Pour les recherches
- **Caching**: Mise en cache des données statiques

## 6. SÉCURITÉ ET AUTHENTIFICATION

### 6.1 Authentification
- **Token JWT**: Authentification par Bearer Token
- **Refresh Token**: Renouvellement automatique
- **Session Management**: Gestion des sessions expirées
- **Logout**: Déconnexion sécurisée

### 6.2 Autorisation
- **Rôles**: Gestion des permissions par rôle
- **Routes Protégées**: Protection des routes sensibles
- **API Security**: Validation côté client et serveur

## 7. PERFORMANCE ET OPTIMISATION

### 7.1 Performance
- **Bundle Size**: Optimisation de la taille des bundles
- **Code Splitting**: Division du code par routes
- **Lazy Loading**: Chargement des composants à la demande
- **Image Optimization**: Optimisation des images

### 7.2 SEO et Accessibilité
- **Meta Tags**: Balises meta appropriées
- **Semantic HTML**: Structure HTML sémantique
- **ARIA Labels**: Support de l'accessibilité
- **Keyboard Navigation**: Navigation au clavier

## 8. TESTS ET QUALITÉ

### 8.1 Tests
- **Unit Tests**: Tests des composants individuels
- **Integration Tests**: Tests d'intégration API
- **E2E Tests**: Tests end-to-end des flux principaux
- **Performance Tests**: Tests de performance

### 8.2 Qualité du Code
- **Linting**: ESLint/TSLint pour la qualité du code
- **Formatting**: Prettier pour le formatage
- **Type Safety**: TypeScript pour la sécurité des types
- **Code Review**: Processus de revue de code

## 9. DÉPLOIEMENT ET MAINTENANCE

### 9.1 Déploiement
- **Build Process**: Processus de build automatisé
- **Environment Variables**: Gestion des variables d'environnement
- **CDN**: Distribution du contenu statique
- **SSL**: Certificats SSL pour la sécurité

### 9.2 Monitoring
- **Error Tracking**: Suivi des erreurs en production
- **Analytics**: Analytics d'utilisation
- **Performance Monitoring**: Monitoring des performances
- **Uptime**: Surveillance de la disponibilité

## 10. LIVRABLES ATTENDUS

### 10.1 Code Source
- Code source complet et documenté
- Tests unitaires et d'intégration
- Documentation technique
- Guide de déploiement

### 10.2 Documentation
- Guide utilisateur
- Documentation API
- Guide de maintenance
- Procédures de déploiement

### 10.3 Formation
- Formation des utilisateurs finaux
- Formation technique pour la maintenance
- Documentation des procédures

## 11. CONTRAINTES ET CONSIDÉRATIONS

### 11.1 Contraintes Techniques
- **Compatibilité**: Support des navigateurs modernes
- **Responsive**: Adaptation mobile/tablette/desktop
- **Performance**: Temps de chargement optimisés
- **Sécurité**: Conformité aux standards de sécurité

### 11.2 Contraintes Métier
- **Cohérence**: Interface cohérente avec l'app mobile
- **Usabilité**: Interface intuitive et facile à utiliser
- **Accessibilité**: Support des utilisateurs avec handicaps
- **Multilingue**: Support du français et anglais

## 12. PLANNING ET LIVRAISON

### 12.1 Phases de Développement
1. **Phase 1** (2-3 semaines): Setup, authentification, dashboard
2. **Phase 2** (3-4 semaines): Gestion des élèves et classes
3. **Phase 3** (3-4 semaines): Gestion des paiements
4. **Phase 4** (2-3 semaines): Rapports et statistiques
5. **Phase 5** (1-2 semaines): Tests, optimisation, déploiement

### 12.2 Livraison
- **Version Beta**: Version de test avec fonctionnalités principales
- **Version RC**: Version release candidate avec toutes les fonctionnalités
- **Version Production**: Version finale déployée en production

---

**Note**: Ce cahier des charges est basé sur l'analyse de l'application Flutter existante. Les développeurs web doivent s'assurer de maintenir la cohérence avec l'API backend existante et l'expérience utilisateur de l'application mobile.
