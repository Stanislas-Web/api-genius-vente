const axios = require('axios');

// Configuration
const BASE_URL = 'http://24.199.107.106:8000/api/v1';

// Données de test pour la connexion
const testCredentials = {
  phone: '+243856016607',
  password: '1234'
};

let authToken = '';
let companyId = '';
let classroomId = '';
let studentId = '';

// Fonction pour se connecter
async function login() {
  try {
    console.log('🔐 Connexion...');
    const response = await axios.post(`${BASE_URL}/login`, testCredentials);
    
    if (response.data.token) {
      authToken = response.data.token;
      companyId = response.data.data.companyId._id;
      console.log('✅ Connexion réussie');
      console.log('👤 Utilisateur:', response.data.data.username);
      console.log('🏢 Company ID:', companyId);
      return true;
    } else {
      console.log('❌ Échec de la connexion:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.response?.data || error.message);
    return false;
  }
}

// Test 1: Récupérer toutes les classes (pour avoir un classroomId)
async function getClassrooms() {
  try {
    console.log('\n📚 Récupération des classes...');
    const response = await axios.get(`${BASE_URL}/classrooms`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.classrooms.length > 0) {
      classroomId = response.data.classrooms[0]._id;
      console.log(`✅ Classe sélectionnée: ${response.data.classrooms[0].name} (ID: ${classroomId})`);
    }
    
    return response.data.classrooms;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des classes:', error.response?.data || error.message);
    return [];
  }
}

// Test 2: Récupérer tous les élèves
async function getAllStudents() {
  try {
    console.log('\n👥 Test 1: Récupérer TOUS les élèves');
    console.log('GET /api/v1/students');
    
    const response = await axios.get(`${BASE_URL}/students`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Succès!');
    console.log('📊 Total élèves:', response.data.pagination.total);
    console.log('📄 Page actuelle:', response.data.pagination.page);
    console.log('📋 Nombre d\'élèves sur cette page:', response.data.students.length);
    
    if (response.data.students.length > 0) {
      studentId = response.data.students[0]._id;
      console.log('🎯 Premier élève:', response.data.students[0].lastName, response.data.students[0].firstName);
      console.log('🆔 ID du premier élève:', studentId);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return null;
  }
}

// Test 3: Récupérer tous les élèves avec pagination
async function getAllStudentsWithPagination() {
  try {
    console.log('\n👥 Test 2: Récupérer les élèves avec pagination');
    console.log('GET /api/v1/students?page=1&limit=5');
    
    const response = await axios.get(`${BASE_URL}/students?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Succès!');
    console.log('📊 Pagination:', response.data.pagination);
    console.log('📋 Élèves sur cette page:', response.data.students.length);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return null;
  }
}

// Test 4: Récupérer tous les élèves avec filtres
async function getAllStudentsWithFilters() {
  try {
    console.log('\n👥 Test 3: Récupérer les élèves avec filtres');
    console.log('GET /api/v1/students?status=actif&schoolYear=2025-2026');
    
    const response = await axios.get(`${BASE_URL}/students?status=actif&schoolYear=2025-2026`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Succès!');
    console.log('📊 Élèves actifs en 2025-2026:', response.data.pagination.total);
    console.log('📋 Élèves sur cette page:', response.data.students.length);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return null;
  }
}

// Test 5: Recherche textuelle
async function searchStudents() {
  try {
    console.log('\n🔍 Test 4: Recherche textuelle');
    console.log('GET /api/v1/students?q=KABILA');
    
    const response = await axios.get(`${BASE_URL}/students?q=KABILA`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Succès!');
    console.log('📊 Résultats pour "KABILA":', response.data.pagination.total);
    console.log('📋 Élèves trouvés:', response.data.students.length);
    
    if (response.data.students.length > 0) {
      console.log('👤 Premier résultat:', response.data.students[0].lastName, response.data.students[0].firstName);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return null;
  }
}

// Test 6: Récupérer un élève par ID
async function getStudentById() {
  if (!studentId) {
    console.log('\n⚠️ Pas d\'ID d\'élève pour tester getById');
    return false;
  }

  try {
    console.log('\n👤 Test 5: Récupérer un élève par ID');
    console.log(`GET /api/v1/students/${studentId}`);
    
    const response = await axios.get(`${BASE_URL}/students/${studentId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Succès!');
    console.log('👤 Élève trouvé:', response.data.student.lastName, response.data.student.firstName);
    console.log('🆔 Matricule:', response.data.student.matricule);
    console.log('📅 Année scolaire:', response.data.student.schoolYear);
    console.log('📚 Classe:', response.data.student.classroomId?.name || 'N/A');
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return null;
  }
}

// Test 7: Récupérer les élèves d'une classe spécifique
async function getStudentsByClassroom() {
  if (!classroomId) {
    console.log('\n⚠️ Pas d\'ID de classe pour tester getByClassroom');
    return false;
  }

  try {
    console.log('\n📚 Test 6: Récupérer les élèves d\'une classe spécifique');
    console.log(`GET /api/v1/students/classroom/${classroomId}`);
    
    const response = await axios.get(`${BASE_URL}/students/classroom/${classroomId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Succès!');
    console.log('📚 Classe:', response.data.classroom.name);
    console.log('📊 Nombre d\'élèves dans cette classe:', response.data.pagination.total);
    console.log('📋 Élèves sur cette page:', response.data.students.length);
    
    if (response.data.students.length > 0) {
      console.log('👤 Premier élève de la classe:', response.data.students[0].lastName, response.data.students[0].firstName);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return null;
  }
}

// Test 8: Récupérer les élèves d'une classe avec filtres
async function getStudentsByClassroomWithFilters() {
  if (!classroomId) {
    console.log('\n⚠️ Pas d\'ID de classe pour tester getByClassroom avec filtres');
    return false;
  }

  try {
    console.log('\n📚 Test 7: Récupérer les élèves d\'une classe avec filtres');
    console.log(`GET /api/v1/students/classroom/${classroomId}?status=actif&limit=3`);
    
    const response = await axios.get(`${BASE_URL}/students/classroom/${classroomId}?status=actif&limit=3`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Succès!');
    console.log('📚 Classe:', response.data.classroom.name);
    console.log('📊 Élèves actifs dans cette classe:', response.data.pagination.total);
    console.log('📋 Élèves sur cette page (limite 3):', response.data.students.length);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return null;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Test de tous les endpoints d\'affichage des élèves');
  console.log('====================================================');
  
  // 1. Connexion
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Impossible de continuer sans connexion');
    return;
  }
  
  // 2. Récupérer les classes
  await getClassrooms();
  
  // 3. Tous les tests d'affichage
  await getAllStudents();
  await getAllStudentsWithPagination();
  await getAllStudentsWithFilters();
  await searchStudents();
  await getStudentById();
  await getStudentsByClassroom();
  await getStudentsByClassroomWithFilters();
  
  console.log('\n🎉 Tous les tests terminés!');
  
  console.log('\n📋 RÉSUMÉ DES ENDPOINTS D\'AFFICHAGE:');
  console.log('=====================================');
  console.log('1. GET /api/v1/students - Tous les élèves');
  console.log('2. GET /api/v1/students?page=1&limit=20 - Avec pagination');
  console.log('3. GET /api/v1/students?status=actif - Avec filtres');
  console.log('4. GET /api/v1/students?q=recherche - Recherche textuelle');
  console.log('5. GET /api/v1/students/{id} - Un élève par ID');
  console.log('6. GET /api/v1/students/classroom/{classroomId} - Élèves d\'une classe');
  console.log('7. GET /api/v1/students/classroom/{classroomId}?status=actif - Classe avec filtres');
}

// Exécution
main().catch(console.error);
