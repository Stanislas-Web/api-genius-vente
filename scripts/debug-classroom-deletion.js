const axios = require('axios');
const mongoose = require('mongoose');

// Configuration
const BASE_URL = 'http://24.199.107.106:8000/api/v1';
const CLASSROOM_ID = '68c5f392c380a4440b3a5a97';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/genius-vente';

// Connexion à MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
}

// Fonction pour se connecter et obtenir un token
async function loginAndGetToken() {
  try {
    console.log('\n🔐 Connexion utilisateur...');
    const response = await axios.post(`${BASE_URL}/login`, {
      phone: '243999999999', // Remplacez par un numéro valide
      password: 'password123' // Remplacez par un mot de passe valide
    });
    
    const { token, data } = response.data;
    console.log('✅ Connexion réussie');
    console.log('👤 Utilisateur:', data.username);
    console.log('🏢 Company ID:', data.companyId._id);
    
    return { token, companyId: data.companyId._id, user: data };
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.response?.data || error.message);
    return null;
  }
}

// Vérifier si la classe existe dans la base de données
async function checkClassroomInDB() {
  try {
    console.log('\n🔍 Vérification de la classe dans la base de données...');
    
    const { Classroom } = require('../models/classroom.model');
    
    // Recherche par ID seulement
    const classroomById = await Classroom.findById(CLASSROOM_ID);
    console.log('📋 Classe trouvée par ID:', classroomById ? 'OUI' : 'NON');
    
    if (classroomById) {
      console.log('📝 Détails de la classe:');
      console.log('   - ID:', classroomById._id);
      console.log('   - Nom:', classroomById.name);
      console.log('   - Company ID:', classroomById.companyId);
      console.log('   - Année scolaire:', classroomById.schoolYear);
      console.log('   - Actif:', classroomById.active);
    }
    
    // Recherche par nom
    const classroomByName = await Classroom.findOne({ name: '6 eme C' });
    console.log('📋 Classe trouvée par nom "6 eme C":', classroomByName ? 'OUI' : 'NON');
    
    if (classroomByName) {
      console.log('📝 Détails de la classe trouvée par nom:');
      console.log('   - ID:', classroomByName._id);
      console.log('   - Company ID:', classroomByName.companyId);
    }
    
    return classroomById;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification DB:', error);
    return null;
  }
}

// Tester l'endpoint GET pour récupérer la classe
async function testGetClassroom(token, companyId) {
  try {
    console.log('\n🔍 Test GET /classrooms/{id}...');
    
    const response = await axios.get(`${BASE_URL}/classrooms/${CLASSROOM_ID}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'x-company-id': companyId
      }
    });
    
    console.log('✅ GET réussi:', response.data);
    return true;
  } catch (error) {
    console.error('❌ GET échoué:', error.response?.status, error.response?.data);
    return false;
  }
}

// Tester l'endpoint DELETE
async function testDeleteClassroom(token, companyId) {
  try {
    console.log('\n🗑️ Test DELETE /classrooms/{id}...');
    
    const response = await axios.delete(`${BASE_URL}/classrooms/${CLASSROOM_ID}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'x-company-id': companyId
      }
    });
    
    console.log('✅ DELETE réussi:', response.data);
    return true;
  } catch (error) {
    console.error('❌ DELETE échoué:', error.response?.status, error.response?.data);
    return false;
  }
}

// Lister toutes les classes de l'entreprise
async function listAllClassrooms(token, companyId) {
  try {
    console.log('\n📋 Liste de toutes les classes de l\'entreprise...');
    
    const response = await axios.get(`${BASE_URL}/classrooms`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'x-company-id': companyId
      }
    });
    
    console.log('📊 Nombre total de classes:', response.data.pagination?.total || response.data.classrooms?.length);
    
    if (response.data.classrooms) {
      response.data.classrooms.forEach((classroom, index) => {
        console.log(`   ${index + 1}. ${classroom.name} (ID: ${classroom._id}) - Company: ${classroom.companyId}`);
      });
    }
    
    return response.data.classrooms;
  } catch (error) {
    console.error('❌ Erreur lors de la liste des classes:', error.response?.data || error.message);
    return [];
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Diagnostic de la suppression de classe');
  console.log('==========================================');
  console.log('🎯 Classe cible: 6ème C (ID: ' + CLASSROOM_ID + ')');
  
  await connectDB();
  
  // 1. Vérifier dans la base de données
  const classroomInDB = await checkClassroomInDB();
  
  // 2. Se connecter et obtenir un token
  const authData = await loginAndGetToken();
  if (!authData) {
    console.log('❌ Impossible de continuer sans authentification');
    return;
  }
  
  const { token, companyId, user } = authData;
  
  // 3. Lister toutes les classes
  const allClassrooms = await listAllClassrooms(token, companyId);
  
  // 4. Tester GET
  const getSuccess = await testGetClassroom(token, companyId);
  
  // 5. Tester DELETE seulement si GET fonctionne
  if (getSuccess) {
    await testDeleteClassroom(token, companyId);
  } else {
    console.log('⚠️ Skip DELETE test car GET a échoué');
  }
  
  // 6. Résumé du diagnostic
  console.log('\n📊 RÉSUMÉ DU DIAGNOSTIC');
  console.log('======================');
  console.log('🔍 Classe dans DB:', classroomInDB ? 'OUI' : 'NON');
  console.log('🏢 Company ID utilisateur:', companyId);
  console.log('🔍 GET endpoint:', getSuccess ? 'FONCTIONNE' : 'ÉCHOUE');
  
  if (classroomInDB) {
    console.log('🏢 Company ID classe:', classroomInDB.companyId);
    console.log('🔗 Company IDs correspondent:', classroomInDB.companyId.toString() === companyId ? 'OUI' : 'NON');
  }
  
  await mongoose.disconnect();
  console.log('\n✅ Diagnostic terminé');
}

// Exécution
main().catch(console.error);
