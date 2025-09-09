const mongoose = require('mongoose');
const { Section } = require('../models/section.model');
const { Option } = require('../models/option.model');
const { Company } = require('../models/company.model');

// Données par défaut (gardées pour référence mais NON utilisées)
const defaultSections = [
  { name: 'Maternelle', code: 'MAT', description: 'Section maternelle', levels: ['Petite section', 'Moyenne section', 'Grande section'] },
  { name: 'Primaire', code: 'PRI', description: 'Section primaire', levels: ['1ère année', '2ème année', '3ème année', '4ème année', '5ème année', '6ème année'] },
  { name: 'Secondaire', code: 'SEC', description: 'Section secondaire', levels: ['7ème année', '8ème année', '9ème année', '10ème année', '11ème année', '12ème année'] }
];

const defaultOptions = [
  { name: 'Général', code: 'GEN', description: 'Option générale', subjects: ['Mathématiques', 'Français', 'Histoire', 'Géographie', 'Sciences'] },
  { name: 'Commercial', code: 'COM', description: 'Option commerciale', subjects: ['Comptabilité', 'Économie', 'Gestion', 'Droit', 'Informatique'] },
  { name: 'Scientifique', code: 'SCI', description: 'Option scientifique', subjects: ['Mathématiques', 'Physique', 'Chimie', 'Biologie', 'Informatique'] },
  { name: 'Littéraire', code: 'LIT', description: 'Option littéraire', subjects: ['Français', 'Littérature', 'Histoire', 'Géographie', 'Philosophie'] }
];

async function initializeAllCompanies() {
  try {
    // Se connecter à MongoDB
    await mongoose.connect('mongodb+srv://stanislasmakengo1:qAqUnbaBnNq3nDcB@cluster0.mtx2l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connecté à MongoDB');

    // Récupérer toutes les entreprises
    const companies = await Company.find({});
    console.log(`Trouvé ${companies.length} entreprises`);

    console.log('✅ Aucune donnée par défaut créée - chaque entreprise peut créer ses propres sections et options librement');
    console.log('📝 Les entreprises peuvent maintenant :');
    console.log('   • Créer leurs propres sections via POST /api/v1/sections');
    console.log('   • Créer leurs propres options via POST /api/v1/options');
    console.log('   • Les options sont facultatifs - pas obligatoires');
    console.log('   • Chaque entreprise gère ses données indépendamment');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

// Exécuter si le script est appelé directement
if (require.main === module) {
  require('dotenv').config();
  initializeAllCompanies();
}

module.exports = { initializeAllCompanies };
