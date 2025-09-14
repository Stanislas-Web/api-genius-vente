const mongoose = require('mongoose');

// Connexion à MongoDB
mongoose.connect(
  'mongodb+srv://stanislasmakengo1:qAqUnbaBnNq3nDcB@cluster0.mtx2l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true }
)
.then(() => console.log('✅ Connexion à MongoDB réussie !'))
.catch(() => console.log('❌ Connexion à MongoDB échouée !'));

async function fixOptionIndexes() {
  try {
    // Attendre que la connexion soit établie
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const db = mongoose.connection.db;
    
    console.log('🗑️ Suppression de tous les index problématiques...');
    
    // Supprimer tous les index qui posent problème
    const indexesToRemove = [
      'companyId_1_sectionId_1_code_1',
      'companyId_1_sectionId_1_name_1',
      'companyId_1_name_1'
    ];
    
    for (const indexName of indexesToRemove) {
      try {
        await db.collection('options').dropIndex(indexName);
        console.log(`✅ Index ${indexName} supprimé`);
      } catch (error) {
        if (error.code === 27) {
          console.log(`ℹ️ Index ${indexName} n'existe pas`);
        } else {
          console.log(`⚠️ Erreur avec ${indexName}:`, error.message);
        }
      }
    }
    
    console.log('\n🔍 Index restants:');
    const remainingIndexes = await db.collection('options').indexes();
    remainingIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('\n✅ Nettoyage terminé! Maintenant les options peuvent être créées sans conflit d\'index.');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

// Attendre un peu plus longtemps avant d'exécuter
setTimeout(fixOptionIndexes, 3000);

