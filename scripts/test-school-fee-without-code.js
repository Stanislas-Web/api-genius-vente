const axios = require('axios');

const API_BASE_URL = 'http://24.199.107.106:8000/api/v1';

async function login() {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      phone: '+243856016607',
      password: '1234'
    });
    
    console.log('🔍 Structure de la réponse:', JSON.stringify(response.data, null, 2));
    
    return {
      token: response.data.token,
      companyId: response.data.data.companyId._id
    };
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.response?.data || error.message);
    throw error;
  }
}

async function testCreateSchoolFeeWithoutCode() {
  try {
    console.log('🔐 Connexion...');
    const { token, companyId } = await login();
    
    console.log('✅ Connexion réussie');
    console.log('🏢 Company ID:', companyId);
    
    // Test 1: Créer un frais scolaire SANS le champ code
    console.log('\n📝 Test 1: Créer un frais scolaire sans le champ "code"');
    
    const schoolFeeData = {
      label: "Minerval Mensuel",
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
    
    // Test 2: Récupérer le frais créé
    console.log('\n📖 Test 2: Récupérer le frais créé');
    
    const getResponse = await axios.get(`${API_BASE_URL}/school-fees/${schoolFeeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Frais scolaire récupéré !');
    console.log('📋 Réponse:', JSON.stringify(getResponse.data, null, 2));
    
    // Vérifier qu'il n'y a pas de champ "code"
    if (getResponse.data.schoolFee.code) {
      console.log('❌ ERREUR: Le champ "code" est encore présent !');
    } else {
      console.log('✅ SUCCÈS: Le champ "code" a bien été supprimé !');
    }
    
    // Test 3: Lister tous les frais
    console.log('\n📋 Test 3: Lister tous les frais scolaires');
    
    const listResponse = await axios.get(`${API_BASE_URL}/school-fees`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Liste des frais récupérée !');
    console.log('📊 Nombre de frais:', listResponse.data.schoolFees.length);
    
    // Vérifier qu'aucun frais n'a de champ "code"
    const hasCodeField = listResponse.data.schoolFees.some(fee => fee.code !== undefined);
    if (hasCodeField) {
      console.log('❌ ERREUR: Certains frais ont encore le champ "code" !');
    } else {
      console.log('✅ SUCCÈS: Aucun frais n\'a le champ "code" !');
    }
    
    console.log('\n🎉 Tous les tests sont passés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

// Lancer le test
testCreateSchoolFeeWithoutCode();
