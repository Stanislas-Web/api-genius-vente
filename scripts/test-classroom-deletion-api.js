const axios = require('axios');

// Configuration
const BASE_URL = 'http://24.199.107.106:8000/api/v1';
const CLASSROOM_ID = '68c5f392c380a4440b3a5a97';

// Fonction pour se connecter et obtenir un token
async function loginAndGetToken() {
  try {
    console.log('\n🔐 Connexion utilisateur...');
    
    // Essayer plusieurs combinaisons de connexion
    const loginAttempts = [
      { phone: '+243856016607', password: '1234' },
      { phone: '243856016607', password: '1234' },
      { phone: '+243856016607', password: 'password123' },
      { phone: '243856016607', password: 'password123' }
    ];
    
    for (const attempt of loginAttempts) {
      try {
        console.log(`   Tentative avec ${attempt.phone} / ${attempt.password}`);
        const response = await axios.post(`${BASE_URL}/login`, attempt);
        
        const { token, data } = response.data;
        console.log('✅ Connexion réussie');
        console.log('👤 Utilisateur:', data.username);
        console.log('🏢 Company ID:', data.companyId._id);
        
        return { token, companyId: data.companyId._id, user: data };
      } catch (error) {
        console.log(`   ❌ Échec: ${error.response?.data?.message || error.message}`);
        continue;
      }
    }
    
    console.log('❌ Toutes les tentatives de connexion ont échoué');
    return null;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    return null;
  }
}

// Tester l'endpoint GET pour récupérer la classe
async function testGetClassroom(token, companyId) {
  try {
    console.log('\n🔍 Test GET /classrooms/{id}...');
    console.log(`   URL: ${BASE_URL}/classrooms/${CLASSROOM_ID}`);
    
    const response = await axios.get(`${BASE_URL}/classrooms/${CLASSROOM_ID}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'x-company-id': companyId
      }
    });
    
    console.log('✅ GET réussi:');
    console.log('   📋 Classe trouvée:', response.data.classroom?.name);
    console.log('   🏢 Company ID:', response.data.classroom?.companyId);
    console.log('   📅 Année scolaire:', response.data.classroom?.schoolYear);
    return true;
  } catch (error) {
    console.error('❌ GET échoué:');
    console.error('   Status:', error.response?.status);
    console.error('   Message:', error.response?.data?.message || error.message);
    return false;
  }
}

// Tester l'endpoint DELETE
async function testDeleteClassroom(token, companyId) {
  try {
    console.log('\n🗑️ Test DELETE /classrooms/{id}...');
    console.log(`   URL: ${BASE_URL}/classrooms/${CLASSROOM_ID}`);
    
    const response = await axios.delete(`${BASE_URL}/classrooms/${CLASSROOM_ID}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'x-company-id': companyId
      }
    });
    
    console.log('✅ DELETE réussi:');
    console.log('   Message:', response.data.message);
    return true;
  } catch (error) {
    console.error('❌ DELETE échoué:');
    console.error('   Status:', error.response?.status);
    console.error('   Message:', error.response?.data?.message || error.message);
    return false;
  }
}

// Lister toutes les classes de l'entreprise
async function listAllClassrooms(token, companyId) {
  try {
    console.log('\n📋 Liste de toutes les classes de l\'entreprise...');
    
    const response = await axios.get(`${BASE_URL}/classrooms`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'x-company-id': companyId
      }
    });
    
    const classrooms = response.data.classrooms || [];
    console.log('📊 Nombre total de classes:', classrooms.length);
    
    if (classrooms.length > 0) {
      console.log('📝 Classes trouvées:');
      classrooms.forEach((classroom, index) => {
        const isTarget = classroom._id === CLASSROOM_ID;
        console.log(`   ${index + 1}. ${classroom.name} (ID: ${classroom._id}) ${isTarget ? '🎯' : ''}`);
        console.log(`      Company: ${classroom.companyId}`);
        console.log(`      Année: ${classroom.schoolYear}`);
      });
    }
    
    return classrooms;
  } catch (error) {
    console.error('❌ Erreur lors de la liste des classes:', error.response?.data || error.message);
    return [];
  }
}

// Tester avec différents headers
async function testWithDifferentHeaders(token, companyId) {
  console.log('\n🧪 Test avec différents headers...');
  
  const headerVariations = [
    { name: 'Avec Authorization + x-company-id', headers: { Authorization: `Bearer ${token}`, 'x-company-id': companyId } },
    { name: 'Avec Authorization seulement', headers: { Authorization: `Bearer ${token}` } },
    { name: 'Avec x-company-id seulement', headers: { 'x-company-id': companyId } }
  ];
  
  for (const variation of headerVariations) {
    try {
      console.log(`\n   Test: ${variation.name}`);
      const response = await axios.get(`${BASE_URL}/classrooms/${CLASSROOM_ID}`, {
        headers: variation.headers
      });
      console.log('   ✅ Succès:', response.data.classroom?.name);
    } catch (error) {
      console.log('   ❌ Échec:', error.response?.status, error.response?.data?.message);
    }
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Test de suppression de classe via API');
  console.log('==========================================');
  console.log('🎯 Classe cible: 6ème C (ID: ' + CLASSROOM_ID + ')');
  console.log('🌐 URL de base:', BASE_URL);
  
  // 1. Se connecter et obtenir un token
  const authData = await loginAndGetToken();
  if (!authData) {
    console.log('❌ Impossible de continuer sans authentification');
    return;
  }
  
  const { token, companyId, user } = authData;
  
  // 2. Lister toutes les classes
  const allClassrooms = await listAllClassrooms(token, companyId);
  
  // 3. Tester avec différents headers
  await testWithDifferentHeaders(token, companyId);
  
  // 4. Tester GET
  const getSuccess = await testGetClassroom(token, companyId);
  
  // 5. Tester DELETE seulement si GET fonctionne
  if (getSuccess) {
    await testDeleteClassroom(token, companyId);
  } else {
    console.log('⚠️ Skip DELETE test car GET a échoué');
  }
  
  // 6. Résumé du diagnostic
  console.log('\n📊 RÉSUMÉ DU DIAGNOSTIC');
  console.log('======================');
  console.log('🏢 Company ID utilisateur:', companyId);
  console.log('🔍 GET endpoint:', getSuccess ? 'FONCTIONNE' : 'ÉCHOUE');
  console.log('📋 Classes trouvées:', allClassrooms.length);
  
  const targetClassroom = allClassrooms.find(c => c._id === CLASSROOM_ID);
  if (targetClassroom) {
    console.log('🎯 Classe cible trouvée dans la liste');
    console.log('🏢 Company ID classe:', targetClassroom.companyId);
    console.log('🔗 Company IDs correspondent:', targetClassroom.companyId === companyId ? 'OUI' : 'NON');
  } else {
    console.log('❌ Classe cible NON trouvée dans la liste');
  }
  
  console.log('\n✅ Test terminé');
}

// Exécution
main().catch(console.error);
