const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function testSalesSummaryByPhone() {
  try {
    console.log('🧪 Test de l\'endpoint /reports/sales-summary-by-phone\n');
    
    // Numéro de téléphone de test
    const testPhone = '+243826016607';
    
    console.log(`📞 Numéro de téléphone utilisé: ${testPhone}\n`);
    
    const requestData = {
      phone: testPhone
    };
    
    console.log('📤 Envoi de la requête...\n');
    console.log('URL:', `${API_BASE_URL}/reports/sales-summary-by-phone`);
    console.log('Données:', JSON.stringify(requestData, null, 2));
    console.log('\n' + '='.repeat(60) + '\n');
    
    const response = await axios.post(
      `${API_BASE_URL}/reports/sales-summary-by-phone`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ SUCCÈS ! Réponse reçue:\n');
    console.log('Status:', response.status);
    console.log('\n📊 Données du rapport:\n');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Affichage formaté des informations clés
    if (response.data.summary) {
      console.log('\n' + '='.repeat(60));
      console.log('📈 RÉSUMÉ DES VENTES');
      console.log('='.repeat(60));
      console.log(`💰 Total des ventes: ${response.data.summary.totalSalesAmount}`);
      console.log(`📅 Ventes aujourd'hui: ${response.data.summary.todaySalesAmount}`);
      console.log(`🛒 Nombre de ventes aujourd'hui: ${response.data.summary.salesCountToday}`);
    }
    
    if (response.data.allTimeProducts) {
      console.log('\n' + '='.repeat(60));
      console.log('🏆 PRODUITS (TOUS LES TEMPS)');
      console.log('='.repeat(60));
      if (response.data.allTimeProducts.mostSold) {
        console.log(`✅ Plus vendu: ${response.data.allTimeProducts.mostSold.productName} (${response.data.allTimeProducts.mostSold.quantity} unités)`);
      }
      if (response.data.allTimeProducts.leastSold) {
        console.log(`❌ Moins vendu: ${response.data.allTimeProducts.leastSold.productName} (${response.data.allTimeProducts.leastSold.quantity} unités)`);
      }
    }
    
    if (response.data.dailyProducts) {
      console.log('\n' + '='.repeat(60));
      console.log(`📅 PRODUITS DU JOUR (${response.data.dailyProducts.todayDate})`);
      console.log('='.repeat(60));
      if (response.data.dailyProducts.mostSoldToday) {
        console.log(`✅ Plus vendu: ${response.data.dailyProducts.mostSoldToday.productName} (${response.data.dailyProducts.mostSoldToday.quantity} unités)`);
      }
      if (response.data.dailyProducts.leastSoldToday) {
        console.log(`❌ Moins vendu: ${response.data.dailyProducts.leastSoldToday.productName} (${response.data.dailyProducts.leastSoldToday.quantity} unités)`);
      }
    }
    
    if (response.data.whatsapp) {
      console.log('\n' + '='.repeat(60));
      console.log('📱 STATUT WHATSAPP');
      console.log('='.repeat(60));
      console.log(`Status: ${response.data.whatsapp.status}`);
      console.log(`Message: ${response.data.whatsapp.message}`);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('❌ ERREUR lors du test:\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message || error.response.data);
      console.error('\nDétails complets:');
      console.error(JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('Aucune réponse reçue du serveur');
      console.error('Vérifiez que le serveur est bien démarré sur le port 8000');
    } else {
      console.error('Erreur:', error.message);
    }
  }
}

// Exécuter le test
testSalesSummaryByPhone();

module.exports = { testSalesSummaryByPhone };
