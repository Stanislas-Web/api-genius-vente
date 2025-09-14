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
    await new Promise(resolve => setTimeout(resolve, 1000));
    const db = mongoose.connection.db;
    
    console.log('🔍 Vérification des index actuels...');
    
    // Lister tous les index de la collection options
    const indexes = await db.collection('options').indexes();
    console.log('📋 Index actuels:');
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('\n🗑️ Suppression de l\'ancien index companyId_1_code_1...');
    
    // Supprimer l'ancien index
    await db.collection('options').dropIndex('companyId_1_code_1');
    console.log('✅ Ancien index supprimé!');
    
    console.log('\n🔍 Vérification des index après suppression...');
    const newIndexes = await db.collection('options').indexes();
    console.log('📋 Nouveaux index:');
    newIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('\n✅ Correction terminée!');
    
  } catch (error) {
    if (error.code === 27) {
      console.log('ℹ️ L\'index n\'existe pas (déjà supprimé ou n\'a jamais existé)');
    } else {
      console.error('❌ Erreur:', error.message);
    }
  } finally {
    mongoose.connection.close();
  }
}

fixOptionIndexes();
