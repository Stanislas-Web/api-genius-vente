const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1';

// Données de test
const testCredentials = {
  phone: '+243856016607',
  password: '1234'
};

let authToken = '';
let testClassroomId = '';

async function login() {
  try {
    console.log('🔐 Connexion...');
    const response = await axios.post(`${BASE_URL}/auth/login`, testCredentials);
    
    if (response.data.token) {
      authToken = response.data.token;
      console.log('✅ Connexion réussie');
      console.log('👤 Utilisateur:', response.data.data.username);
      console.log('🏢 Société:', response.data.data.companyId.name);
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

async function testGetAllClassrooms() {
  try {
    console.log('\n📚 Test: Récupérer toutes les classes');
    const response = await axios.get(`${BASE_URL}/classrooms`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Succès - Toutes les classes:');
    console.log('📊 Total:', response.data.pagination.total);
    console.log('📄 Pages:', response.data.pagination.pages);
    console.log('📋 Classes:', JSON.stringify(response.data.classrooms, null, 2));
    
    // Sauvegarder l'ID de la première classe pour les tests suivants
    if (response.data.classrooms.length > 0) {
      testClassroomId = response.data.classrooms[0]._id;
      console.log('🆔 ID de classe sauvegardé:', testClassroomId);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return false;
  }
}

async function testCreateClassroom() {
  try {
    console.log('\n➕ Test: Créer une nouvelle classe');
    const classroomData = {
      name: 'Test Classe API',
      level: 'Test',
      schoolYear: '2025-2026',
      capacity: 30,
      active: true
    };
    
    const response = await axios.post(`${BASE_URL}/classrooms`, classroomData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Succès - Classe créée:');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    // Sauvegarder l'ID pour les tests de modification/suppression
    if (response.data.classroom) {
      testClassroomId = response.data.classroom._id;
      console.log('🆔 Nouvelle classe ID:', testClassroomId);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return false;
  }
}

async function testGetClassroomById() {
  if (!testClassroomId) {
    console.log('⚠️ Pas d\'ID de classe pour tester getById');
    return false;
  }
  
  try {
    console.log('\n🔍 Test: Récupérer classe par ID');
    const response = await axios.get(`${BASE_URL}/classrooms/${testClassroomId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Succès - Classe trouvée:');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return false;
  }
}

async function testUpdateClassroom() {
  if (!testClassroomId) {
    console.log('⚠️ Pas d\'ID de classe pour tester update');
    return false;
  }
  
  try {
    console.log('\n✏️ Test: Modifier une classe');
    const updateData = {
      name: 'Classe Modifiée API',
      capacity: 35
    };
    
    const response = await axios.put(`${BASE_URL}/classrooms/${testClassroomId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Succès - Classe modifiée:');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return false;
  }
}

async function testToggleClassroomActive() {
  if (!testClassroomId) {
    console.log('⚠️ Pas d\'ID de classe pour tester toggle');
    return false;
  }
  
  try {
    console.log('\n🔄 Test: Toggle statut actif');
    const response = await axios.patch(`${BASE_URL}/classrooms/${testClassroomId}/active`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Succès - Statut modifié:');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return false;
  }
}

async function testDeleteClassroom() {
  if (!testClassroomId) {
    console.log('⚠️ Pas d\'ID de classe pour tester delete');
    return false;
  }
  
  try {
    console.log('\n🗑️ Test: Supprimer une classe');
    const response = await axios.delete(`${BASE_URL}/classrooms/${testClassroomId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Succès - Classe supprimée:');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return false;
  }
}

async function testClassroomFilters() {
  try {
    console.log('\n🔍 Test: Filtres et recherche');
    
    // Test avec pagination
    console.log('📄 Test pagination...');
    const pageResponse = await axios.get(`${BASE_URL}/classrooms?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Pagination:', pageResponse.data.pagination);
    
    // Test avec recherche
    console.log('🔎 Test recherche...');
    const searchResponse = await axios.get(`${BASE_URL}/classrooms?q=6`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Recherche "6":', searchResponse.data.classrooms.length, 'résultats');
    
    // Test avec filtre actif
    console.log('✅ Test filtre actif...');
    const activeResponse = await axios.get(`${BASE_URL}/classrooms?active=true`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Classes actives:', activeResponse.data.classrooms.length);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur filtres:', error.response?.data || error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Démarrage des tests des endpoints Classroom\n');
  
  // Connexion
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Impossible de continuer sans connexion');
    return;
  }
  
  // Tests dans l'ordre
  await testGetAllClassrooms();
  await testCreateClassroom();
  await testGetClassroomById();
  await testUpdateClassroom();
  await testToggleClassroomActive();
  await testClassroomFilters();
  await testDeleteClassroom();
  
  console.log('\n🎉 Tous les tests terminés!');
}

// Exécuter les tests
runAllTests().catch(console.error);
