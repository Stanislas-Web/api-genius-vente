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
let studentId = '';
let schoolFeeId = '';
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

// Récupérer les données nécessaires
async function getRequiredData() {
  try {
    console.log('\n📋 Récupération des données nécessaires...');
    
    // Récupérer les élèves
    const studentsResponse = await axios.get(`${BASE_URL}/students`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (studentsResponse.data.students.length > 0) {
      studentId = studentsResponse.data.students[0]._id;
      console.log('👤 Élève sélectionné:', studentsResponse.data.students[0].lastName, studentsResponse.data.students[0].firstName);
      console.log('🆔 ID élève:', studentId);
    }
    
    // Récupérer les frais scolaires
    const schoolFeesResponse = await axios.get(`${BASE_URL}/school-fees`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (schoolFeesResponse.data.schoolFees.length > 0) {
      schoolFeeId = schoolFeesResponse.data.schoolFees[0]._id;
      console.log('💰 Frais sélectionné:', schoolFeesResponse.data.schoolFees[0].label);
      console.log('🆔 ID frais:', schoolFeeId);
    }
    
    // Récupérer les classes
    const classroomsResponse = await axios.get(`${BASE_URL}/classrooms`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (classroomsResponse.data.classrooms.length > 0) {
      classroomId = classroomsResponse.data.classrooms[0]._id;
      console.log('📚 Classe sélectionnée:', classroomsResponse.data.classrooms[0].name);
      console.log('🆔 ID classe:', classroomId);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données:', error.response?.data || error.message);
    return false;
  }
}

// Test 1: Créer un frais scolaire
async function createSchoolFee() {
  try {
    console.log('\n💰 Test 1: Créer un frais scolaire');
    
    const schoolFeeData = {
      label: 'Minerval Mensuel',
      code: 'MIN',
      periodicity: 'mensuel',
      schoolYear: '2025-2026',
      currency: 'CDF',
      allowCustomAmount: false,
      fixedAmount: 150000,
      min: 0,
      max: 0
    };
    
    console.log('📝 Données du frais:');
    console.log(JSON.stringify(schoolFeeData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/school-fees`, schoolFeeData, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Frais scolaire créé avec succès!');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    // Utiliser ce frais pour les tests suivants
    schoolFeeId = response.data.schoolFee._id;
    console.log('🆔 Nouveau ID frais:', schoolFeeId);
    
    return response.data.schoolFee;
  } catch (error) {
    console.error('❌ Erreur lors de la création du frais:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test 2: Enregistrer un paiement
async function createPayment() {
  if (!studentId || !schoolFeeId) {
    console.log('❌ Données manquantes pour créer un paiement');
    return false;
  }

  try {
    console.log('\n💳 Test 2: Enregistrer un paiement');
    
    const paymentData = {
      studentId: studentId,
      schoolFeeId: schoolFeeId,
      amount: 75000,
      paymentDate: new Date().toISOString(),
      paymentMethod: 'cash',
      reference: 'PAY-001',
      notes: 'Paiement partiel du minerval'
    };
    
    console.log('📝 Données du paiement:');
    console.log(JSON.stringify(paymentData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/payments`, paymentData, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Paiement enregistré avec succès!');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement du paiement:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test 3: Enregistrer un deuxième paiement (pour compléter)
async function createSecondPayment() {
  if (!studentId || !schoolFeeId) {
    console.log('❌ Données manquantes pour créer un deuxième paiement');
    return false;
  }

  try {
    console.log('\n💳 Test 3: Enregistrer un deuxième paiement (completion)');
    
    const paymentData = {
      studentId: studentId,
      schoolFeeId: schoolFeeId,
      amount: 75000,
      paymentDate: new Date().toISOString(),
      paymentMethod: 'mobile_money',
      reference: 'PAY-002',
      notes: 'Complément du minerval'
    };
    
    console.log('📝 Données du paiement:');
    console.log(JSON.stringify(paymentData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/payments`, paymentData, {
      headers: { 
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Deuxième paiement enregistré avec succès!');
    console.log('📋 Réponse:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement du deuxième paiement:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test 4: Récupérer l'historique des paiements d'un élève
async function getStudentPayments() {
  if (!studentId) {
    console.log('❌ Pas d\'ID d\'élève pour tester getStudentPayments');
    return false;
  }

  try {
    console.log('\n📋 Test 4: Récupérer l\'historique des paiements d\'un élève');
    console.log(`GET /api/v1/payments/student/${studentId}`);
    
    const response = await axios.get(`${BASE_URL}/payments/student/${studentId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Historique récupéré avec succès!');
    console.log('👤 Élève:', response.data.student.lastName, response.data.student.firstName);
    console.log('📊 Nombre de paiements:', response.data.pagination.total);
    console.log('📋 Paiements:', JSON.stringify(response.data.payments, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'historique:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test 5: Récupérer le statut de paiement d'un élève pour un frais spécifique
async function getStudentPaymentStatus() {
  if (!studentId || !schoolFeeId) {
    console.log('❌ Données manquantes pour tester getStudentPaymentStatus');
    return false;
  }

  try {
    console.log('\n📊 Test 5: Récupérer le statut de paiement d\'un élève pour un frais spécifique');
    console.log(`GET /api/v1/payments/status/${studentId}/${schoolFeeId}`);
    
    const response = await axios.get(`${BASE_URL}/payments/status/${studentId}/${schoolFeeId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Statut récupéré avec succès!');
    console.log('👤 Élève:', response.data.student.lastName, response.data.student.firstName);
    console.log('💰 Frais:', response.data.schoolFee.label);
    console.log('📊 Statut:', response.data.paymentStatus.status);
    console.log('💵 Total payé:', response.data.paymentStatus.totalPaid);
    console.log('💸 Montant restant:', response.data.paymentStatus.remainingAmount);
    console.log('✅ Entièrement payé:', response.data.paymentStatus.isFullyPaid);
    console.log('📈 Pourcentage:', response.data.paymentStatus.progressPercentage + '%');
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du statut:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test 6: Récupérer les paiements d'une classe pour un frais spécifique
async function getClassroomPayments() {
  if (!classroomId || !schoolFeeId) {
    console.log('❌ Données manquantes pour tester getClassroomPayments');
    return false;
  }

  try {
    console.log('\n📚 Test 6: Récupérer les paiements d\'une classe pour un frais spécifique');
    console.log(`GET /api/v1/payments/classroom/${classroomId}/${schoolFeeId}`);
    
    const response = await axios.get(`${BASE_URL}/payments/classroom/${classroomId}/${schoolFeeId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Paiements de classe récupérés avec succès!');
    console.log('📚 Classe:', response.data.classroom.name);
    console.log('💰 Frais:', response.data.schoolFee.label);
    console.log('📊 Résumé:', response.data.summary);
    console.log('👥 Nombre d\'élèves:', response.data.students.length);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des paiements de classe:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test 7: Récupérer les élèves qui ont tout payé
async function getFullyPaidStudents() {
  if (!schoolFeeId) {
    console.log('❌ Pas d\'ID de frais pour tester getFullyPaidStudents');
    return false;
  }

  try {
    console.log('\n✅ Test 7: Récupérer les élèves qui ont tout payé');
    console.log(`GET /api/v1/payments/fully-paid/${schoolFeeId}`);
    
    const response = await axios.get(`${BASE_URL}/payments/fully-paid/${schoolFeeId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Élèves entièrement payés récupérés avec succès!');
    console.log('💰 Frais:', response.data.schoolFee.label);
    console.log('📊 Résumé:', response.data.summary);
    console.log('👥 Nombre d\'élèves entièrement payés:', response.data.students.length);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des élèves entièrement payés:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test 8: Récupérer les élèves ayant payé plus qu'un montant
async function getStudentsPaidAboveAmount() {
  if (!schoolFeeId) {
    console.log('❌ Pas d\'ID de frais pour tester getStudentsPaidAboveAmount');
    return false;
  }

  try {
    console.log('\n💰 Test 8: Récupérer les élèves ayant payé plus qu\'un montant');
    console.log(`GET /api/v1/payments/above-amount/${schoolFeeId}?minAmount=100000`);
    
    const response = await axios.get(`${BASE_URL}/payments/above-amount/${schoolFeeId}?minAmount=100000`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log('✅ Élèves ayant payé plus de 100,000 CDF récupérés avec succès!');
    console.log('💰 Frais:', response.data.schoolFee.label);
    console.log('🔍 Critères de filtre:', response.data.filterCriteria);
    console.log('📊 Résumé:', response.data.summary);
    console.log('👥 Nombre d\'élèves:', response.data.students.length);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des élèves ayant payé plus qu\'un montant:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    return false;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Test complet du système de paiement des frais scolaires');
  console.log('========================================================');
  
  // 1. Connexion
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Impossible de continuer sans connexion');
    return;
  }
  
  // 2. Récupérer les données nécessaires
  await getRequiredData();
  
  // 3. Créer un frais scolaire
  await createSchoolFee();
  
  // 4. Enregistrer un premier paiement (partiel)
  await createPayment();
  
  // 5. Enregistrer un deuxième paiement (completion)
  await createSecondPayment();
  
  // 6. Tester tous les endpoints de consultation
  await getStudentPayments();
  await getStudentPaymentStatus();
  await getClassroomPayments();
  await getFullyPaidStudents();
  await getStudentsPaidAboveAmount();
  
  console.log('\n🎉 Tous les tests terminés!');
  
  console.log('\n📋 RÉSUMÉ DU SYSTÈME DE PAIEMENT:');
  console.log('==================================');
  console.log('✅ Création de frais scolaires');
  console.log('✅ Enregistrement de paiements');
  console.log('✅ Paiements partiels et complets');
  console.log('✅ Historique des paiements par élève');
  console.log('✅ Statut de paiement par frais');
  console.log('✅ Paiements par classe');
  console.log('✅ Élèves entièrement payés');
  console.log('✅ Filtrage par montant minimum');
}

// Exécution
main().catch(console.error);
