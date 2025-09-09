const mongoose = require('mongoose');
const { Company } = require('../models/company.model');
const { Category } = require('../models/category.model');

async function listCompaniesByCategory() {
  try {
    // Se connecter à MongoDB
    await mongoose.connect('mongodb+srv://stanislasmakengo1:qAqUnbaBnNq3nDcB@cluster0.mtx2l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connecté à MongoDB\n');

    // Récupérer toutes les entreprises avec leurs catégories
    const companies = await Company.find({}).populate('category', 'name nameEnglish');

    // Grouper par catégorie
    const companiesByCategory = {};
    
    companies.forEach(company => {
      const categoryName = company.category ? company.category.name : 'SANS CATÉGORIE';
      
      if (!companiesByCategory[categoryName]) {
        companiesByCategory[categoryName] = [];
      }
      
      companiesByCategory[categoryName].push({
        name: company.name,
        _id: company._id,
        createdAt: company.createdAt
      });
    });

    // Afficher les résultats
    console.log('📊 ENTREPRISES PAR CATÉGORIE :\n');
    console.log('=' .repeat(60));
    
    Object.keys(companiesByCategory).sort().forEach(categoryName => {
      const companies = companiesByCategory[categoryName];
      console.log(`\n🏷️  ${categoryName.toUpperCase()} (${companies.length} entreprise${companies.length > 1 ? 's' : ''})`);
      console.log('-'.repeat(50));
      
      companies.forEach(company => {
        const date = new Date(company.createdAt).toLocaleDateString('fr-FR');
        console.log(`   • ${company.name} (créée le ${date})`);
      });
    });

    console.log('\n' + '='.repeat(60));
    console.log(`📈 TOTAL: ${companies.length} entreprises`);
    
    // Vérifier spécifiquement Kin Matos
    const kinMatos = companies.find(c => c.name === 'Kin Matos');
    if (kinMatos) {
      console.log(`\n🔍 KIN MATOS: ${kinMatos.category ? kinMatos.category.name : 'SANS CATÉGORIE'}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter si le script est appelé directement
if (require.main === module) {
  listCompaniesByCategory();
}

module.exports = { listCompaniesByCategory };
