Write-Host "===== Deploiement des microservices avec Docker =====" -ForegroundColor Cyan

Write-Host "`n1. Construction des images Docker..." -ForegroundColor Yellow
docker-compose build

Write-Host "`n2. Demarrage des conteneurs..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "`n3. Verification des conteneurs en cours d'execution..." -ForegroundColor Yellow
docker-compose ps

Write-Host "`n4. Logs du service de notifications..." -ForegroundColor Yellow
docker-compose logs -f reviews-notification-service

Write-Host "`nPour arreter les services, utilisez la commande: docker-compose down" -ForegroundColor Green
Write-Host "Pour voir les logs de tous les services: docker-compose logs -f" -ForegroundColor Green
Write-Host "===== Fin du deploiement =====" -ForegroundColor Cyan
