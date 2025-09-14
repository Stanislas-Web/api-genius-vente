const axios = require('axios');

const BASE_URL = 'http://24.199.107.106:8000/api/v1';

async function testParentRejection() {
  try {
    console.log('🧪 Test de rejet du format "parent"...');
    
    // Connexion
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      phone: '+243856016607',
      password: '1234'
    });
    
    const token = loginResponse.data.token;
    const classroomId = '68c5f1a1c380a4440b3a5a71';
    
    // Test avec ancien format "parent"
    const studentData = {
      lastName: 'REJECTION_TEST',
      firstName: 'Parent',
      gender: 'M',
      parent: {
        name: 'Papa TEST',
        phone: '+243111111111'
      },
      classroomId: classroomId
    };
    
    console.log('📝 Tentative avec ancien format "parent":');
    console.log(JSON.stringify(studentData, null, 2));
    
    try {
      const response = await axios.post(`${BASE_URL}/students`, studentData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('❌ PROBLÈME: L\'ancien format fonctionne encore!');
      console.log('📋 Réponse:', response.data);
      
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ SUCCÈS: L\'ancien format est bien rejeté!');
        console.log('📋 Message d\'erreur:', error.response.data.message);
      } else {
        console.log('❌ Erreur inattendue:', error.response?.data || error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur de test:', error.message);
  }
}

testParentRejection();
