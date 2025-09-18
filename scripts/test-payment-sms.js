const axios = require('axios');

// Script de test pour l'envoi de SMS de confirmation de paiement
async function testPaymentSMS() {
  console.log('🧪 Test de l\'envoi de SMS de confirmation de paiement...\n');

  // Données de test
  const testData = {
    studentName: 'Jean KABONGO',
    amount: 50000,
    currency: 'CDF',
    phone: '+243826016607' // Numéro fourni par l'utilisateur
  };

  const url = 'https://nmlygy.api.infobip.com/sms/2/text/advanced';
  
  const headers = {
    'Authorization': 'App d5819848b9e86ee925a9ec584c4d1d91-9ed8758c-2081-4ac2-9192-b2d136e782dd',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const message = `Confirmation de paiement: ${testData.studentName} a payé ${testData.amount} ${testData.currency}. Merci pour votre confiance.`;
  
  const body = {
    messages: [
      {
        destinations: [{ to: testData.phone }],
        from: '447491163443',
        text: message,
      },
    ],
  };

  console.log('📱 Données du SMS:');
  console.log(`   Destinataire: ${testData.phone}`);
  console.log(`   Message: ${message}`);
  console.log(`   Expéditeur: 447491163443\n`);

  try {
    console.log('📤 Envoi du SMS en cours...');
    const response = await axios.post(url, body, { headers });
    
    console.log('✅ SMS envoyé avec succès!');
    console.log('📊 Réponse de l\'API:', JSON.stringify(response.data, null, 2));
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi du SMS:');
    console.error('   Status:', error.response?.status);
    console.error('   Data:', error.response?.data);
    console.error('   Message:', error.message);
    
    return { success: false, error: error.response?.data || error.message };
  }
}

// Fonction pour tester l'API de paiement complète
async function testPaymentAPI() {
  console.log('\n🧪 Test de l\'API de paiement avec envoi de SMS...\n');
  
  // Remplacez ces valeurs par des IDs réels de votre base de données
  const testPaymentData = {
    studentId: 'VOTRE_STUDENT_ID_ICI',
    schoolFeeId: 'VOTRE_SCHOOL_FEE_ID_ICI',
    amount: 25000,
    paymentMethod: 'cash',
    reference: 'TEST-SMS-' + Date.now(),
    notes: 'Test d\'envoi de SMS de confirmation'
  };

  console.log('📋 Données de test du paiement:');
  console.log(JSON.stringify(testPaymentData, null, 2));
  console.log('\n⚠️  Pour tester l\'API complète, vous devez:');
  console.log('   1. Remplacer les IDs par des valeurs réelles');
  console.log('   2. Avoir un token d\'authentification valide');
  console.log('   3. S\'assurer que l\'élève a un tuteur avec un numéro de téléphone');
  console.log('\n💡 Utilisez ce script pour tester uniquement l\'envoi de SMS:');
  console.log('   node scripts/test-payment-sms.js');
}

// Exécution du test
if (require.main === module) {
  testPaymentSMS()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Test réussi! L\'envoi de SMS fonctionne correctement.');
      } else {
        console.log('\n💥 Test échoué. Vérifiez la configuration de l\'API SMS.');
      }
    })
    .catch(error => {
      console.error('\n💥 Erreur inattendue:', error);
    });
}

module.exports = { testPaymentSMS, testPaymentAPI };
