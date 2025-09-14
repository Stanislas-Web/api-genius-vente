const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:8000/api/v1';

// Test simple avec un token mock (pour tester la structure)
async function testOptionStructure() {
  console.log('🧪 Test de la structure d\'option\n');
  
  const testData = {
    name: 'Test Option',
    code: 'TEST-001',
    sectionId: '507f1f77bcf86cd799439011'
  };

  console.log('📝 Données de test:');
  console.log(JSON.stringify(testData, null, 2));

  try {
    // Test sans token (pour voir l'erreur d'auth)
    console.log('\n🔒 Test sans authentification (devrait échouer):');
    const response = await axios.post(`${BASE_URL}/options`, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Inattendu: Option créée sans auth');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Erreur d\'authentification comme attendu');
      console.log('📄 Message:', error.response.data.message);
    } else {
      console.log('❌ Erreur inattendue:', error.response?.data || error.message);
    }
  }

  try {
    // Test avec token invalide
    console.log('\n🔑 Test avec token invalide:');
    const response = await axios.post(`${BASE_URL}/options`, testData, {
      headers: {
        'Authorization': 'Bearer invalid-token',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Inattendu: Option créée avec token invalide');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Erreur d\'authentification comme attendu');
      console.log('📄 Message:', error.response.data.message);
    } else {
      console.log('❌ Erreur inattendue:', error.response?.data || error.message);
    }
  }
}

// Test de validation des données
async function testDataValidation() {
  console.log('\n📋 Test de validation des données\n');

  const testCases = [
    {
      name: 'Données complètes',
      data: {
        name: 'Mathématiques',
        code: 'MATH-001',
        sectionId: '507f1f77bcf86cd799439011'
      }
    },
    {
      name: 'Seulement nom (requis)',
      data: {
        name: 'Physique'
      }
    },
    {
      name: 'Nom avec code',
      data: {
        name: 'Chimie',
        code: 'CHIM-001'
      }
    },
    {
      name: 'Nom avec sectionId',
      data: {
        name: 'Biologie',
        sectionId: '507f1f77bcf86cd799439011'
      }
    },
    {
      name: 'Sans nom (devrait échouer)',
      data: {
        code: 'INVALID-001'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Test: ${testCase.name}`);
    console.log('📝 Données:', JSON.stringify(testCase.data, null, 2));
    
    try {
      const response = await axios.post(`${BASE_URL}/options`, testCase.data, {
        headers: {
          'Authorization': 'Bearer mock-token',
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Succès inattendu');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('🔒 Erreur d\'authentification (normal)');
      } else if (error.response?.status === 400) {
        console.log('⚠️ Erreur de validation (attendu pour certains cas)');
        console.log('📄 Message:', error.response.data.message);
      } else {
        console.log('❌ Autre erreur:', error.response?.data || error.message);
      }
    }
  }
}

async function runTests() {
  console.log('🎬 Test de structure des options\n');
  
  await testOptionStructure();
  await testDataValidation();
  
  console.log('\n🏁 Tests terminés!');
  console.log('\n📝 Pour tester avec un vrai token, vous devez:');
  console.log('1. Créer un utilisateur de test');
  console.log('2. Se connecter pour obtenir un token');
  console.log('3. Utiliser ce token dans les headers Authorization');
}

// Exécution des tests
runTests().catch(console.error);

