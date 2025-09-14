# Documentation API - Gestion des Élèves

## 🎯 Endpoint Principal
**POST** `/api/v1/students`

## 🔐 Authentification
```http
Authorization: Bearer <token>
Content-Type: application/json
```

## 📋 Champs Requis vs Optionnels

### ✅ Champs Obligatoires
- `lastName` (string) - Nom de famille
- `firstName` (string) - Prénom  
- `gender` (string) - Genre : "M" ou "F"
- `classroomId` (string) - ID de la classe (ObjectId)

### 🔧 Champs Optionnels
- `matricule` (string) - Matricule personnalisé (auto-généré si absent)
- `middleName` (string) - Nom du milieu
- `birthDate` (string) - Date de naissance (format: "YYYY-MM-DD")
- `schoolYear` (string) - Année scolaire (déduite de la classe si absent)
- `tuteur` (object) - Informations du tuteur
  - `name` (string) - Nom du tuteur
  - `phone` (string) - Téléphone du tuteur

## 📝 Exemples de Requêtes

### 1. Création Simple (Minimum Requis)
```json
{
  "lastName": "KABILA",
  "firstName": "Junior",
  "gender": "M",
  "classroomId": "68c5f1a1c380a4440b3a5a71"
}
```

### 2. Création Complète
```json
{
  "lastName": "KABILA",
  "firstName": "Junior",
  "middleName": "Joseph",
  "gender": "M",
  "birthDate": "2010-05-15",
  "tuteur": {
    "name": "Papa KABILA",
    "phone": "+243123456789"
  },
  "classroomId": "68c5f1a1c380a4440b3a5a71",
  "schoolYear": "2025-2026"
}
```

### 3. Avec Matricule Personnalisé
```json
{
  "matricule": "ELV-123456",
  "lastName": "MULAMBA",
  "firstName": "Sarah",
  "gender": "F",
  "birthDate": "2009-08-20",
  "tuteur": {
    "name": "Maman MULAMBA",
    "phone": "+243987654321"
  },
  "classroomId": "68c5f1a1c380a4440b3a5a71"
}
```

## 📤 Réponse de Succès (201)
```json
{
  "message": "Élève créé avec succès",
  "student": {
    "companyId": "68bb29a00d5827da1df4f4e5",
    "matricule": "ELV-749932",
    "lastName": "KABILA",
    "middleName": "Joseph",
    "firstName": "Junior",
    "gender": "M",
    "birthDate": "2010-05-15T00:00:00.000Z",
    "tuteur": {
      "name": "Papa KABILA",
      "phone": "+243123456789"
    },
    "classroomId": "68c5f1a1c380a4440b3a5a71",
    "schoolYear": "2025-2026",
    "status": "actif",
    "_id": "68c6b09236895040caedcdec",
    "createdAt": "2025-09-14T12:09:54.794Z",
    "updatedAt": "2025-09-14T12:09:54.794Z"
  }
}
```

## ❌ Réponses d'Erreur

### 400 - Données Invalides
```json
{
  "message": "Classe non trouvée ou ne vous appartient pas"
}
```

### 400 - Matricule Existant
```json
{
  "message": "Ce matricule existe déjà"
}
```

### 500 - Erreur Serveur
```json
{
  "message": "Erreur lors de la création de l'élève",
  "error": "Détails de l'erreur"
}
```

## 🔧 Fonctionnalités Automatiques

1. **Génération de Matricule** : Si `matricule` n'est pas fourni, un matricule unique est généré automatiquement (format: `ELV-XXXXXX`)

2. **Année Scolaire** : Si `schoolYear` n'est pas fourni, elle est déduite automatiquement de la classe sélectionnée

3. **Statut** : Le statut est automatiquement défini sur "actif" pour les nouveaux élèves

4. **Validation de Classe** : Le système vérifie que la classe appartient à la même entreprise que l'utilisateur connecté

## 📱 Exemple d'Implémentation Frontend (JavaScript)

```javascript
// Fonction pour créer un élève
async function createStudent(studentData) {
  try {
    const response = await fetch('http://24.199.107.106:8000/api/v1/students', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(studentData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Élève créé:', result.student);
      return result.student;
    } else {
      const error = await response.json();
      console.error('Erreur:', error.message);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Erreur de création:', error);
    throw error;
  }
}

// Exemple d'utilisation
const newStudent = {
  lastName: "KABILA",
  firstName: "Junior",
  gender: "M",
  classroomId: "68c5f1a1c380a4440b3a5a71",
  tuteur: {
    name: "Papa KABILA",
    phone: "+243123456789"
  }
};

createStudent(newStudent)
  .then(student => {
    console.log('Élève créé avec succès:', student);
  })
  .catch(error => {
    console.error('Erreur:', error.message);
  });
```

## 📱 Exemple d'Implémentation Frontend (Flutter/Dart)

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class StudentService {
  static const String baseUrl = 'http://24.199.107.106:8000/api/v1';
  
  Future<Map<String, dynamic>> createStudent({
    required String authToken,
    required String lastName,
    required String firstName,
    required String gender,
    required String classroomId,
    String? middleName,
    String? birthDate,
    Map<String, String>? parent,
    String? schoolYear,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/students'),
        headers: {
          'Authorization': 'Bearer $authToken',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'lastName': lastName,
          'firstName': firstName,
          'gender': gender,
          'classroomId': classroomId,
          if (middleName != null) 'middleName': middleName,
          if (birthDate != null) 'birthDate': birthDate,
          if (parent != null) 'parent': parent,
          if (schoolYear != null) 'schoolYear': schoolYear,
        }),
      );

      if (response.statusCode == 201) {
        final result = jsonDecode(response.body);
        print('Élève créé: ${result['student']['matricule']}');
        return result;
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['message'] ?? 'Erreur de création');
      }
    } catch (e) {
      print('Erreur: $e');
      rethrow;
    }
  }
}

// Exemple d'utilisation
final studentService = StudentService();

try {
  final result = await studentService.createStudent(
    authToken: 'your_auth_token',
    lastName: 'KABILA',
    firstName: 'Junior',
    gender: 'M',
    classroomId: '68c5f1a1c380a4440b3a5a71',
    tuteur: {
      'name': 'Papa KABILA',
      'phone': '+243123456789',
    },
  );
  print('Élève créé: ${result['student']['matricule']}');
} catch (e) {
  print('Erreur: $e');
}
```

## 🔍 Autres Endpoints Utiles

### Lister les Classes (pour le formulaire)
```http
GET /api/v1/classrooms
Authorization: Bearer <token>
```

### Lister les Élèves
```http
GET /api/v1/students
Authorization: Bearer <token>
```

### Récupérer un Élève par ID
```http
GET /api/v1/students/{id}
Authorization: Bearer <token>
```

### Mettre à Jour un Élève
```http
PUT /api/v1/students/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

### Transférer un Élève
```http
POST /api/v1/students/{id}/move
Authorization: Bearer <token>
Content-Type: application/json
```

## 📋 Notes Importantes

1. **Authentification** : Tous les endpoints nécessitent un token d'authentification valide
2. **CompanyId** : Le système utilise automatiquement le companyId de l'utilisateur connecté
3. **Validation** : La classe doit appartenir à la même entreprise que l'utilisateur
4. **Matricule Unique** : Chaque matricule doit être unique dans le système
5. **Format de Date** : Utilisez le format ISO 8601 pour les dates (YYYY-MM-DD)
6. **⚠️ Changement Important** : Le champ `parent` a été remplacé par `tuteur`. L'ancien format sera rejeté avec une erreur 400
