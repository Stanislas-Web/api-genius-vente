const axios = require('axios');

const API_BASE_URL = 'http://24.199.107.106:8000/api/v1';

async function login() {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      phone: '+243856016607',
      password: '1234'
    });
    
    return {
      token: response.data.token,
      companyId: response.data.data.companyId._id
    };
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.response?.data || error.message);
    throw error;
  }
}

async function testCreateSchoolFeeWithCode() {
  try {
    console.log('🔐 Connexion...');
    const { token, companyId } = await login();
    
    console.log('✅ Connexion réussie');
    console.log('🏢 Company ID:', companyId);
    
    // Test: Créer un frais scolaire AVEC le champ code (ancien format)
    console.log('\n📝 Test: Créer un frais scolaire avec le champ "code" (ancien format)');
    
    const schoolFeeData = {
      label: "Minerval Mensuel",
      code: "MIN", // Champ code requis sur le serveur distant
      periodicity: "mensuel",
      schoolYear: "2025-2026",
      currency: "CDF",
      allowCustomAmount: false,
      fixedAmount: 50000,
      min: 0,
      max: 0
    };
    
    console.log('📤 Données envoyées:', JSON.stringify(schoolFeeData, null, 2));
    
    const createResponse = await axios.post(`${API_BASE_URL}/school-fees`, schoolFeeData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Frais scolaire créé avec succès !');
    console.log('📋 Réponse:', JSON.stringify(createResponse.data, null, 2));
    
    const schoolFeeId = createResponse.data.schoolFee._id;
    
    // Récupérer le frais créé
    console.log('\n📖 Récupérer le frais créé');
    
    const getResponse = await axios.get(`${API_BASE_URL}/school-fees/${schoolFeeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Frais scolaire récupéré !');
    console.log('📋 Réponse:', JSON.stringify(getResponse.data, null, 2));
    
    console.log('\n🎉 Test réussi ! Le serveur distant fonctionne encore avec l\'ancien format.');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

// Lancer le test
testCreateSchoolFeeWithCode();
