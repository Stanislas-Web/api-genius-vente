const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function addHotelCategory() {
  try {
    console.log('🏨 Ajout de la catégorie Hotel dans la base de données\n');
    
    // Connexion
    console.log('🔐 Connexion...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      phone: '+243826016607',
      password: '1234'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Connexion réussie\n');
    
    // Ajouter la catégorie Hotel
    console.log('📝 Ajout de la catégorie "Hotel"...');
    const categoryData = {
      name: 'Hotel',
      nameEnglish: 'Hotel'
    };
    
    try {
      const categoryResponse = await axios.post(
        `${API_BASE_URL}/categories/categories`,
        categoryData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Catégorie "Hotel" ajoutée avec succès');
      console.log('ID:', categoryResponse.data.category._id);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('⚠️  Catégorie "Hotel" existe déjà');
      } else {
        throw error;
      }
    }
    
    // Lister toutes les catégories pour vérification
    console.log('\n📋 Liste des catégories:');
    const categoriesResponse = await axios.get(`${API_BASE_URL}/categories/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('\nCatégories disponibles:');
    categoriesResponse.data.categories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.lang}) - ID: ${cat._id}`);
    });
    
    console.log('\n✅ Opération terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.response ? error.response.data : error.message);
  }
}

addHotelCategory();

module.exports = { addHotelCategory };
