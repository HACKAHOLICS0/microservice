# Service de Gestion des Avis et Notifications

Ce microservice fait partie de l'architecture microservices du projet et gère les avis, évaluations et notifications des utilisateurs.

## Fonctionnalités

### Avis et Évaluations
- Création, lecture, mise à jour et suppression d'avis
- Calcul et récupération des statistiques d'évaluation par produit

### Notifications
- Création et gestion de notifications utilisateur
- Support pour différents types de notifications (avis, système, produit, commande, promotion)
- Marquage des notifications comme lues/non lues
- Comptage des notifications non lues

### Intégration
- Intégration avec Eureka pour la découverte de services
- Base de données MongoDB pour le stockage des données

## Technologies utilisées

- Node.js
- Express.js
- MongoDB avec Mongoose
- Eureka Client pour l'enregistrement auprès du serveur de découverte
- Docker pour la conteneurisation

## Structure du projet

```
reviews-service-nodejs/
├── src/
│   ├── config/
│   │   ├── db.js                # Configuration de la connexion MongoDB
│   │   └── eureka.js            # Configuration du client Eureka
│   ├── controllers/
│   │   ├── reviewController.js  # Contrôleurs pour les avis
│   │   └── notificationController.js  # Contrôleurs pour les notifications
│   ├── models/
│   │   ├── Review.js            # Modèle pour les avis
│   │   └── Notification.js      # Modèle pour les notifications
│   ├── routes/
│   │   ├── reviewRoutes.js      # Routes pour les avis
│   │   └── notificationRoutes.js # Routes pour les notifications
│   ├── services/
│   │   └── notificationService.js # Service utilitaire pour les notifications
│   └── app.js                   # Point d'entrée de l'application
├── .env                         # Variables d'environnement
├── Dockerfile                   # Configuration Docker
├── index.js                     # Point d'entrée principal
└── package.json                 # Dépendances et scripts
```

## Installation et démarrage

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB
- Serveur Eureka en cours d'exécution

### Installation locale

1. Cloner le dépôt
2. Installer les dépendances :
   ```
   npm install
   ```
3. Configurer les variables d'environnement dans le fichier `.env`
4. Démarrer le service :
   ```
   npm start
   ```
   
   Pour le développement :
   ```
   npm run dev
   ```

### Avec Docker

```
docker-compose up -d reviews-notification-service
```

## API Endpoints

### Avis

- `POST /api/reviews` - Créer un nouvel avis
- `GET /api/reviews/product/:productId` - Obtenir tous les avis pour un produit
- `GET /api/reviews/:id` - Obtenir un avis spécifique
- `PUT /api/reviews/:id` - Mettre à jour un avis
- `DELETE /api/reviews/:id` - Supprimer un avis
- `GET /api/reviews/summary/:productId` - Obtenir le résumé des évaluations pour un produit

### Notifications

- `POST /api/notifications` - Créer une nouvelle notification
- `GET /api/notifications/user/:userId` - Obtenir toutes les notifications d'un utilisateur
- `GET /api/notifications/user/:userId/unread-count` - Obtenir le nombre de notifications non lues
- `PUT /api/notifications/:id/read` - Marquer une notification comme lue
- `PUT /api/notifications/user/:userId/read-all` - Marquer toutes les notifications comme lues
- `DELETE /api/notifications/:id` - Supprimer une notification
- `DELETE /api/notifications/user/:userId/all` - Supprimer toutes les notifications d'un utilisateur

## Intégration avec les autres services

Ce service s'intègre avec :
- L'API Gateway pour le routage des requêtes
- Le service de découverte Eureka pour l'enregistrement
- Le service de produits pour associer les avis aux produits
- Le service utilisateur pour associer les avis et notifications aux utilisateurs
