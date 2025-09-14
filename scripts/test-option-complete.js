const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1';

async function createTestCompany() {
  console.log('🏢 Création d\'une entreprise de test...\n');
  
  const companyData = {
    name: 'Test School',
    address: '123 Test Street',
    category: '68bb0e4a592180aafde59c0f', // ID de la catégorie "École"
    currency: 'XAF',
    signCurrency: 'FCFA',
    lang: 'fr',
    country: 'Cameroon'
  };

  try {
    const response = await axios.post(`${BASE_URL}/companies`, companyData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Entreprise créée avec succès!');
    console.log('📄 Company ID:', response.data.company._id);
    return response.data.company._id;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.message?.includes('déjà')) {
      console.log('ℹ️ Entreprise existe déjà');
      // Essayer de récupérer l'ID de l'entreprise existante
      return await findExistingCompany(companyData.phone);
    } else {
      console.error('❌ Erreur lors de la création:', error.response?.data || error.message);
      return null;
    }
  }
}

async function findExistingCompany(phone) {
  try {
    const response = await axios.get(`${BASE_URL}/companies`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const company = response.data.companies?.find(c => c.phone === phone);
    if (company) {
      console.log('📄 Company ID trouvé:', company._id);
      return company._id;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error.response?.data || error.message);
  }
  return null;
}

async function createTestUser(companyId) {
  console.log('\n👤 Création d\'un utilisateur de test...\n');
  
  const userData = {
    username: 'testuser',
    phone: '1234567890',
    password: 'test123',
    role: 'Admin',
    companyId: companyId
  };

  try {
    const response = await axios.post(`${BASE_URL}/signup`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Utilisateur créé avec succès!');
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
    console.log('🔑 Token reçu:', response.data.token ? 'Oui' : 'Non');
    console.log('📊 Company ID:', response.data.user?.companyId);
    
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

async function testCreateOptions(token) {
  console.log('\n🚀 Tests de création d\'options...\n');
  
  const testCases = [
    {
      name: 'Option simple',
      data: { name: 'Mathématiques' }
    },
    {
      name: 'Option avec code',
      data: { name: 'Physique', code: 'PHY-001' }
    },
    {
      name: 'Option avec sectionId',
      data: { name: 'Chimie', sectionId: '507f1f77bcf86cd799439011' }
    },
    {
      name: 'Option complète',
      data: { 
        name: 'Biologie', 
        code: 'BIO-001',
        sectionId: '507f1f77bcf86cd799439011'
      }
    },
    {
      name: 'Option avec valeurs null (test index)',
      data: { 
        name: 'Histoire',
        code: null,
        sectionId: null
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Test: ${testCase.name}`);
    console.log('📝 Données:', JSON.stringify(testCase.data, null, 2));
    
    try {
      const response = await axios.post(`${BASE_URL}/options`, testCase.data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Option créée avec succès!');
      console.log('📄 ID:', response.data.data._id);
    } catch (error) {
      console.error('❌ Erreur:', error.response?.data || error.message);
    }
  }
}

async function getAllOptions(token) {
  console.log('\n📋 Récupération de toutes les options...\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/options`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Options récupérées:');
    console.log('📊 Nombre total:', response.data.data?.length || 0);
    if (response.data.data?.length > 0) {
      console.log('📄 Première option:', response.data.data[0]);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error.response?.data || error.message);
  }
}

async function runCompleteTest() {
  console.log('🎬 Test complet de création d\'options\n');
  
  // 1. Créer une entreprise de test
  const companyId = await createTestCompany();
  if (!companyId) {
    console.log('❌ Impossible de créer/trouver une entreprise. Arrêt du test.');
    return;
  }

  // 2. Créer un utilisateur de test
  await createTestUser(companyId);
  
  // 3. Se connecter
  const authData = await loginTestUser();
  if (!authData) {
    console.log('❌ Impossible de se connecter. Arrêt du test.');
    return;
  }

  // 4. Tester la création d'options
  await testCreateOptions(authData.token);
  
  // 5. Récupérer toutes les options
  await getAllOptions(authData.token);
  
  console.log('\n🏁 Test terminé avec succès!');
}

runCompleteTest().catch(console.error);
