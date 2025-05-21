const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');

const PORT = 4000;
const HOST = '0.0.0.0';

const app = express();
app.use(express.json());

// ✅ MONTER LES ROUTES AVANT LA CONNEXION
app.use('/api', taskRoutes);

app.get('/', (req, res) => {
  res.send('API OK');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connecté');
    app.listen(3000, '0.0.0.0', () => {
      console.log('Serveur lancé sur http://0.0.0.0:3000');
    });
    
  })
  .catch(err => console.error('Erreur de connexion MongoDB :', err));
