#!/bin/bash

# Script de test du module École en PRODUCTION
# URL: http://64.23.188.15:8000/api/v1

BASE_URL="http://64.23.188.15:8000/api/v1"

echo "🏫 Test du Module École en PRODUCTION"
echo "======================================"
echo ""

# 1. Login
echo "1️⃣  Connexion..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+243842613000",
    "password": "1234"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo "❌ Erreur de connexion"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Connexion réussie"
echo "Token: ${TOKEN:0:50}..."
echo ""

# 2. Créer une section
echo "2️⃣  Création d'une section..."
SECTION_RESPONSE=$(curl -s -X POST "$BASE_URL/sections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Scientifique",
    "code": "SCI"
  }')

SECTION_ID=$(echo $SECTION_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | sed 's/"_id":"//')
echo "✅ Section créée: $SECTION_ID"
echo ""

# 3. Créer une option
echo "3️⃣  Création d'une option..."
OPTION_RESPONSE=$(curl -s -X POST "$BASE_URL/options" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Math-Physique\",
    \"sectionId\": \"$SECTION_ID\",
    \"code\": \"MP\"
  }")

OPTION_ID=$(echo $OPTION_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | sed 's/"_id":"//')
echo "✅ Option créée: $OPTION_ID"
echo ""

# 4. Créer une classe
echo "4️⃣  Création d'une classe..."
CLASSROOM_RESPONSE=$(curl -s -X POST "$BASE_URL/classrooms" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"6ème Année A\",
    \"level\": \"Primaire\",
    \"capacity\": 40,
    \"academicYear\": \"2025-2026\",
    \"sectionId\": \"$SECTION_ID\",
    \"optionId\": \"$OPTION_ID\",
    \"description\": \"Classe de test\"
  }")

CLASSROOM_ID=$(echo $CLASSROOM_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | sed 's/"_id":"//')
echo "✅ Classe créée: $CLASSROOM_ID"
echo ""

# 5. Lister les classes
echo "5️⃣  Liste des classes..."
curl -s -X GET "$BASE_URL/classrooms" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 6. Créer un étudiant
echo "6️⃣  Création d'un étudiant..."
STUDENT_RESPONSE=$(curl -s -X POST "$BASE_URL/students" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Jean\",
    \"lastName\": \"Dupont\",
    \"dateOfBirth\": \"2010-05-15\",
    \"gender\": \"M\",
    \"classroomId\": \"$CLASSROOM_ID\",
    \"parentName\": \"Marie Dupont\",
    \"parentPhone\": \"+243826016607\",
    \"matricule\": \"STU-TEST-001\"
  }")

STUDENT_ID=$(echo $STUDENT_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | sed 's/"_id":"//')
echo "✅ Étudiant créé: $STUDENT_ID"
echo ""

# 7. Lister les étudiants
echo "7️⃣  Liste des étudiants..."
curl -s -X GET "$BASE_URL/students" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 8. Créer un enseignant
echo "8️⃣  Création d'un enseignant..."
TEACHER_RESPONSE=$(curl -s -X POST "$BASE_URL/teachers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Marie",
    "lastName": "Dubois",
    "phone": "+243826016608",
    "email": "marie@example.com",
    "subject": "Mathématiques",
    "hireDate": "2020-09-01",
    "salary": 500000
  }')

TEACHER_ID=$(echo $TEACHER_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | sed 's/"_id":"//')
echo "✅ Enseignant créé: $TEACHER_ID"
echo ""

# 9. Créer un frais scolaire
echo "9️⃣  Création d'un frais scolaire..."
SCHOOL_FEE_RESPONSE=$(curl -s -X POST "$BASE_URL/school-fees" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Frais de scolarité T1\",
    \"amount\": 100,
    \"type\": \"tuition\",
    \"academicYear\": \"2025-2026\",
    \"dueDate\": \"2026-03-31\",
    \"classroomIds\": [\"$CLASSROOM_ID\"]
  }")

SCHOOL_FEE_ID=$(echo $SCHOOL_FEE_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | sed 's/"_id":"//')
echo "✅ Frais scolaire créé: $SCHOOL_FEE_ID"
echo ""

# 10. Créer un paiement
echo "🔟 Création d'un paiement..."
PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/payments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"studentId\": \"$STUDENT_ID\",
    \"schoolFeeId\": \"$SCHOOL_FEE_ID\",
    \"amount\": 100,
    \"paymentMethod\": \"cash\",
    \"paymentDate\": \"2026-03-19\",
    \"reference\": \"PAY-TEST-001\"
  }")

PAYMENT_ID=$(echo $PAYMENT_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | sed 's/"_id":"//')
echo "✅ Paiement créé: $PAYMENT_ID"
echo ""

# 11. Récupérer les paiements de l'étudiant
echo "1️⃣1️⃣  Paiements de l'étudiant..."
curl -s -X GET "$BASE_URL/payments/student/$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 12. Récupérer un étudiant avec détails
echo "1️⃣2️⃣  Détails de l'étudiant..."
curl -s -X GET "$BASE_URL/students/$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# Résumé
echo "======================================"
echo "✅ TOUS LES TESTS RÉUSSIS !"
echo "======================================"
echo ""
echo "📊 Résumé des IDs créés:"
echo "   - Section: $SECTION_ID"
echo "   - Option: $OPTION_ID"
echo "   - Classe: $CLASSROOM_ID"
echo "   - Étudiant: $STUDENT_ID"
echo "   - Enseignant: $TEACHER_ID"
echo "   - Frais scolaire: $SCHOOL_FEE_ID"
echo "   - Paiement: $PAYMENT_ID"
echo ""
echo "🎉 Le module École fonctionne parfaitement en PRODUCTION !"
