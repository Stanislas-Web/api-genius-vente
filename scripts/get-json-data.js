const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1';

async function loginAndGetToken() {
  console.log('🔐 Connexion...\n');
  
  const loginData = {
    phone: '+243856016607',
    password: '1234'
  };

  try {
    const response = await axios.post(`${BASE_URL}/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Connexion réussie!');
    console.log('🔑 Token:', response.data.token);
    console.log('👤 Utilisateur:', response.data.data.username);
    console.log('🏢 Entreprise:', response.data.data.companyId.name);
    console.log('🆔 Company ID:', response.data.data.companyId._id);
    
    return {
      token: response.data.token,
      companyId: response.data.data.companyId._id,
      user: response.data.data
    };
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.response?.data || error.message);
    return null;
  }
}

async function getClassroomsJSON(token) {
  console.log('\n📚 JSON des Classes:\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/classrooms`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📋 Réponse JSON complète des classes:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return null;
  }
}

async function getSectionsJSON(token) {
  console.log('\n📂 JSON des Sections:\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/sections`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📋 Réponse JSON complète des sections:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return null;
  }
}

async function getOptionsJSON(token) {
  console.log('\n🎯 JSON des Options:\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/options`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📋 Réponse JSON complète des options:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return null;
  }
}

async function getClassroomByIdJSON(token, classroomId) {
  console.log(`\n🔍 JSON de la classe par ID (${classroomId}):\n`);
  
  try {
    const response = await axios.get(`${BASE_URL}/classrooms/${classroomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📋 Réponse JSON complète de la classe:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    return null;
  }
}

async function runJSONTests() {
  console.log('🎬 Test des réponses JSON\n');
  
  // 1. Connexion
  const authData = await loginAndGetToken();
  if (!authData) {
    console.log('❌ Impossible de se connecter. Arrêt du test.');
    return;
  }

  // 2. Récupération des classes en JSON
  const classroomsData = await getClassroomsJSON(authData.token);
  
  // 3. Récupération des sections en JSON
  await getSectionsJSON(authData.token);
  
  // 4. Récupération des options en JSON
  await getOptionsJSON(authData.token);
  
  // 5. Récupération d'une classe spécifique en JSON
  if (classroomsData && classroomsData.classrooms.length > 0) {
    const firstClassroomId = classroomsData.classrooms[0]._id;
    await getClassroomByIdJSON(authData.token, firstClassroomId);
  }
  
  console.log('\n🏁 Tests JSON terminés!');
}

runJSONTests().catch(console.error);

