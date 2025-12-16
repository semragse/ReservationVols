# 📥 Guide d'Installation Manuelle des Prérequis

## ☕ 1. Java 17 (OpenJDK) - OBLIGATOIRE

### Téléchargement
1. Allez sur : **https://adoptium.net/temurin/releases/?version=17**
2. Sélectionnez :
   - **Version** : 17 - LTS
   - **Operating System** : Windows
   - **Architecture** : x64
   - **Package Type** : JDK
   - **Format** : .msi (installeur)

3. Téléchargez : `OpenJDK17U-jdk_x64_windows_hotspot_17.X.X.msi`

### Installation
1. Double-cliquez sur le fichier .msi téléchargé
2. Suivez l'assistant d'installation
3. ✅ **IMPORTANT** : Cochez "Add to PATH" ou "Set JAVA_HOME variable"
4. Cliquez sur "Install"

### Vérification
Ouvrez un **nouveau** PowerShell et tapez :
```powershell
java -version
```
Résultat attendu : `openjdk version "17.X.X"`

---

## 📦 2. Maven - OBLIGATOIRE

### Téléchargement
1. Allez sur : **https://maven.apache.org/download.cgi**
2. Téléchargez : `apache-maven-3.9.X-bin.zip` (Binary zip archive)

### Installation
1. Décompressez le fichier ZIP
2. Déplacez le dossier `apache-maven-3.9.X` vers : `C:\Program Files\Apache\Maven`
3. **Ajouter au PATH** :
   - Clic droit sur "Ce PC" → Propriétés
   - Paramètres système avancés → Variables d'environnement
   - Dans "Variables système", trouvez "Path" et cliquez "Modifier"
   - Cliquez "Nouveau" et ajoutez : `C:\Program Files\Apache\Maven\apache-maven-3.9.X\bin`
   - Cliquez OK sur toutes les fenêtres

4. **Créer MAVEN_HOME** (optionnel mais recommandé) :
   - Dans "Variables système", cliquez "Nouvelle"
   - Nom : `MAVEN_HOME`
   - Valeur : `C:\Program Files\Apache\Maven\apache-maven-3.9.X`

### Vérification
Ouvrez un **nouveau** PowerShell et tapez :
```powershell
mvn -version
```
Résultat attendu : `Apache Maven 3.9.X`

---

## 🟢 3. Node.js - OBLIGATOIRE

### Téléchargement
1. Allez sur : **https://nodejs.org/**
2. Téléchargez : **LTS Version** (ex: 20.x.x LTS)
3. Choisissez : `node-v20.X.X-x64.msi` (Windows Installer)

### Installation
1. Double-cliquez sur le fichier .msi
2. Suivez l'assistant (tout accepter par défaut)
3. ✅ L'installeur ajoute automatiquement Node.js et npm au PATH
4. Cliquez sur "Install"

### Vérification
Ouvrez un **nouveau** PowerShell et tapez :
```powershell
node --version
npm --version
```
Résultat attendu : 
- `v20.X.X`
- `10.X.X`

### Installer Angular CLI
```powershell
npm install -g @angular/cli
ng version
```

---

## 🐘 4. PostgreSQL 15 - OBLIGATOIRE

### Téléchargement
1. Allez sur : **https://www.postgresql.org/download/windows/**
2. Cliquez sur "Download the installer"
3. Téléchargez : **PostgreSQL 15.X** pour Windows x86-64

### Installation
1. Double-cliquez sur le fichier téléchargé
2. Suivez l'assistant :
   - Installation directory : Laissez par défaut
   - Components : Cochez tout (PostgreSQL Server, pgAdmin 4, Command Line Tools)
   - Data directory : Laissez par défaut
   - **Password** : Entrez `postgres` (IMPORTANT : notez-le !)
   - Port : `5432` (par défaut)
   - Locale : Default locale
3. Cliquez sur "Next" puis "Install"
4. ⏰ Attendez la fin (2-3 minutes)
5. Décochez "Stack Builder" à la fin

### Ajouter au PATH (si pas fait automatiquement)
1. Ajoutez au PATH : `C:\Program Files\PostgreSQL\15\bin`

### Vérification
Ouvrez un **nouveau** PowerShell et tapez :
```powershell
psql --version
```
Résultat attendu : `psql (PostgreSQL) 15.X`

### Créer les Bases de Données
```powershell
# Se connecter à PostgreSQL
psql -U postgres

# Mot de passe : postgres

# Dans le prompt PostgreSQL, exécutez :
CREATE DATABASE db_utilisateur;
CREATE DATABASE db_vol;
CREATE DATABASE db_hotel;
CREATE DATABASE db_reservation;
CREATE DATABASE db_notification;

# Vérifier
\l

# Quitter
\q
```

---

## 🐰 5. RabbitMQ - OBLIGATOIRE

### Prérequis : Erlang
**RabbitMQ nécessite Erlang. Installez-le d'abord !**

#### A. Installer Erlang
1. Allez sur : **https://www.erlang.org/downloads**
2. Téléchargez : **OTP 26.x Windows 64-bit Binary File** (.exe)
3. Installez normalement (tout accepter par défaut)

### Téléchargement RabbitMQ
1. Allez sur : **https://www.rabbitmq.com/install-windows.html**
2. Téléchargez : **rabbitmq-server-3.12.X.exe** (Windows Installer)

### Installation
1. Double-cliquez sur le fichier .exe
2. Suivez l'assistant (tout accepter par défaut)
3. RabbitMQ s'installera et démarrera automatiquement comme service Windows

### Activer le Plugin Management (Interface Web)
Ouvrez PowerShell en Administrateur et tapez :
```powershell
cd "C:\Program Files\RabbitMQ Server\rabbitmq_server-3.12.X\sbin"
.\rabbitmq-plugins.bat enable rabbitmq_management
```

### Vérification
1. **Service** : Ouvrez Services Windows (services.msc) et vérifiez que "RabbitMQ" est démarré
2. **Interface Web** : http://localhost:15672
   - Username : `guest`
   - Password : `guest`

---

## ✅ Vérification Finale de Tous les Prérequis

Ouvrez un **NOUVEAU** PowerShell et exécutez :

```powershell
# Java
java -version

# Maven
mvn -version

# Node.js
node --version
npm --version

# Angular CLI
ng version

# PostgreSQL
psql --version

# Résumé
Write-Host "`n=== VERIFICATION COMPLETE ===" -ForegroundColor Green
Write-Host "Java:       " -NoNewline; java -version 2>&1 | Select-String "version"
Write-Host "Maven:      " -NoNewline; mvn -version 2>&1 | Select-String "Apache Maven"
Write-Host "Node.js:    " -NoNewline; node --version
Write-Host "npm:        " -NoNewline; npm --version
Write-Host "PostgreSQL: " -NoNewline; psql --version
```

---

## 🎯 Prochaines Étapes

Une fois TOUS les prérequis installés et vérifiés :

1. ✅ Fermez et rouvrez VS Code
2. ✅ Ouvrez un nouveau terminal dans VS Code
3. ✅ Dites-moi "Prérequis installés" pour continuer

---

## ⏰ Temps d'Installation Estimé

- Java : 5 minutes
- Maven : 5 minutes
- Node.js : 5 minutes
- PostgreSQL : 10 minutes
- Erlang + RabbitMQ : 10 minutes

**Total : ~35 minutes**

---

## 🆘 Aide

Si vous rencontrez un problème à une étape, dites-moi à quelle étape vous êtes bloqué et je vous aiderai !
