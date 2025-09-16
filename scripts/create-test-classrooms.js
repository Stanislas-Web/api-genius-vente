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

async function createTestClassrooms(token) {
  console.log('\n🚀 Création de classes de test...\n');
  
  const testClassrooms = [
    {
      name: '6ème A',
      level: '6ème',
      schoolYear: '2025-2026',
      capacity: 30
    },
    {
      name: '6ème B',
      level: '6ème',
      schoolYear: '2025-2026',
      capacity: 28
    },
    {
      name: '5ème A',
      level: '5ème',
      schoolYear: '2025-2026',
      capacity: 32
    },
    {
      name: '4ème Scientifique',
      level: '4ème',
      schoolYear: '2025-2026',
      capacity: 25
    },
    {
      name: '3ème Littéraire',
      level: '3ème',
      schoolYear: '2025-2026',
      capacity: 20
    },
    {
      name: 'Seconde A',
      level: 'Seconde',
      schoolYear: '2025-2026',
      capacity: 35
    },
    {
      name: 'Première C',
      level: 'Première',
      schoolYear: '2025-2026',
      capacity: 30
    },
    {
      name: 'Terminale D',
      level: 'Terminale',
      schoolYear: '2025-2026',
      capacity: 25
    }
  ];

  const createdClassrooms = [];

  for (const classroomData of testClassrooms) {
    console.log(`📚 Création: ${classroomData.name}...`);
    
    try {
      const response = await axios.post(`${BASE_URL}/classrooms`, classroomData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ ${classroomData.name} créée avec succès!`);
      console.log(`   🆔 ID: ${response.data.classroom._id}`);
      createdClassrooms.push(response.data.classroom);
    } catch (error) {
      console.error(`❌ Erreur pour ${classroomData.name}:`, error.response?.data?.message || error.message);
    }
  }

  return createdClassrooms;
}

async function displayCreatedClassrooms(classrooms) {
  console.log('\n📋 Résumé des classes créées:\n');
  
  if (classrooms.length > 0) {
    console.log('─'.repeat(80));
    classrooms.forEach((classroom, index) => {
      console.log(`${index + 1}. ${classroom.name}`);
      console.log(`   🆔 ID: ${classroom._id}`);
      console.log(`   📅 Année: ${classroom.schoolYear}`);
      console.log(`   📊 Niveau: ${classroom.level}`);
      console.log(`   👥 Capacité: ${classroom.capacity} élèves`);
      console.log(`   ✅ Statut: ${classroom.active ? 'Actif' : 'Inactif'}`);
      console.log('─'.repeat(80));
    });
    
    console.log(`\n🎉 Total: ${classrooms.length} classe(s) créée(s) avec succès!`);
  } else {
    console.log('❌ Aucune classe créée.');
  }
}

async function runCreateTestClassrooms() {
  console.log('🎬 Création de classes de test\n');
  
  // 1. Connexion
  const authData = await loginAndGetToken();
  if (!authData) {
    console.log('❌ Impossible de se connecter. Arrêt du test.');
    return;
  }

  // 2. Création des classes
  const createdClassrooms = await createTestClassrooms(authData.token);
  
  // 3. Affichage du résumé
  await displayCreatedClassrooms(createdClassrooms);
  
  console.log('\n🏁 Création terminée!');
}

runCreateTestClassrooms().catch(console.error);



