# LUIZA MINING SAFE — Backend MVP

API REST pour le suivi de sécurité des sites miniers artisanaux de Luiza.

Cycle couvert : **Site → Inspection / Signalement → Risque → Alerte → Action corrective → Vérification → Clôture**.

## Stack

- Node.js + Express
- Sequelize (même organisation que `salesmgmt` : modèle / vues / routes)
- **MySQL**
- Validation Zod
- Upload d’images (JPG/PNG)
- Swagger UI

Pas de Prisma. Pas de PostgreSQL.

## Structure

```text
back-luiza/
├── modele/          # modèles Sequelize
├── vue/             # format de réponse + message WhatsApp copiable
├── api/             # routes REST /api/v1
├── controllers/
├── services/
├── middlewares/
├── validators/
├── uploads/
├── tests/
├── seed.js
└── server.js
```

Flux : `Route → Controller → Service → Sequelize → MySQL`

## Installation

```bash
cd back-luiza
copy .env.example .env
npm install
```

MariaDB locale (WAMP) : port **3307**, utilisateur `root`, mot de passe vide.

`npm run seed` crée la base `luiza_mining_safe` si elle n’existe pas.

## Lancement

```bash
npm run seed
npm start
```

- API : http://localhost:3000/api/v1
- Santé : http://localhost:3000/api/health
- Swagger : http://localhost:3000/api/docs

Les tables sont créées au démarrage via `sequelize.sync()`.

## Seed de démonstration

Le seed recrée la base et insère :

- Sites : **Kaseba**, **Luiza Centre**, **Katopa**
- Signalement : éboulement galerie nord (`COLLAPSE`)
- Risque critique + alerte WhatsApp manuelle
- Action corrective `IN_PROGRESS`

Le type API `COLLAPSE` correspond à « éboulement ». L’alias `EBOULEMENT` est aussi accepté en entrée.

## Endpoints principaux

Préfixe : `/api/v1`

| Méthode | Chemin | Description |
|---|---|---|
| GET/POST | `/sites` | Sites |
| GET/PUT/DELETE | `/sites/:id` | Détail / MAJ / **désactivation** (pas de suppression physique) |
| GET/POST | `/users` | Utilisateurs démo (sans mot de passe) |
| GET/POST | `/reports` | Signalements |
| PATCH | `/reports/:id/status` | Statut |
| POST | `/reports/:id/convert-to-risk` | Conversion en risque (met le report à `CONVERTED_TO_RISK`) |
| GET/POST | `/inspections` | Inspections |
| PATCH | `/inspections/:id` | Modifier une inspection ouverte |
| POST | `/inspections/:id/complete` | Terminer |
| POST | `/inspections/:id/risks` | Ajouter un risque issu de l’inspection |
| GET/POST | `/risks` | Risques |
| POST | `/risks/:id/resolve` | Résoudre |
| POST | `/risks/:id/close` | Clôturer (uniquement depuis `RESOLVED`) |
| GET/POST | `/risks/:riskId/actions` | Actions d’un risque |
| POST | `/actions/:id/start\|complete\|verify` | Cycle d’action |
| GET/POST | `/alerts` | Alertes |
| POST | `/uploads` | Photo (`multipart/form-data`, champ `file`) |
| GET/POST | `/attachments` | Lister / lier une photo à **exactement un** report, risk ou inspection |
| GET | `/dashboard/summary` | Compteurs MVP |

Un risque `CRITICAL` crée automatiquement une `Alert` (canal WhatsApp manuel, message copiable).

Réponse succès :

```json
{ "success": true, "data": {}, "message": "Operation successful" }
```

Validation en erreur : **400** `VALIDATION_ERROR`.

## Authentification

Pas de JWT dans ce MVP. Les endpoints sont ouverts en local.

Si `API_KEY` est défini dans `.env`, envoyer l’en-tête `X-API-Key`.

Aucun mot de passe n’est stocké.

## WhatsApp

Pas d’intégration Business API. Une alerte critique expose `whatsappMessage`, copiable vers le groupe `LUIZA MINING SAFE ALERT`.

## Tests

```bash
npm test
```

Les tests utilisent SQLite en mémoire (pas besoin de MySQL).
