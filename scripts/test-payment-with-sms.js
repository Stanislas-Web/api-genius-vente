const axios = require('axios');

// Script pour tester l'API de paiement complète avec envoi de SMS
async function testPaymentWithSMS() {
  console.log('🧪 Test de l\'API de paiement avec envoi de SMS...\n');

  // Configuration - Remplacez par vos vraies valeurs
  const config = {
    baseURL: 'http://localhost:3000', // URL de votre API
    token: 'VOTRE_TOKEN_JWT_ICI', // Token d'authentification
    studentId: 'VOTRE_STUDENT_ID_ICI', // ID d'un élève avec tuteur
    schoolFeeId: 'VOTRE_SCHOOL_FEE_ID_ICI' // ID d'un frais scolaire
  };

  // Données du paiement de test
  const paymentData = {
    studentId: config.studentId,
    schoolFeeId: config.schoolFeeId,
    amount: 15000,
    paymentMethod: 'cash',
    reference: 'TEST-SMS-' + Date.now(),
    notes: 'Test d\'envoi de SMS de confirmation de paiement'
  };

  console.log('📋 Configuration:');
  console.log(`   API URL: ${config.baseURL}`);
  console.log(`   Student ID: ${config.studentId}`);
  console.log(`   School Fee ID: ${config.schoolFeeId}`);
  console.log(`   Montant: ${paymentData.amount} CDF\n`);

  console.log('📤 Envoi de la requête de paiement...');

  try {
    const response = await axios.post(`${config.baseURL}/api/payments`, paymentData, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Paiement enregistré avec succès!');
    console.log('📊 Réponse complète:');
    console.log(JSON.stringify(response.data, null, 2));

    // Vérifier si le SMS a été envoyé
    if (response.data.smsSent) {
      console.log('\n📱 SMS de confirmation envoyé avec succès!');
      console.log('📋 Détails du SMS:', response.data.smsDetails);
    } else {
      console.log('\n⚠️  SMS non envoyé. Vérifiez que l\'élève a un tuteur avec un numéro de téléphone.');
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement du paiement:');
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    } else {
      console.error('   Message:', error.message);
    }

    return { success: false, error: error.response?.data || error.message };
  }
}

// Fonction pour récupérer les informations d'un élève
async function getStudentInfo(studentId, token, baseURL) {
  try {
    const response = await axios.get(`${baseURL}/api/students/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des infos de l\'élève:', error.response?.data || error.message);
    return null;
  }
}

// Fonction pour lister les élèves avec tuteurs
async function listStudentsWithTutors(token, baseURL) {
  try {
    const response = await axios.get(`${baseURL}/api/students`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const studentsWithTutors = response.data.students.filter(student => 
      student.tuteur && student.tuteur.phone
    );
    
    return studentsWithTutors;
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves:', error.response?.data || error.message);
    return [];
  }
}

// Fonction pour lister les frais scolaires
async function listSchoolFees(token, baseURL) {
  try {
    const response = await axios.get(`${baseURL}/api/school-fees`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.schoolFees || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des frais scolaires:', error.response?.data || error.message);
    return [];
  }
}

// Fonction d'aide pour configurer le test
async function setupTest() {
  console.log('🔧 Configuration du test...\n');
  
  const config = {
    baseURL: 'http://localhost:3000',
    token: 'VOTRE_TOKEN_JWT_ICI'
  };

  console.log('📋 Étapes pour configurer le test:');
  console.log('   1. Remplacez VOTRE_TOKEN_JWT_ICI par un token valide');
  console.log('   2. Assurez-vous que votre serveur API est démarré');
  console.log('   3. Vérifiez que vous avez des élèves avec des tuteurs');
  console.log('   4. Vérifiez que vous avez des frais scolaires actifs\n');

  // Essayer de récupérer des données de test
  if (config.token !== 'VOTRE_TOKEN_JWT_ICI') {
    console.log('🔍 Recherche d\'élèves avec tuteurs...');
    const students = await listStudentsWithTutors(config.token, config.baseURL);
    
    if (students.length > 0) {
      console.log(`✅ Trouvé ${students.length} élève(s) avec tuteur(s):`);
      students.slice(0, 3).forEach((student, index) => {
        console.log(`   ${index + 1}. ${student.firstName} ${student.lastName} - Tuteur: ${student.tuteur.name} (${student.tuteur.phone})`);
      });
    } else {
      console.log('⚠️  Aucun élève avec tuteur trouvé');
    }

    console.log('\n🔍 Recherche de frais scolaires...');
    const schoolFees = await listSchoolFees(config.token, config.baseURL);
    
    if (schoolFees.length > 0) {
      console.log(`✅ Trouvé ${schoolFees.length} frais scolaire(s):`);
      schoolFees.slice(0, 3).forEach((fee, index) => {
        console.log(`   ${index + 1}. ${fee.label} - ${fee.amount} ${fee.currency}`);
      });
    } else {
      console.log('⚠️  Aucun frais scolaire trouvé');
    }
  }
}

// Exécution du script
if (require.main === module) {
  setupTest()
    .then(() => {
      console.log('\n💡 Pour exécuter le test complet, modifiez les valeurs dans le script et relancez-le.');
    })
    .catch(error => {
      console.error('\n💥 Erreur lors de la configuration:', error);
    });
}

module.exports = { 
  testPaymentWithSMS, 
  getStudentInfo, 
  listStudentsWithTutors, 
  listSchoolFees,
  setupTest 
};
