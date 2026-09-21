/**
 * Jeu d’exemple minimal (sans vider la base).
 *
 * Deux sites + un enregistrement dans chaque entité.
 *
 *   npm run setup
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const {
  sequelize,
  Site,
  User,
  Inspection,
  Report,
  Risk,
  CorrectiveAction,
  Alert,
  Attachment,
} = require('./modele');
const { ensureDatabase } = require('./config/ensureDatabase');
const { ensureUserAuthColumns } = require('./config/ensureUserAuth');
const { nextCode } = require('./services/sequenceService');
const { formatWhatsAppAlert } = require('./vue/alertMessage');

const SITE_A = 'Kaseba';
const SITE_B = 'Luiza Centre';

async function setup() {
  await ensureDatabase();
  await sequelize.authenticate();
  await ensureUserAuthColumns();
  await sequelize.sync();

  const already = await Site.findOne({ where: { name: SITE_A } });
  if (already) {
    console.log(`Setup ignoré : le site « ${SITE_A} » existe déjà.`);
    await sequelize.close();
    return;
  }

  const inspector = await User.create({
    name: 'Jean Inspecteur',
    username: 'inspecteur',
    password: 'Demo123!',
    phone: '+243810000001',
    role: 'INSPECTOR',
  });

  await User.create({
    name: 'Marie Responsable',
    username: 'responsable',
    password: 'Demo123!',
    phone: '+243810000002',
    role: 'RESPONSIBLE',
  });

  await User.create({
    name: 'Admin Démo',
    username: 'admin',
    password: 'Demo123!',
    phone: '+243810000003',
    role: 'ADMIN',
  });

  await User.create({
    name: 'Reporter terrain',
    username: 'reporter',
    password: 'Demo123!',
    phone: '+243810000004',
    role: 'REPORTER',
  });

  const kaseba = await Site.create({
    name: SITE_A,
    description: 'Site minier artisanal principal',
    location: 'Luiza',
    latitude: -7.1945,
    longitude: 22.4167,
    responsibleName: 'Jean Inspecteur',
    responsiblePhone: inspector.phone,
    status: 'ACTIVE',
  });

  const centre = await Site.create({
    name: SITE_B,
    description: 'Site urbain de Luiza',
    location: 'Luiza Centre',
    latitude: -7.2001,
    longitude: 22.4022,
    responsibleName: 'Marie Responsable',
    responsiblePhone: '+243810000002',
    status: 'ACTIVE',
  });

  const identifiedAt = new Date();

  const inspection = await Inspection.create({
    code: await nextCode('INSP'),
    siteId: kaseba.id,
    inspectorId: inspector.id,
    inspectionDate: identifiedAt,
    generalCondition: 'Galerie instable, signalisation absente',
    ppeAvailable: false,
    ppeUsed: false,
    specialRiskZones: 'Galerie nord',
    observations: 'Absence de casque, galerie instable, absence de signalisation.',
    immediateMeasures: 'Accès limité à la galerie nord',
    recommendedActions: 'Renforcer la structure et fournir des EPI',
    status: 'COMPLETED',
  });

  const report = await Report.create({
    code: await nextCode('REP'),
    siteId: kaseba.id,
    reporterId: inspector.id,
    reporterName: inspector.name,
    reporterPhone: inspector.phone,
    reportDate: identifiedAt,
    type: 'COLLAPSE',
    title: 'Éboulement dans une galerie',
    description: 'Présence de fissures importantes et chute de matériaux dans la galerie nord.',
    peopleAffected: 3,
    immediateMeasures: 'Accès interdit à la galerie.',
    locationDescription: 'Galerie nord',
    status: 'CONVERTED_TO_RISK',
  });

  const risk = await Risk.create({
    code: await nextCode('RISK'),
    siteId: kaseba.id,
    inspectionId: inspection.id,
    reportId: report.id,
    title: 'Galerie souterraine présentant un risque d’effondrement',
    description: report.description,
    riskType: 'COLLAPSE',
    priority: 'CRITICAL',
    exposedPersons: 3,
    immediateMeasures: report.immediateMeasures,
    status: 'IN_PROGRESS',
    identifiedAt,
  });

  const action = await CorrectiveAction.create({
    riskId: risk.id,
    title: 'Interdire l’accès et sécuriser la galerie',
    description: 'Interdire temporairement l’accès à la galerie et renforcer la structure.',
    responsibleName: 'Responsable sécurité du site',
    responsiblePhone: '+243810000002',
    dueDate: new Date(identifiedAt.getTime() + 2 * 24 * 60 * 60 * 1000),
    status: 'IN_PROGRESS',
  });

  const alertCode = await nextCode('ALT');
  const alert = await Alert.create({
    code: alertCode,
    siteId: kaseba.id,
    reportId: report.id,
    riskId: risk.id,
    type: 'COLLAPSE',
    priority: 'CRITICAL',
    message: formatWhatsAppAlert({
      site: kaseba,
      risk,
      report,
      alert: { type: 'COLLAPSE', priority: 'CRITICAL', code: alertCode },
    }),
    channel: 'WHATSAPP',
    status: 'CREATED',
  });

  const attachment = await Attachment.create({
    reportId: report.id,
    fileName: 'galerie-nord.jpg',
    fileUrl: '/uploads/demo-galerie-nord.jpg',
    mimeType: 'image/jpeg',
    fileSize: 128000,
  });

  console.log('Setup terminé (base non vidée).');
  console.log(`Sites : ${kaseba.name}, ${centre.name}`);
  console.log('Comptes : admin / inspecteur / responsable / reporter  (mot de passe Demo123!)');
  console.log(`Inspection ${inspection.code} | Report ${report.code} | Risk ${risk.code}`);
  console.log(`Action ${action.id} | Alert ${alert.code} | Attachment ${attachment.id}`);
  await sequelize.close();
}

setup().catch((err) => {
  console.error('Setup échoué:', err);
  process.exit(1);
});
