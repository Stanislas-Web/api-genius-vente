const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/v1';

// Script pour envoyer un SMS de confirmation avec les vraies données
async function sendRealPaymentSMS() {
  console.log('🧪 Envoi de SMS avec les vraies données de paiement...\n');

  try {
    // 1. Connexion à l'API
    console.log('🔐 Connexion à l\'API...');
    const authData = await loginAndGetToken();
    if (!authData) {
      console.log('❌ Impossible de se connecter. Arrêt du script.');
      return;
    }

    // 2. Récupération des informations de l'entreprise
    console.log('🏢 Récupération des informations de l\'entreprise...');
    const companyInfo = await getCompanyInfo(authData.token, authData.companyId);
    if (!companyInfo) {
      console.log('❌ Impossible de récupérer les informations de l\'entreprise.');
      return;
    }

    // 3. Récupération d'un paiement récent
    console.log('💰 Récupération d\'un paiement récent...');
    const recentPayment = await getRecentPayment(authData.token);
    if (!recentPayment) {
      console.log('❌ Aucun paiement récent trouvé.');
      return;
    }

    // 4. Les informations de l'élève sont déjà dans le paiement récent
    console.log('👨‍🎓 Informations de l\'élève récupérées depuis le paiement...');
    const studentInfo = recentPayment.studentId;
    if (!studentInfo) {
      console.log('❌ Aucune information d\'élève trouvée dans le paiement.');
      return;
    }

    // 5. Récupération des informations de la classe
    console.log('🏫 Récupération des informations de la classe...');
    const classroomInfo = await getClassroomInfo(authData.token, studentInfo.classroomId);
    if (!classroomInfo) {
      console.log('❌ Impossible de récupérer les informations de la classe.');
      return;
    }

    // 6. Les informations du frais scolaire sont déjà dans le paiement récent
    console.log('📋 Informations du frais scolaire récupérées depuis le paiement...');
    const schoolFeeInfo = recentPayment.schoolFeeId;
    if (!schoolFeeInfo) {
      console.log('❌ Aucune information de frais scolaire trouvée dans le paiement.');
      return;
    }

    // 7. Construction du message avec les vraies données
    const message = buildPaymentMessage({
      companyName: companyInfo.name,
      studentName: `${studentInfo.firstName} ${studentInfo.lastName}`,
      amount: recentPayment.amount,
      currency: schoolFeeInfo.currency || companyInfo.signCurrency,
      classroomName: classroomInfo.name,
      paymentDate: formatDate(recentPayment.paymentDate)
    });

    // 8. Envoi du SMS (utilise un numéro de test si l'élève n'a pas de téléphone)
    console.log('📤 Envoi du SMS...');
    const phoneNumber = studentInfo.phone || '+243826016607'; // Numéro de test par défaut
    const smsResult = await sendSMS(message, phoneNumber);
    
    if (smsResult.success) {
      console.log('✅ SMS envoyé avec succès!');
      console.log('📊 Message ID:', smsResult.messageId);
    } else {
      console.log('❌ Erreur lors de l\'envoi du SMS:', smsResult.error);
    }

  } catch (error) {
    console.error('💥 Erreur inattendue:', error);
  }
}

async function loginAndGetToken() {
  const loginData = {
    phone: '+243856016607',
    password: '1234'
  };

  try {
    const response = await axios.post(`${BASE_URL}/login`, loginData, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ Connexion réussie!');
    console.log('👤 Utilisateur:', response.data.data.username);
    console.log('🏢 Entreprise:', response.data.data.companyId.name);
    
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

async function getCompanyInfo(token, companyId) {
  try {
    const response = await axios.get(`${BASE_URL}/companies/${companyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Informations de l\'entreprise récupérées');
    return response.data.company;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'entreprise:', error.response?.data || error.message);
    return null;
  }
}

async function getRecentPayment(token) {
  try {
    const response = await axios.get(`${BASE_URL}/payments/recent`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.payments && response.data.payments.length > 0) {
      console.log('✅ Paiement récent trouvé');
      return response.data.payments[0];
    }
    return null;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du paiement:', error.response?.data || error.message);
    return null;
  }
}


async function getClassroomInfo(token, classroomId) {
  try {
    const response = await axios.get(`${BASE_URL}/classrooms/${classroomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Informations de la classe récupérées');
    return response.data.classroom;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la classe:', error.response?.data || error.message);
    return null;
  }
}


function buildPaymentMessage(data) {
  return `${data.companyName}
Cher parent, nous confirmons la réception du paiement de ${data.amount} ${data.currency} pour ${data.studentName}, en classe de ${data.classroomName}, le ${data.paymentDate}.
Merci pour votre confiance.`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

async function sendSMS(message, phone) {
  const url = 'https://nmlygy.api.infobip.com/sms/2/text/advanced';
  
  const headers = {
    'Authorization': 'App d5819848b9e86ee925a9ec584c4d1d91-9ed8758c-2081-4ac2-9192-b2d136e782dd',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const body = {
    messages: [
      {
        destinations: [{ to: phone }],
        from: '447491163443',
        text: message,
      },
    ],
  };

  console.log('📱 Données du SMS:');
  console.log(`   Destinataire: ${phone}`);
  console.log(`   Message: ${message}`);
  console.log(`   Expéditeur: 447491163443\n`);

  try {
    const response = await axios.post(url, body, { headers });
    
    return { 
      success: true, 
      messageId: response.data.messages[0].messageId,
      data: response.data 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
}

// Exécution du script
if (require.main === module) {
  sendRealPaymentSMS()
    .then(() => {
      console.log('\n🎉 Script terminé!');
    })
    .catch(error => {
      console.error('\n💥 Erreur inattendue:', error);
    });
}

module.exports = { sendRealPaymentSMS };
