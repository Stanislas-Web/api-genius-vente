require('dotenv/config')
const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(
  'mongodb+srv://stanislasmakengo1:qAqUnbaBnNq3nDcB@cluster0.mtx2l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

const port = process.env.PORT || 8000;

app.listen(port, '0.0.0.0', () => {
  console.log('Express server démarré sur le port ' + port);
});
