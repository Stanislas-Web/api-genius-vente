const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:8000/api/v1';
const TEST_CREDENTIALS = {
  email: 'test@example.com', // Remplacez par vos credentials de test
  password: 'password123'
};

let authToken = '';
let companyId = '';

async function login() {
  try {
    console.log('🔐 Connexion...');
    const response = await axios.post(`${BASE_URL}/login`, TEST_CREDENTIALS);
    
    if (response.data.token) {
      authToken = response.data.token;
      companyId = response.data.user.companyId;
      console.log('✅ Connexion réussie');
      console.log(`📊 Company ID: ${companyId}`);
      return true;
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.response?.data || error.message);
    return false;
  }
}

async function createOption(optionData) {
  try {
    console.log(`\n🚀 Création de l'option: ${optionData.name}`);
    
    const response = await axios.post(`${BASE_URL}/options`, optionData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Option créée avec succès!');
    console.log('📄 Réponse:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.response?.data || error.message);
    return null;
  }
}

async function testCreateOptions() {
  console.log('🧪 Test de création d\'options\n');
  
  // Test 1: Option simple (seulement nom)
  await createOption({
    name: 'Mathématiques'
  });

  // Test 2: Option avec code
  await createOption({
    name: 'Physique-Chimie',
    code: 'PC-001'
  });

  // Test 3: Option avec sectionId et code
  await createOption({
    name: 'Sciences de la Vie et de la Terre',
    code: 'SVT-001',
    sectionId: '507f1f77bcf86cd799439011' // ObjectId de test
  });

  // Test 4: Option avec tous les champs null (pour tester l'index)
  await createOption({
    name: 'Histoire-Géographie',
    code: null,
    sectionId: null
  });

  // Test 5: Duplicate avec les mêmes valeurs null (devrait échouer avant, maintenant devrait passer)
  await createOption({
    name: 'Philosophie',
    code: null,
    sectionId: null
  });

  console.log('\n🎯 Tests terminés!');
}

async function getAllOptions() {
  try {
    console.log('\n📋 Récupération de toutes les options...');
    
    const response = await axios.get(`${BASE_URL}/options`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Options récupérées:');
    console.log('📄 Réponse:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🎬 Début des tests d\'options\n');
  
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Impossible de se connecter. Vérifiez vos credentials.');
    return;
  }

  await testCreateOptions();
  await getAllOptions();
  
  console.log('\n🏁 Tests terminés!');
}

// Exécution des tests
runTests().catch(console.error);
