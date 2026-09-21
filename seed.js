/**
 * Seed de démonstration LUIZA MINING SAFE.
 *
 * Usage:
 *   1. Copier .env.example vers .env (MariaDB WAMP : port 3307, root sans mot de passe)
 *   2. npm run seed
 *   3. npm start
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
const { nextCode } = require('./services/sequenceService');
const { formatWhatsAppAlert } = require('./vue/alertMessage');

function at(day, hour = 8) {
  return new Date(Date.UTC(2026, 8, day, hour, 0, 0));
}

async function seed() {
  await ensureDatabase();
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  console.log('Base recréée (force: true).');

  const users = await User.bulkCreate([
    { name: 'Jean Inspecteur', phone: '+243810000001', role: 'INSPECTOR' },
    { name: 'Marie Responsable', phone: '+243810000002', role: 'RESPONSIBLE' },
    { name: 'Admin Démo', phone: '+243810000003', role: 'ADMIN' },
    { name: 'Reporter terrain', phone: '+243810000004', role: 'REPORTER' },
    { name: 'Patrick Inspecteur', phone: '+243810000005', role: 'INSPECTOR' },
    { name: 'Grace Sécurité', phone: '+243810000006', role: 'RESPONSIBLE' },
    { name: 'David Reporter', phone: '+243810000007', role: 'REPORTER' },
    { name: 'Chantal Inspectrice', phone: '+243810000008', role: 'INSPECTOR' },
    { name: 'Joseph Chef de chantier', phone: '+243810000009', role: 'RESPONSIBLE' },
    { name: 'Esther Observatrice', phone: '+243810000010', role: 'REPORTER' },
  ]);
  const [inspector, responsible, , reporter, inspector2, responsible2, reporter2, inspector3, responsible3, reporter3] = users;

  const sites = await Site.bulkCreate([
    {
      name: 'Kaseba',
      description: 'Site minier artisanal principal',
      location: 'Luiza',
      latitude: -7.1945,
      longitude: 22.4167,
      responsibleName: 'Jean',
      responsiblePhone: '+243810000001',
      status: 'ACTIVE',
    },
    {
      name: 'Luiza Centre',
      description: 'Site urbain de Luiza',
      location: 'Luiza Centre',
      latitude: -7.2001,
      longitude: 22.4022,
      responsibleName: 'Marie Responsable',
      responsiblePhone: '+243810000002',
      status: 'ACTIVE',
    },
    {
      name: 'Katopa',
      description: 'Site secondaire',
      location: 'Katopa',
      latitude: -7.2210,
      longitude: 22.4510,
      responsibleName: 'Chef de site Katopa',
      responsiblePhone: '+243810000009',
      status: 'ACTIVE',
    },
    {
      name: 'Kabanda',
      description: 'Exploitation alluviale',
      location: 'Kabanda',
      latitude: -7.1750,
      longitude: 22.3880,
      responsibleName: 'Grace Sécurité',
      responsiblePhone: '+243810000006',
      status: 'ACTIVE',
    },
    {
      name: 'Mwanza',
      description: 'Galerie peu profonde',
      location: 'Mwanza',
      latitude: -7.2400,
      longitude: 22.4300,
      responsibleName: 'Joseph Chef de chantier',
      responsiblePhone: '+243810000009',
      status: 'ACTIVE',
    },
    {
      name: 'Nkonko',
      description: 'Puits artisanaux',
      location: 'Nkonko',
      latitude: -7.1600,
      longitude: 22.4700,
      responsibleName: 'Marie Responsable',
      responsiblePhone: '+243810000002',
      status: 'ACTIVE',
    },
    {
      name: 'Tshibala',
      description: 'Zone de lavage du minerai',
      location: 'Tshibala',
      latitude: -7.2550,
      longitude: 22.3900,
      responsibleName: 'Grace Sécurité',
      responsiblePhone: '+243810000006',
      status: 'ACTIVE',
    },
    {
      name: 'Lukala Est',
      description: 'Fosse à ciel ouvert',
      location: 'Lukala',
      latitude: -7.1300,
      longitude: 22.4400,
      responsibleName: 'Jean',
      responsiblePhone: '+243810000001',
      status: 'ACTIVE',
    },
    {
      name: 'Kalomba',
      description: 'Site saisonnier',
      location: 'Kalomba',
      latitude: -7.2800,
      longitude: 22.4100,
      responsibleName: 'Chef de site Kalomba',
      responsiblePhone: '+243810000011',
      status: 'INACTIVE',
    },
    {
      name: 'Mpoyi',
      description: 'Accès rivière et rampe',
      location: 'Mpoyi',
      latitude: -7.2100,
      longitude: 22.3600,
      responsibleName: 'Joseph Chef de chantier',
      responsiblePhone: '+243810000009',
      status: 'ACTIVE',
    },
  ]);
  const [
    kaseba, centre, katopa, kabanda, mwanza,
    nkonko, tshibala, lukala, kalomba, mpoyi,
  ] = sites;

  const inspectionDefs = [
    {
      site: kaseba, inspector: inspector, date: at(20, 8), status: 'COMPLETED',
      generalCondition: 'Galerie instable, signalisation absente',
      ppeAvailable: false, ppeUsed: false, specialRiskZones: 'Galerie nord',
      observations: 'Absence de casque, galerie instable, absence de signalisation.',
      immediateMeasures: 'Accès limité à la galerie nord',
      recommendedActions: 'Renforcer la structure et fournir des EPI',
    },
    {
      site: centre, inspector: inspector2, date: at(18, 9), status: 'COMPLETED',
      generalCondition: 'Entrée encombrée, EPI insuffisants',
      ppeAvailable: true, ppeUsed: false, specialRiskZones: 'Entrée du site',
      observations: 'Ouvriers sans casque à l’entrée.',
      immediateMeasures: 'Distribution temporaire d’EPI',
      recommendedActions: 'Affichage obligatoire des EPI',
    },
    {
      site: katopa, inspector: inspector3, date: at(17, 10), status: 'COMPLETED',
      generalCondition: 'Puits mal étayés',
      ppeAvailable: true, ppeUsed: true, specialRiskZones: 'Puits 2',
      observations: 'Boisage ancien, humidité importante.',
      immediateMeasures: 'Limitation à 4 personnes dans le puits',
      recommendedActions: 'Renforcer le boisage',
    },
    {
      site: kabanda, inspector: inspector, date: at(16, 8), status: 'COMPLETED',
      generalCondition: 'Berges instables près de la rivière',
      ppeAvailable: true, ppeUsed: true, specialRiskZones: 'Berge ouest',
      observations: 'Risque de glissement après pluie.',
      immediateMeasures: 'Baliser la berge',
      recommendedActions: 'Déplacer le lavage 20 m plus haut',
    },
    {
      site: mwanza, inspector: inspector2, date: at(15, 11), status: 'OPEN',
      generalCondition: 'Ventilation insuffisante',
      ppeAvailable: false, ppeUsed: false, specialRiskZones: 'Galerie sud',
      observations: 'Air vicié signalé par les creuseurs.',
      immediateMeasures: 'Rotation plus courte des équipes',
      recommendedActions: 'Installer une ventilation manuelle',
    },
    {
      site: nkonko, inspector: inspector3, date: at(14, 7), status: 'COMPLETED',
      generalCondition: 'Cordes d’extraction usées',
      ppeAvailable: true, ppeUsed: true, specialRiskZones: 'Puits principal',
      observations: 'Câble d’extraction effiloché.',
      immediateMeasures: 'Arrêt de l’extraction par câble',
      recommendedActions: 'Remplacer le câble',
    },
    {
      site: tshibala, inspector: inspector, date: at(13, 13), status: 'COMPLETED',
      generalCondition: 'Produits chimiques mal stockés',
      ppeAvailable: true, ppeUsed: false, specialRiskZones: 'Aire de lavage',
      observations: 'Bidons sans étiquette près des enfants du camp.',
      immediateMeasures: 'Isolement des bidons',
      recommendedActions: 'Local fermé pour produits',
    },
    {
      site: lukala, inspector: inspector2, date: at(12, 9), status: 'COMPLETED',
      generalCondition: 'Fosse trop profonde sans rampe',
      ppeAvailable: true, ppeUsed: true, specialRiskZones: 'Fosse est',
      observations: 'Accès par échelle instable.',
      immediateMeasures: 'Interdire l’échelle improvisée',
      recommendedActions: 'Construire une rampe',
    },
    {
      site: kalomba, inspector: inspector3, date: at(5, 10), status: 'COMPLETED',
      generalCondition: 'Site inactif, puits ouverts',
      ppeAvailable: false, ppeUsed: false, specialRiskZones: 'Anciens puits',
      observations: 'Puits non couverts, danger pour riverains.',
      immediateMeasures: 'Clôturer les puits',
      recommendedActions: 'Combler ou couvrir définitivement',
    },
    {
      site: mpoyi, inspector: inspector, date: at(19, 8), status: 'OPEN',
      generalCondition: 'Rampe glissante après pluie',
      ppeAvailable: true, ppeUsed: true, specialRiskZones: 'Rampe rivière',
      observations: 'Plusieurs glissades signalées.',
      immediateMeasures: 'Sable et corde de maintien',
      recommendedActions: 'Reprofiler la rampe',
    },
  ];

  const inspections = [];
  for (const def of inspectionDefs) {
    inspections.push(await Inspection.create({
      code: await nextCode('INSP'),
      siteId: def.site.id,
      inspectorId: def.inspector.id,
      inspectionDate: def.date,
      generalCondition: def.generalCondition,
      ppeAvailable: def.ppeAvailable,
      ppeUsed: def.ppeUsed,
      specialRiskZones: def.specialRiskZones,
      observations: def.observations,
      immediateMeasures: def.immediateMeasures,
      recommendedActions: def.recommendedActions,
      status: def.status,
    }));
  }

  const reportDefs = [
    {
      site: kaseba, reporter: inspector, date: at(20, 9), type: 'COLLAPSE',
      title: 'Éboulement dans une galerie',
      description: 'Présence de fissures importantes et chute de matériaux dans la galerie nord.',
      peopleAffected: 3, immediateMeasures: 'Accès interdit à la galerie.',
      locationDescription: 'Galerie nord', status: 'CONVERTED_TO_RISK',
      reporterName: inspector.name, reporterPhone: inspector.phone,
    },
    {
      site: centre, reporter: null, date: at(19, 14), type: 'UNSAFE_CONDITION',
      title: 'Absence de casques',
      description: 'Plusieurs ouvriers travaillent sans casque.',
      peopleAffected: 6, immediateMeasures: 'Distribution temporaire d’EPI',
      locationDescription: 'Entrée du site', status: 'RECEIVED',
      reporterName: 'Ouvrier anonyme', reporterPhone: '+243899000011',
    },
    {
      site: katopa, reporter: reporter2, date: at(18, 11), type: 'DANGER',
      title: 'Puits sans boisage',
      description: 'Le puits 2 n’a plus de boisage sur 3 mètres.',
      peopleAffected: 4, immediateMeasures: 'Évacuation du puits 2',
      locationDescription: 'Puits 2', status: 'CONVERTED_TO_RISK',
      reporterName: reporter2.name, reporterPhone: reporter2.phone,
    },
    {
      site: kabanda, reporter: reporter, date: at(17, 16), type: 'INCIDENT',
      title: 'Glissement de berge',
      description: 'Une portion de berge s’est affaissée pendant le lavage.',
      peopleAffected: 2, immediateMeasures: 'Arrêt du lavage',
      locationDescription: 'Berge ouest', status: 'REVIEWED',
      reporterName: reporter.name, reporterPhone: reporter.phone,
    },
    {
      site: mwanza, reporter: reporter3, date: at(16, 8), type: 'ACCIDENT',
      title: 'Chute dans la galerie',
      description: 'Un creuseur a chuté sur 2 mètres, jambe blessée.',
      peopleAffected: 1, immediateMeasures: 'Évacuation vers le centre de santé',
      locationDescription: 'Galerie sud', status: 'CONVERTED_TO_RISK',
      reporterName: reporter3.name, reporterPhone: reporter3.phone,
    },
    {
      site: nkonko, reporter: inspector3, date: at(15, 12), type: 'DANGER',
      title: 'Câble d’extraction usé',
      description: 'Le câble du treuil artisanal est effiloché.',
      peopleAffected: 5, immediateMeasures: 'Stop extraction',
      locationDescription: 'Puits principal', status: 'CONVERTED_TO_RISK',
      reporterName: inspector3.name, reporterPhone: inspector3.phone,
    },
    {
      site: tshibala, reporter: reporter, date: at(14, 15), type: 'UNSAFE_CONDITION',
      title: 'Produits chimiques accessibles',
      description: 'Bidons sans étiquette à portée des enfants.',
      peopleAffected: 8, immediateMeasures: 'Isolement des bidons',
      locationDescription: 'Aire de lavage', status: 'REVIEWED',
      reporterName: reporter.name, reporterPhone: reporter.phone,
    },
    {
      site: lukala, reporter: reporter2, date: at(13, 10), type: 'INTERVENTION',
      title: 'Besoin d’une rampe sécurisée',
      description: 'L’accès à la fosse se fait par une échelle instable.',
      peopleAffected: 10, immediateMeasures: 'Interdiction de l’échelle',
      locationDescription: 'Fosse est', status: 'RECEIVED',
      reporterName: reporter2.name, reporterPhone: reporter2.phone,
    },
    {
      site: kalomba, reporter: reporter3, date: at(6, 9), type: 'DANGER',
      title: 'Puits abandonnés ouverts',
      description: 'Anciens puits non couverts, enfants du village à proximité.',
      peopleAffected: 12, immediateMeasures: 'Clôture temporaire',
      locationDescription: 'Anciens puits', status: 'CLOSED',
      reporterName: reporter3.name, reporterPhone: reporter3.phone,
    },
    {
      site: mpoyi, reporter: inspector, date: at(19, 17), type: 'INCIDENT',
      title: 'Glissade sur la rampe',
      description: 'Deux personnes ont glissé après la pluie, sans blessure grave.',
      peopleAffected: 2, immediateMeasures: 'Pose de corde',
      locationDescription: 'Rampe rivière', status: 'RECEIVED',
      reporterName: inspector.name, reporterPhone: inspector.phone,
    },
  ];

  const reports = [];
  for (const def of reportDefs) {
    reports.push(await Report.create({
      code: await nextCode('REP'),
      siteId: def.site.id,
      reporterId: def.reporter?.id || null,
      reporterName: def.reporterName,
      reporterPhone: def.reporterPhone,
      reportDate: def.date,
      type: def.type,
      title: def.title,
      description: def.description,
      peopleAffected: def.peopleAffected,
      immediateMeasures: def.immediateMeasures,
      locationDescription: def.locationDescription,
      status: def.status,
    }));
  }

  const riskDefs = [
    {
      site: kaseba, inspection: inspections[0], report: reports[0],
      title: 'Galerie souterraine présentant un risque d’effondrement',
      description: reports[0].description, riskType: 'COLLAPSE', priority: 'CRITICAL',
      exposedPersons: 3, immediateMeasures: reports[0].immediateMeasures,
      status: 'IN_PROGRESS', identifiedAt: at(20, 9),
    },
    {
      site: centre, inspection: inspections[1], report: reports[1],
      title: 'Signalisation absente à l’entrée',
      description: 'Aucun panneau de danger n’est visible à l’entrée.',
      riskType: 'UNSAFE_CONDITION', priority: 'MEDIUM',
      exposedPersons: 6, immediateMeasures: 'Panneaux temporaires',
      status: 'OPEN', identifiedAt: at(19, 15),
    },
    {
      site: katopa, inspection: inspections[2], report: reports[2],
      title: 'Puits 2 sans boisage',
      description: reports[2].description, riskType: 'DANGER', priority: 'HIGH',
      exposedPersons: 4, immediateMeasures: reports[2].immediateMeasures,
      status: 'IN_PROGRESS', identifiedAt: at(18, 12),
    },
    {
      site: kabanda, inspection: inspections[3], report: reports[3],
      title: 'Berge ouest instable',
      description: reports[3].description, riskType: 'INCIDENT', priority: 'HIGH',
      exposedPersons: 2, immediateMeasures: reports[3].immediateMeasures,
      status: 'OPEN', identifiedAt: at(17, 16),
    },
    {
      site: mwanza, inspection: inspections[4], report: reports[4],
      title: 'Chute et sol irrégulier en galerie',
      description: reports[4].description, riskType: 'ACCIDENT', priority: 'HIGH',
      exposedPersons: 1, immediateMeasures: reports[4].immediateMeasures,
      status: 'RESOLVED', identifiedAt: at(16, 8), resolvedAt: at(19, 10),
    },
    {
      site: nkonko, inspection: inspections[5], report: reports[5],
      title: 'Treuil artisanal défectueux',
      description: reports[5].description, riskType: 'DANGER', priority: 'CRITICAL',
      exposedPersons: 5, immediateMeasures: reports[5].immediateMeasures,
      status: 'IN_PROGRESS', identifiedAt: at(15, 12),
    },
    {
      site: tshibala, inspection: inspections[6], report: reports[6],
      title: 'Stockage dangereux de produits',
      description: reports[6].description, riskType: 'UNSAFE_CONDITION', priority: 'MEDIUM',
      exposedPersons: 8, immediateMeasures: reports[6].immediateMeasures,
      status: 'OPEN', identifiedAt: at(14, 15),
    },
    {
      site: lukala, inspection: inspections[7], report: reports[7],
      title: 'Accès non sécurisé à la fosse',
      description: reports[7].description, riskType: 'OTHER', priority: 'MEDIUM',
      exposedPersons: 10, immediateMeasures: reports[7].immediateMeasures,
      status: 'OPEN', identifiedAt: at(13, 10),
    },
    {
      site: kalomba, inspection: inspections[8], report: reports[8],
      title: 'Puits abandonnés non couverts',
      description: reports[8].description, riskType: 'DANGER', priority: 'HIGH',
      exposedPersons: 12, immediateMeasures: reports[8].immediateMeasures,
      status: 'CLOSED', identifiedAt: at(6, 9), resolvedAt: at(10, 12), closedAt: at(12, 16),
    },
    {
      site: mpoyi, inspection: inspections[9], report: reports[9],
      title: 'Rampe glissante vers la rivière',
      description: reports[9].description, riskType: 'INCIDENT', priority: 'LOW',
      exposedPersons: 2, immediateMeasures: reports[9].immediateMeasures,
      status: 'OPEN', identifiedAt: at(19, 17),
    },
  ];

  const risks = [];
  for (const def of riskDefs) {
    risks.push(await Risk.create({
      code: await nextCode('RISK'),
      siteId: def.site.id,
      inspectionId: def.inspection.id,
      reportId: def.report.id,
      title: def.title,
      description: def.description,
      riskType: def.riskType,
      priority: def.priority,
      exposedPersons: def.exposedPersons,
      immediateMeasures: def.immediateMeasures,
      status: def.status,
      identifiedAt: def.identifiedAt,
      resolvedAt: def.resolvedAt || null,
      closedAt: def.closedAt || null,
    }));
  }

  const actionDefs = [
    {
      risk: risks[0], title: 'Interdire l’accès et sécuriser la galerie',
      description: 'Interdire temporairement l’accès à la galerie et renforcer la structure.',
      responsibleName: 'Responsable sécurité du site', responsiblePhone: responsible.phone,
      dueDate: at(22, 17), status: 'IN_PROGRESS',
    },
    {
      risk: risks[1], title: 'Installer la signalisation d’entrée',
      description: 'Poser des panneaux danger et obligation d’EPI.',
      responsibleName: 'Marie Responsable', responsiblePhone: responsible.phone,
      dueDate: at(25, 17), status: 'PENDING',
    },
    {
      risk: risks[2], title: 'Reboiser le puits 2',
      description: 'Fournir du bois et reconstruire l’étayage.',
      responsibleName: 'Joseph Chef de chantier', responsiblePhone: responsible3.phone,
      dueDate: at(24, 17), status: 'IN_PROGRESS',
    },
    {
      risk: risks[3], title: 'Déplacer l’aire de lavage',
      description: 'Éloigner le lavage de 20 mètres de la berge.',
      responsibleName: 'Grace Sécurité', responsiblePhone: responsible2.phone,
      dueDate: at(26, 17), status: 'PENDING',
    },
    {
      risk: risks[4], title: 'Aplanir le sol de la galerie sud',
      description: 'Combler les trous et poser un éclairage.',
      responsibleName: 'Patrick Inspecteur', responsiblePhone: inspector2.phone,
      dueDate: at(18, 17), status: 'VERIFIED',
      completedAt: at(18, 15), verifiedAt: at(19, 10),
      verificationNotes: 'Sol nivelé, éclairage posé.',
    },
    {
      risk: risks[5], title: 'Remplacer le câble du treuil',
      description: 'Acheter un câble neuf et tester le treuil à vide.',
      responsibleName: 'Joseph Chef de chantier', responsiblePhone: responsible3.phone,
      dueDate: at(21, 17), status: 'IN_PROGRESS',
    },
    {
      risk: risks[6], title: 'Créer un local produits fermé',
      description: 'Coffre ou hutte cadenassée hors de portée des enfants.',
      responsibleName: 'Grace Sécurité', responsiblePhone: responsible2.phone,
      dueDate: at(28, 17), status: 'PENDING',
    },
    {
      risk: risks[7], title: 'Construire une rampe d’accès',
      description: 'Rampe en terre compactée avec main courante.',
      responsibleName: 'Jean Inspecteur', responsiblePhone: inspector.phone,
      dueDate: at(30, 17), status: 'PENDING',
    },
    {
      risk: risks[8], title: 'Couvrir les puits abandonnés',
      description: 'Couverture en bois et signalisation villageoise.',
      responsibleName: 'Marie Responsable', responsiblePhone: responsible.phone,
      dueDate: at(12, 17), status: 'VERIFIED',
      completedAt: at(10, 12), verifiedAt: at(12, 16),
      verificationNotes: 'Puits couverts, clôture en place.',
    },
    {
      risk: risks[9], title: 'Reprofiler la rampe rivière',
      description: 'Ajouter du gravier et une corde de maintien.',
      responsibleName: 'Joseph Chef de chantier', responsiblePhone: responsible3.phone,
      dueDate: at(27, 17), status: 'CANCELLED',
    },
  ];

  for (const def of actionDefs) {
    await CorrectiveAction.create({
      riskId: def.risk.id,
      title: def.title,
      description: def.description,
      responsibleName: def.responsibleName,
      responsiblePhone: def.responsiblePhone,
      dueDate: def.dueDate,
      status: def.status,
      completedAt: def.completedAt || null,
      verifiedAt: def.verifiedAt || null,
      verificationNotes: def.verificationNotes || null,
    });
  }

  const alertDefs = [
    { site: kaseba, report: reports[0], risk: risks[0], type: 'COLLAPSE', priority: 'CRITICAL', channel: 'WHATSAPP', status: 'CREATED' },
    { site: centre, report: reports[1], risk: risks[1], type: 'CRITICAL_RISK', priority: 'MEDIUM', channel: 'APP', status: 'CREATED' },
    { site: katopa, report: reports[2], risk: risks[2], type: 'DANGER', priority: 'HIGH', channel: 'WHATSAPP', status: 'SENT', sentAt: at(18, 12) },
    { site: kabanda, report: reports[3], risk: risks[3], type: 'OTHER', priority: 'HIGH', channel: 'MANUAL', status: 'ACKNOWLEDGED', sentAt: at(17, 16), acknowledgedAt: at(17, 17) },
    { site: mwanza, report: reports[4], risk: risks[4], type: 'ACCIDENT', priority: 'HIGH', channel: 'WHATSAPP', status: 'CLOSED', sentAt: at(16, 8), acknowledgedAt: at(16, 9) },
    { site: nkonko, report: reports[5], risk: risks[5], type: 'DANGER', priority: 'CRITICAL', channel: 'WHATSAPP', status: 'SENT', sentAt: at(15, 12) },
    { site: tshibala, report: reports[6], risk: risks[6], type: 'CRITICAL_RISK', priority: 'MEDIUM', channel: 'APP', status: 'CREATED' },
    { site: lukala, report: reports[7], risk: risks[7], type: 'OTHER', priority: 'MEDIUM', channel: 'MANUAL', status: 'CREATED' },
    { site: kalomba, report: reports[8], risk: risks[8], type: 'DANGER', priority: 'HIGH', channel: 'WHATSAPP', status: 'CLOSED', sentAt: at(6, 9), acknowledgedAt: at(6, 10) },
    { site: mpoyi, report: reports[9], risk: risks[9], type: 'OTHER', priority: 'LOW', channel: 'APP', status: 'CREATED' },
  ];

  for (const def of alertDefs) {
    const code = await nextCode('ALT');
    const message = formatWhatsAppAlert({
      site: def.site,
      risk: def.risk,
      report: def.report,
      alert: { type: def.type, priority: def.priority, code },
    });
    await Alert.create({
      code,
      siteId: def.site.id,
      reportId: def.report.id,
      riskId: def.risk.id,
      type: def.type,
      priority: def.priority,
      message,
      channel: def.channel,
      status: def.status,
      sentAt: def.sentAt || null,
      acknowledgedAt: def.acknowledgedAt || null,
    });
  }

  const attachmentDefs = [
    { reportId: reports[0].id, fileName: 'galerie-nord.jpg' },
    { reportId: reports[1].id, fileName: 'entree-sans-casque.jpg' },
    { inspectionId: inspections[2].id, fileName: 'puits-2-katopa.jpg' },
    { riskId: risks[3].id, fileName: 'berge-ouest.jpg' },
    { reportId: reports[4].id, fileName: 'chute-galerie-sud.jpg' },
    { inspectionId: inspections[5].id, fileName: 'cable-treuil.jpg' },
    { riskId: risks[6].id, fileName: 'bidons-tshibala.jpg' },
    { reportId: reports[7].id, fileName: 'echelle-fosse.jpg' },
    { inspectionId: inspections[8].id, fileName: 'puits-abandonnes.jpg' },
    { riskId: risks[9].id, fileName: 'rampe-riviere.jpg' },
  ];

  for (const def of attachmentDefs) {
    await Attachment.create({
      reportId: def.reportId || null,
      riskId: def.riskId || null,
      inspectionId: def.inspectionId || null,
      fileName: def.fileName,
      fileUrl: `/uploads/demo-${def.fileName}`,
      mimeType: 'image/jpeg',
      fileSize: 120000 + Math.floor(Math.random() * 40000),
    });
  }

  console.log('Seed terminé (~10 lignes par entité).');
  console.log(`Users ${users.length} | Sites ${sites.length} | Inspections ${inspections.length}`);
  console.log(`Reports ${reports.length} | Risks ${risks.length} | Actions 10 | Alerts 10 | Attachments 10`);
  console.log(`Risque critique démo: ${risks[0].code} (IN_PROGRESS) — site ${kaseba.name}`);
  await sequelize.close();
}

seed().catch((err) => {
  console.error('Seed échoué:', err);
  process.exit(1);
});
