const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1';

async function createTestUser() {
  console.log('👤 Création d\'un utilisateur de test...\n');
  
  const userData = {
    phone: '1234567890',
    password: 'test123',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    role: 'Admin'
  };

  try {
    const response = await axios.post(`${BASE_URL}/signup`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Utilisateur créé avec succès!');
    console.log('📄 Réponse:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.message?.includes('déjà')) {
      console.log('ℹ️ Utilisateur existe déjà');
      return null;
    } else {
      console.error('❌ Erreur lors de la création:', error.response?.data || error.message);
      return null;
    }
  }
}

async function loginTestUser() {
  console.log('\n🔐 Connexion de l\'utilisateur de test...\n');
  
  const loginData = {
    phone: '1234567890',
    password: 'test123'
  };

  try {
    const response = await axios.post(`${BASE_URL}/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Connexion réussie!');
    console.log('🔑 Token:', response.data.token ? 'Reçu' : 'Non reçu');
    console.log('📊 Company ID:', response.data.user?.companyId || 'Non reçu');
    
    return {
      token: response.data.token,
      companyId: response.data.user?.companyId,
      user: response.data.user
    };
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.response?.data || error.message);
    return null;
  }
}

async function testCreateOptionWithAuth(token, companyId) {
  console.log('\n🚀 Test de création d\'option avec authentification...\n');
  
  const optionData = {
    name: 'Mathématiques Test',
    code: 'MATH-TEST-001',
    sectionId: null
  };

  try {
    const response = await axios.post(`${BASE_URL}/options`, optionData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Option créée avec succès!');
    console.log('📄 Réponse:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'option:', error.response?.data || error.message);
    return null;
  }
}

async function runFullTest() {
  console.log('🎬 Test complet de création d\'option\n');
  
  // 1. Créer un utilisateur de test
  await createTestUser();
  
  // 2. Se connecter
  const authData = await loginTestUser();
  if (!authData) {
    console.log('❌ Impossible de se connecter. Arrêt du test.');
    return;
  }

  // 3. Tester la création d'option
  await testCreateOptionWithAuth(authData.token, authData.companyId);
  
  console.log('\n🏁 Test terminé!');
}

runFullTest().catch(console.error);
