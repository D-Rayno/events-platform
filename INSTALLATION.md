# 🚀 Installation du Module 1 - Authentification

## ✅ Ce qui a été créé

### Backend (AdonisJS)

- ✅ Migration utilisateur étendue avec tous les champs requis
- ✅ Modèle User avec validation et méthodes utilitaires
- ✅ Configuration Brevo (SendinBlue) pour l'envoi d'emails
- ✅ Service EmailService pour gérer tous les emails
- ✅ Validators en français (inscription, connexion)
- ✅ Contrôleur AuthController complet
- ✅ Middleware de vérification email
- ✅ Routes d'authentification

### Frontend (Vue/Inertia)

- ✅ Page d'inscription avec formulaire complet
- ✅ Page de connexion
- ✅ Page mot de passe oublié
- ✅ Page de réinitialisation du mot de passe
- ✅ Templates email professionnels (vérification, reset, bienvenue)

---

## 📦 Installation des dépendances

```bash
# Installer les packages nécessaires
npm install @adonisjs/mail qrcode
npm install -D @types/qrcode
```

---

## 🗄️ Configuration de la base de données

### 1. Créer la base de données MySQL

```sql
CREATE DATABASE events_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configurer le fichier .env

Copier `.env.example` vers `.env` et remplir les valeurs :

```bash
cp .env.example .env
```

**Important** : Générer une APP_KEY :

```bash
node ace generate:key
```

### 3. Configuration Brevo (SendinBlue)

1. Créer un compte gratuit sur [Brevo](https://app.brevo.com)
2. Aller dans **Settings → SMTP & API**
3. Copier vos identifiants SMTP
4. Les ajouter dans le `.env` :

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USERNAME=votre_email@example.com
SMTP_PASSWORD=votre_cle_smtp_brevo
MAIL_FROM_ADDRESS=noreply@votredomaine.com
MAIL_FROM_NAME="Plateforme d'événements"
```

### 4. Lancer les migrations

```bash
node ace migration:run
```

---

## 🧪 Tester l'authentification

### 1. Démarrer le serveur

```bash
npm run dev
```

### 2. Accéder aux pages

- Page d'accueil : `http://localhost:3333`
- Inscription : `http://localhost:3333/auth/register`
- Connexion : `http://localhost:3333/auth/login`

### 3. Flux de test

1. S'inscrire avec un email valide
2. Vérifier la réception de l'email de vérification
3. Cliquer sur le lien de vérification
4. Se connecter avec les identifiants
5. Tester le mot de passe oublié

---

## 🔍 Structure des fichiers créés

```
app/
├── controllers/
│   └── auth/
│       └── auth_controller.ts ✅
├── models/
│   └── user.ts ✅
├── middleware/
│   ├── auth_middleware.ts (déjà existant)
│   └── verified_middleware.ts ✅
├── services/
│   └── email_service.ts ✅
└── validators/
    └── auth/
        ├── register_validator.ts ✅
        └── login_validator.ts ✅

config/
└── mail.ts ✅

database/
└── migrations/
    └── xxxx_create_users_table.ts ✅

inertia/
└── pages/
    └── auth/
        ├── register.vue ✅
        ├── login.vue ✅
        ├── forgot_password.vue ✅
        └── reset_password.vue ✅

resources/
└── views/
    └── emails/
        ├── verify_email.edge ✅
        ├── reset_password.edge ✅
        └── welcome.edge ✅

start/
├── routes.ts ✅ (mis à jour)
├── kernel.ts ✅ (mis à jour)
└── env.ts ✅ (mis à jour)
```

---

## ✨ Fonctionnalités disponibles

### Pour les utilisateurs

- ✅ **Inscription** avec validation complète en français
- ✅ **Vérification d'email** obligatoire
- ✅ **Connexion** avec vérification du statut du compte
- ✅ **Mot de passe oublié** avec token d'expiration (1 heure)
- ✅ **Réinitialisation de mot de passe**
- ✅ **Emails professionnels** pour chaque action
- ✅ **Protection contre les comptes bloqués/inactifs**

### Prochaines étapes

- ⏳ Module 2 : Gestion du profil utilisateur + avatar
- ⏳ Module 3 : Système d'événements
- ⏳ Module 4 : Inscriptions aux événements + QR codes
- ⏳ Module 5 : API administrateur (mobile)

---

## 🐛 Dépannage

### Erreur "APP_KEY is missing"

```bash
node ace generate:key
```

### Erreur SMTP

Vérifier que les credentials Brevo sont corrects dans `.env`

### Migration échoue

```bash
node ace migration:rollback
node ace migration:run
```

---

## 📌 Notes importantes

1. **Provinces algériennes** : La liste complète des 58 wilayas est incluse dans le formulaire
2. **Validation** : Tous les messages sont en français
3. **Sécurité** : Les tokens de vérification sont générés aléatoirement
4. **Emails** : Design responsive et professionnel

---

## ✅ Module 1 terminé !

Dites **"Next module"** pour passer à la gestion du profil utilisateur avec upload d'avatar.
