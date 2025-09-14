const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1';

async function loginWithSpecificUser() {
  console.log('🔐 Connexion avec le compte spécifique...\n');
  
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
    console.log('👤 Utilisateur:', response.data.data.username);
    console.log('📱 Téléphone:', response.data.data.phone);
    console.log('🔑 Rôle:', response.data.data.role);
    console.log('🏢 Entreprise:', response.data.data.companyId.name);
    console.log('🆔 Company ID:', response.data.data.companyId._id);
    console.log('🔑 Token reçu:', response.data.token ? 'Oui' : 'Non');
    
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

async function getClassroomsForThisUser(token, companyId) {
  console.log('\n📚 Récupération des classes pour cette entreprise...\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/classrooms`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Classes récupérées avec succès!');
    console.log('📊 Nombre total de classes:', response.data.classrooms.length);
    
    if (response.data.classrooms.length > 0) {
      console.log('\n📋 Liste des classes:');
      console.log('─'.repeat(80));
      
      response.data.classrooms.forEach((classroom, index) => {
        console.log(`${index + 1}. ${classroom.name}`);
        console.log(`   🆔 ID: ${classroom._id}`);
        console.log(`   📅 Année scolaire: ${classroom.schoolYear}`);
        console.log(`   📊 Niveau: ${classroom.level || 'Non spécifié'}`);
        console.log(`   👥 Capacité: ${classroom.capacity || 0} élèves`);
        console.log(`   ✅ Statut: ${classroom.active ? 'Actif' : 'Inactif'}`);
        console.log(`   🏢 Company ID: ${classroom.companyId}`);
        console.log(`   📅 Créé le: ${new Date(classroom.createdAt).toLocaleString('fr-FR')}`);
        console.log('─'.repeat(80));
      });
    } else {
      console.log('ℹ️ Aucune classe trouvée pour cette entreprise.');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des classes:', error.response?.data || error.message);
    return null;
  }
}

async function getSectionsForThisUser(token) {
  console.log('\n📂 Récupération des sections pour cette entreprise...\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/sections`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Sections récupérées avec succès!');
    console.log('📊 Nombre total de sections:', response.data.data.length);
    
    if (response.data.data.length > 0) {
      console.log('\n📋 Liste des sections:');
      console.log('─'.repeat(60));
      
      response.data.data.forEach((section, index) => {
        console.log(`${index + 1}. ${section.name}`);
        console.log(`   🆔 ID: ${section._id}`);
        console.log(`   ✅ Statut: ${section.active ? 'Actif' : 'Inactif'}`);
        console.log(`   🏢 Company ID: ${section.companyId}`);
        console.log(`   📅 Créé le: ${new Date(section.createdAt).toLocaleString('fr-FR')}`);
        console.log('─'.repeat(60));
      });
    } else {
      console.log('ℹ️ Aucune section trouvée pour cette entreprise.');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des sections:', error.response?.data || error.message);
    return null;
  }
}

async function getOptionsForThisUser(token) {
  console.log('\n🎯 Récupération des options pour cette entreprise...\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/options`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Options récupérées avec succès!');
    console.log('📊 Nombre total d\'options:', response.data.data.length);
    
    if (response.data.data.length > 0) {
      console.log('\n📋 Liste des options:');
      console.log('─'.repeat(70));
      
      response.data.data.forEach((option, index) => {
        console.log(`${index + 1}. ${option.name}`);
        console.log(`   🆔 ID: ${option._id}`);
        console.log(`   🏷️ Code: ${option.code || 'Non spécifié'}`);
        console.log(`   ✅ Statut: ${option.active ? 'Actif' : 'Inactif'}`);
        console.log(`   🏢 Company ID: ${option.companyId}`);
        if (option.sectionId) {
          console.log(`   📂 Section ID: ${option.sectionId}`);
        }
        console.log(`   📅 Créé le: ${new Date(option.createdAt).toLocaleString('fr-FR')}`);
        console.log('─'.repeat(70));
      });
    } else {
      console.log('ℹ️ Aucune option trouvée pour cette entreprise.');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des options:', error.response?.data || error.message);
    return null;
  }
}

async function runSpecificUserTest() {
  console.log('🎬 Test avec le compte spécifique\n');
  
  // 1. Connexion
  const authData = await loginWithSpecificUser();
  if (!authData) {
    console.log('❌ Impossible de se connecter. Arrêt du test.');
    return;
  }

  // 2. Récupération des classes
  await getClassroomsForThisUser(authData.token, authData.companyId);
  
  // 3. Récupération des sections
  await getSectionsForThisUser(authData.token);
  
  // 4. Récupération des options
  await getOptionsForThisUser(authData.token);
  
  console.log('\n🏁 Test terminé!');
}

runSpecificUserTest().catch(console.error);

