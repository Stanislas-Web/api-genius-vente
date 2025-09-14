const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1';

async function loginAndGetToken() {
  console.log('🔐 Connexion...\n');
  
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
    console.log('👤 Utilisateur:', response.data.data.username);
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

async function getAllClassrooms(token, companyId) {
  console.log('\n📚 Récupération des classes pour l\'entreprise...\n');
  
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
        if (classroom.sectionId) {
          console.log(`   📂 Section ID: ${classroom.sectionId}`);
        }
        if (classroom.optionId) {
          console.log(`   🎯 Option ID: ${classroom.optionId}`);
        }
        console.log(`   📅 Créé le: ${new Date(classroom.createdAt).toLocaleString('fr-FR')}`);
        console.log('─'.repeat(80));
      });
      
      console.log('\n📈 Informations de pagination:');
      console.log(`   📄 Page actuelle: ${response.data.pagination.page}`);
      console.log(`   📊 Éléments par page: ${response.data.pagination.limit}`);
      console.log(`   📈 Total d'éléments: ${response.data.pagination.total}`);
      console.log(`   📚 Nombre de pages: ${response.data.pagination.pages}`);
    } else {
      console.log('ℹ️ Aucune classe trouvée pour cette entreprise.');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des classes:', error.response?.data || error.message);
    return null;
  }
}

async function getClassroomsWithFilters(token) {
  console.log('\n🔍 Test avec filtres...\n');
  
  const filters = [
    { name: 'Toutes les classes', params: {} },
    { name: 'Classes actives uniquement', params: { active: 'true' } },
    { name: 'Année scolaire 2025-2026', params: { schoolYear: '2025-2026' } },
    { name: 'Recherche "6ème"', params: { q: '6ème' } }
  ];

  for (const filter of filters) {
    console.log(`\n🧪 ${filter.name}:`);
    
    try {
      const queryParams = new URLSearchParams(filter.params).toString();
      const url = `${BASE_URL}/classrooms${queryParams ? '?' + queryParams : ''}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`   📊 Résultats: ${response.data.classrooms.length} classe(s) trouvée(s)`);
      
      if (response.data.classrooms.length > 0) {
        response.data.classrooms.forEach(classroom => {
          console.log(`   - ${classroom.name} (${classroom.schoolYear})`);
        });
      }
    } catch (error) {
      console.error(`   ❌ Erreur:`, error.response?.data?.message || error.message);
    }
  }
}

async function getClassroomById(token, classroomId) {
  console.log(`\n🔍 Récupération de la classe par ID: ${classroomId}\n`);
  
  try {
    const response = await axios.get(`${BASE_URL}/classrooms/${classroomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Classe récupérée avec succès!');
    const classroom = response.data.classroom;
    
    console.log('📋 Détails de la classe:');
    console.log('─'.repeat(50));
    console.log(`🆔 ID: ${classroom._id}`);
    console.log(`📚 Nom: ${classroom.name}`);
    console.log(`📅 Année scolaire: ${classroom.schoolYear}`);
    console.log(`📊 Niveau: ${classroom.level || 'Non spécifié'}`);
    console.log(`👥 Capacité: ${classroom.capacity || 0} élèves`);
    console.log(`✅ Statut: ${classroom.active ? 'Actif' : 'Inactif'}`);
    console.log(`🏢 Company ID: ${classroom.companyId}`);
    if (classroom.sectionId) {
      console.log(`📂 Section ID: ${classroom.sectionId}`);
    }
    if (classroom.optionId) {
      console.log(`🎯 Option ID: ${classroom.optionId}`);
    }
    console.log(`📅 Créé le: ${new Date(classroom.createdAt).toLocaleString('fr-FR')}`);
    console.log(`📅 Modifié le: ${new Date(classroom.updatedAt).toLocaleString('fr-FR')}`);
    console.log('─'.repeat(50));
    
    return classroom;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error.response?.data || error.message);
    return null;
  }
}

async function runClassroomTests() {
  console.log('🎬 Test des classes par utilisateur connecté\n');
  
  // 1. Connexion
  const authData = await loginAndGetToken();
  if (!authData) {
    console.log('❌ Impossible de se connecter. Arrêt du test.');
    return;
  }

  // 2. Récupération de toutes les classes
  const classroomsData = await getAllClassrooms(authData.token, authData.companyId);
  
  // 3. Test avec filtres
  await getClassroomsWithFilters(authData.token);
  
  // 4. Test récupération par ID (si des classes existent)
  if (classroomsData && classroomsData.classrooms.length > 0) {
    const firstClassroomId = classroomsData.classrooms[0]._id;
    await getClassroomById(authData.token, firstClassroomId);
  }
  
  console.log('\n🏁 Tests terminés!');
}

runClassroomTests().catch(console.error);
