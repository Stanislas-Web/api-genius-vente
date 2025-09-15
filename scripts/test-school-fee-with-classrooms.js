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

async function getClassrooms() {
  try {
    const { token } = await login();
    
    const response = await axios.get(`${API_BASE_URL}/classrooms`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data.classrooms;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des classes:', error.response?.data || error.message);
    throw error;
  }
}

async function testCreateSchoolFeeWithClassrooms() {
  try {
    console.log('🔐 Connexion...');
    const { token, companyId } = await login();
    
    console.log('✅ Connexion réussie');
    console.log('🏢 Company ID:', companyId);
    
    // Récupérer les classes disponibles
    console.log('\n📚 Récupération des classes...');
    const classrooms = await getClassrooms();
    console.log('✅ Classes récupérées:', classrooms.length);
    
    if (classrooms.length === 0) {
      console.log('❌ Aucune classe trouvée. Impossible de tester.');
      return;
    }
    
    // Afficher les classes disponibles
    console.log('\n📋 Classes disponibles:');
    classrooms.forEach((classroom, index) => {
      console.log(`   ${index + 1}. ${classroom.name} (${classroom.code}) - ID: ${classroom._id}`);
    });
    
    // Test 1: Créer un frais pour une seule classe
    console.log('\n📝 Test 1: Créer un frais pour une seule classe');
    
    const singleClassroomId = classrooms[0]._id;
    const minervalData = {
      label: "Minerval Mensuel - 6ème",
      code: "MIN_6EME", // Champ requis sur le serveur distant
      periodicity: "mensuel",
      schoolYear: "2025-2026",
      currency: "CDF",
      allowCustomAmount: false,
      fixedAmount: 50000,
      min: 0,
      max: 0,
      classroomIds: [singleClassroomId]
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
    
    // Test 2: Créer un frais pour plusieurs classes
    console.log('\n📝 Test 2: Créer un frais pour plusieurs classes');
    
    const multipleClassroomIds = classrooms.slice(0, Math.min(3, classrooms.length)).map(c => c._id);
    const inscriptionData = {
      label: "Frais d'inscription - Classes supérieures",
      code: "INS_SUP",
      periodicity: "unique",
      schoolYear: "2025-2026",
      currency: "CDF",
      allowCustomAmount: true,
      fixedAmount: 0,
      min: 15000,
      max: 50000,
      classroomIds: multipleClassroomIds
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
    
    // Test 3: Tester la validation (sans classroomIds)
    console.log('\n📝 Test 3: Tester la validation (sans classroomIds)');
    
    const invalidData = {
      label: "Frais sans classe",
      code: "INVALID",
      periodicity: "mensuel",
      schoolYear: "2025-2026",
      fixedAmount: 25000
      // Pas de classroomIds
    };
    
    try {
      await axios.post(`${API_BASE_URL}/school-fees`, invalidData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('❌ ERREUR: Le frais a été créé sans classroomIds !');
    } catch (error) {
      console.log('✅ SUCCÈS: La validation a bien rejeté le frais sans classroomIds');
      console.log('📋 Erreur:', error.response?.data?.message || error.message);
    }
    
    // Test 4: Lister les frais par classe
    console.log('\n📋 Test 4: Lister les frais par classe');
    
    const classroomId = classrooms[0]._id;
    const listResponse = await axios.get(`${API_BASE_URL}/school-fees?classroomId=${classroomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Frais de la classe récupérés !');
    console.log('📊 Nombre de frais pour cette classe:', listResponse.data.schoolFees.length);
    
    listResponse.data.schoolFees.forEach((fee, index) => {
      console.log(`\n📋 Frais ${index + 1}:`);
      console.log(`   - Label: ${fee.label}`);
      console.log(`   - Code: ${fee.code}`);
      console.log(`   - Classes: ${fee.classroomIds ? fee.classroomIds.length : 0} classe(s)`);
    });
    
    console.log('\n🎉 Tous les tests sont passés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

// Lancer le test
testCreateSchoolFeeWithClassrooms();
