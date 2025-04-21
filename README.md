# 🧾 Microservices Spring Boot - Gestion des Factures

## 📌 Description du Projet

Ce projet est un système distribué de gestion de **factures** développé en architecture **microservices** avec **Spring Boot**. Il permet la **création**, la **consultation**, la **modification** et la **suppression** de factures ainsi que la gestion des **détails de chaque facture**. Il s'intègre avec d'autres services comme les utilisateurs ou les produits grâce à **Spring Cloud**.

---

## 🏗️ Architecture du Projet

### 🧩 Microservices

- `api-gateway` : Passerelle API pour la gestion des routes et la sécurité.
- `config-server` : Serveur de configuration centralisé.
- `server-discovery` : Service Eureka pour la découverte des microservices.
- `facture-micro` : Service principal pour gérer les factures et leurs détails.
- `front-facture` : Interface web Angular pour gérer les factures.

---

## ⚙️ Technologies Utilisées

- **Spring Boot 3.4.2**
- **Spring Cloud** (Eureka, Config Server, OpenFeign)
- **MySQL** pour la base de données
- **Feign Client** pour la communication inter-service
- **Maven** pour la gestion des dépendances
- **Angular** pour le frontend (optionnel)


---

## ✨ Fonctionnalités

### ✅ Gestion des Factures
- 📥 Création d’une facture avec plusieurs **détails de facture**
- 🔗 Association des **produits** à une facture
- 📈 Calcul **automatique** des montants
- 🕓 Affichage de l’**historique des factures** 

### 🧾 Gestion des Détails de Facture
- ➕ Ajout de **détails** (lignes) à une facture
- 🔄 Attribution d’un **produit** à chaque détail
- 🗑️ Suppression **des détails d’une facture** 
- ❌ Suppression complète d’un **détail de facture** spécifique
---
## ✨ Fonctionnalités Avancées

### 📬 Notifications par Email
- 🧾 Envoi d’un **email de confirmation** lors de l’ajout d'une **nouvelle facture**
- 📦 Notification par email lors de l’ajout de **détails produits à une facture**

### 🧾 Génération de PDF
- 📄 Génération automatique d’un **PDF récapitulatif** lors de la création d’une facture
- 🖨️ Le PDF contient :  produits, quantités, prix, montants HT/TVA/TTC
- 📤 Option pour **télécharger ou envoyer par email** la facture au format PDF
