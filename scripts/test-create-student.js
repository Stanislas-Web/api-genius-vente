const axios = require('axios');

// Configuration
const BASE_URL = 'http://24.199.107.106:8000/api/v1';

// Données de test pour la connexion
const testCredentials = {
  phone: '+243856016607',
  password: '1234'
};

let authToken = '';
let companyId = '';
let classroomId = '';

// Fonction pour se connecter
async function login() {
  try {
    console.log('🔐 Connexion...');
    const response = await axios.post(`${BASE_URL}/login`, testCredentials);
    
    if (response.data.token) {
      authToken = response.data.token;
      companyId = response.data.data.companyId._id;
      console.log('✅ Connexion réussie');
      console.log('👤 Utilisateur:', response.data.data.username);
      console.log('🏢 Company ID:', companyId);
      return true;
    } else {
      console.log('❌ Échec de la connexion:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.response?.data || error.message);
    return false;
  }
}

// Récupérer les classes disponibles
async function getClassrooms() {
  try {
    console.log('\n📚 Récupération des classes...');
    const response = await axios.get(`${BASE_URL}/classrooms`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Classes récupérées:', response.data.classrooms.length);
    
    if (response.data.classrooms.length > 0) {
      console.log('\n📋 Classes disponibles:');
      response.data.classrooms.forEach((classroom, index) => {
        console.log(`${index + 1}. ${classroom.name} (ID: ${classroom._id})`);
        console.log(`   Année: ${classroom.schoolYear}`);
        console.log(`   Niveau: ${classroom.level || 'Non spécifié'}`);
      });
      
      // Prendre la première classe pour le test
      classroomId = response.data.classrooms[0]._id;
      console.log(`\n🎯 Classe sélectionnée pour le test: ${response.data.classrooms[0].name}`);
    }
    
    return response.data.classrooms;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des classes:', error.response?.data || error.message);
    return [];
  }
}

// Créer un élève
async function createStudent() {
  if (!classroomId) {
    console.log('❌ Aucune classe disponible pour créer un élève');
    return false;
  }

  try {
    console.log('\n👨‍🎓 Création d\'un nouvel élève...');
    
    const studentData = {
      lastName: 'KABILA',
      firstName: 'Junior',
      middleName: 'Joseph',
      gender: 'M',
      birthDate: '2010-05-15',
      parent: {
        name: 'Papa KABILA',
        phone: '+243123456789',
        email: 'papa.kabila@example.com'
      },
      classroomId: classroomId,
      schoolYear: '2025-2026'
    };
    
    console.log('📝 Données de l\'élève:');
    console.log(JSON.stringify(studentData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/students`, studentData, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Élève créé avec succès!');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    return response.data.student;
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'élève:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('Détails:', error.response?.data);
    return false;
  }
}

// Créer un élève avec matricule personnalisé
async function createStudentWithCustomMatricule() {
  if (!classroomId) {
    console.log('❌ Aucune classe disponible pour créer un élève');
    return false;
  }

  try {
    console.log('\n👩‍🎓 Création d\'un élève avec matricule personnalisé...');
    
    const studentData = {
      matricule: 'ELV-123456',
      lastName: 'MULAMBA',
      firstName: 'Sarah',
      gender: 'F',
      birthDate: '2009-08-20',
      parent: {
        name: 'Maman MULAMBA',
        phone: '+243987654321'
      },
      classroomId: classroomId
      // schoolYear sera déduit de la classe
    };
    
    console.log('📝 Données de l\'élève:');
    console.log(JSON.stringify(studentData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/students`, studentData, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Élève créé avec succès!');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    return response.data.student;
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'élève:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('Détails:', error.response?.data);
    return false;
  }
}

// Lister tous les élèves
async function getAllStudents() {
  try {
    console.log('\n📋 Liste de tous les élèves...');
    const response = await axios.get(`${BASE_URL}/students`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Élèves récupérés:', response.data.pagination.total);
    
    if (response.data.students.length > 0) {
      console.log('\n👥 Liste des élèves:');
      response.data.students.forEach((student, index) => {
        console.log(`${index + 1}. ${student.lastName} ${student.firstName} (${student.matricule})`);
        console.log(`   Classe: ${student.classroomId?.name || 'N/A'}`);
        console.log(`   Genre: ${student.gender}`);
        console.log(`   Statut: ${student.status}`);
      });
    }
    
    return response.data.students;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des élèves:', error.response?.data || error.message);
    return [];
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Test de création d\'élève');
  console.log('============================');
  
  // 1. Connexion
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Impossible de continuer sans connexion');
    return;
  }
  
  // 2. Récupérer les classes
  await getClassrooms();
  
  // 3. Créer un élève (matricule auto-généré)
  await createStudent();
  
  // 4. Créer un élève avec matricule personnalisé
  await createStudentWithCustomMatricule();
  
  // 5. Lister tous les élèves
  await getAllStudents();
  
  console.log('\n🎉 Tests terminés!');
}

// Exécution
main().catch(console.error);
