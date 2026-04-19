const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const eurekaClient = require('./config/eureka');
require('dotenv').config();

// Routes
const notificationRoutes = require('./routes/notificationRoutes');

// Initialiser l'application Express
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à la base de données
connectDB();

// Routes de l'API
app.use('/api/notifications', notificationRoutes);

// Route de base pour vérifier que le service fonctionne
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur le service de gestion des avis et notifications',
    status: 'running'
  });
});

// Route pour la vérification de santé (health check)
app.get('/health', async (req, res) => {
  try {
    // Vérifier la connexion à MongoDB
    const mongoStatus = mongoose.connection.readyState === 1 ? 'UP' : 'DOWN';

    // Vérifier l'enregistrement Eureka
    const eurekaStatus = eurekaClient.config ? 'UP' : 'DOWN';

    res.status(200).json({
      status: mongoStatus === 'UP' && eurekaStatus === 'UP' ? 'UP' : 'DEGRADED',
      service: process.env.APP_NAME || 'reviews-notification-service',
      timestamp: new Date(),
      details: {
        mongodb: mongoStatus,
        eureka: eurekaStatus,
        version: require('../package.json').version,
        environment: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'DOWN',
      service: process.env.APP_NAME || 'reviews-notification-service',
      timestamp: new Date(),
      error: error.message
    });
  }
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route non trouvée'
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 8087;
app.listen(PORT, () => {
  console.log(`Service de gestion des avis et notifications démarré sur le port ${PORT}`);

  // Enregistrer le service auprès d'Eureka
  eurekaClient.start(error => {
    console.log(error || 'Service enregistré auprès d\'Eureka');
  });
});

// Gestion de l'arrêt propre du service
process.on('SIGINT', () => {
  eurekaClient.stop();
  process.exit();
});

module.exports = app;
