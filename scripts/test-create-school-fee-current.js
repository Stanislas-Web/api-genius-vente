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

async function testCreateSchoolFee() {
  try {
    console.log('🔐 Connexion...');
    const { token, companyId } = await login();
    
    console.log('✅ Connexion réussie');
    console.log('🏢 Company ID:', companyId);
    
    // Test 1: Créer un Minerval mensuel
    console.log('\n📝 Test 1: Créer un Minerval mensuel');
    
    const minervalData = {
      label: "Minerval Mensuel",
      code: "MIN", // Champ requis sur le serveur distant
      periodicity: "mensuel",
      schoolYear: "2025-2026",
      currency: "CDF",
      allowCustomAmount: false,
      fixedAmount: 50000,
      min: 0,
      max: 0
    };
    
    console.log('📤 Données envoyées:', JSON.stringify(minervalData, null, 2));
    
    const minervalResponse = await axios.post(`${API_BASE_URL}/school-fees`, minervalData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Minerval créé avec succès !');
    console.log('📋 Réponse:', JSON.stringify(minervalResponse.data, null, 2));
    
    const minervalId = minervalResponse.data.schoolFee._id;
    
    // Test 2: Créer des frais d'inscription
    console.log('\n📝 Test 2: Créer des frais d\'inscription');
    
    const inscriptionData = {
      label: "Frais d'inscription",
      code: "INS",
      periodicity: "unique",
      schoolYear: "2025-2026",
      currency: "CDF",
      allowCustomAmount: true,
      fixedAmount: 0,
      min: 15000,
      max: 50000
    };
    
    console.log('📤 Données envoyées:', JSON.stringify(inscriptionData, null, 2));
    
    const inscriptionResponse = await axios.post(`${API_BASE_URL}/school-fees`, inscriptionData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Frais d\'inscription créés avec succès !');
    console.log('📋 Réponse:', JSON.stringify(inscriptionResponse.data, null, 2));
    
    const inscriptionId = inscriptionResponse.data.schoolFee._id;
    
    // Test 3: Créer des frais de transport
    console.log('\n📝 Test 3: Créer des frais de transport');
    
    const transportData = {
      label: "Frais de transport",
      code: "TRANS",
      periodicity: "mensuel",
      schoolYear: "2025-2026",
      currency: "CDF",
      allowCustomAmount: false,
      fixedAmount: 15000,
      min: 0,
      max: 0
    };
    
    console.log('📤 Données envoyées:', JSON.stringify(transportData, null, 2));
    
    const transportResponse = await axios.post(`${API_BASE_URL}/school-fees`, transportData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Frais de transport créés avec succès !');
    console.log('📋 Réponse:', JSON.stringify(transportResponse.data, null, 2));
    
    // Test 4: Lister tous les frais créés
    console.log('\n📋 Test 4: Lister tous les frais scolaires');
    
    const listResponse = await axios.get(`${API_BASE_URL}/school-fees?schoolYear=2025-2026`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Liste des frais récupérée !');
    console.log('📊 Nombre de frais:', listResponse.data.schoolFees.length);
    
    listResponse.data.schoolFees.forEach((fee, index) => {
      console.log(`\n📋 Frais ${index + 1}:`);
      console.log(`   - ID: ${fee._id}`);
      console.log(`   - Label: ${fee.label}`);
      console.log(`   - Code: ${fee.code}`);
      console.log(`   - Périodicité: ${fee.periodicity}`);
      console.log(`   - Montant fixe: ${fee.fixedAmount} ${fee.currency}`);
      console.log(`   - Montant personnalisé: ${fee.allowCustomAmount ? 'Oui' : 'Non'}`);
      if (fee.allowCustomAmount) {
        console.log(`   - Min: ${fee.min} ${fee.currency}`);
        console.log(`   - Max: ${fee.max} ${fee.currency}`);
      }
    });
    
    console.log('\n🎉 Tous les tests de création de frais scolaires sont passés avec succès !');
    
    // Retourner les IDs pour d'autres tests
    return {
      minervalId,
      inscriptionId,
      transportId: transportResponse.data.schoolFee._id
    };
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

// Lancer le test
testCreateSchoolFee();
