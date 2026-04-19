@echo off
echo ===== Deploiement des microservices avec Docker =====

echo.
echo 1. Construction des images Docker...
docker-compose build

echo.
echo 2. Demarrage des conteneurs...
docker-compose up -d

echo.
echo 3. Verification des conteneurs en cours d'execution...
docker-compose ps

echo.
echo 4. Logs du service de notifications...
docker-compose logs -f reviews-notification-service

echo.
echo Pour arreter les services, utilisez la commande: docker-compose down
echo Pour voir les logs de tous les services: docker-compose logs -f
echo ===== Fin du deploiement =====
