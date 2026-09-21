const request = require('supertest');
const createApp = require('../app');

const app = createApp();

describe('LUIZA MINING SAFE API', () => {
  let siteId;
  let reportId;
  let riskId;
  let actionId;
  let inspectionId;

  test('health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('refuse un signalement incomplet', async () => {
    const res = await request(app).post('/api/v1/reports').send({ title: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('crée un site', async () => {
    const res = await request(app).post('/api/v1/sites').send({
      name: 'Kaseba',
      location: 'Luiza',
      responsibleName: 'Jean',
    });
    expect(res.status).toBe(201);
    siteId = res.body.data.id;
    expect(siteId).toBeTruthy();
  });

  test('crée une inspection', async () => {
    const res = await request(app).post('/api/v1/inspections').send({
      siteId,
      generalCondition: 'Galerie instable',
      ppeAvailable: false,
      observations: 'Absence de casque et fissures',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.code).toMatch(/^INSP-/);
    inspectionId = res.body.data.id;
  });

  test('accepte EBOULEMENT comme alias de COLLAPSE', async () => {
    const res = await request(app).post('/api/v1/reports').send({
      siteId,
      reporterName: 'Ouvrier',
      type: 'EBOULEMENT',
      title: 'Chute de matériaux',
      description: 'Alias métier accepté',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.type).toBe('COLLAPSE');
  });

  test('ajoute un risque à une inspection', async () => {
    const res = await request(app).post(`/api/v1/inspections/${inspectionId}/risks`).send({
      title: 'Galerie instable',
      description: 'Risque d’effondrement constaté pendant l’inspection',
      riskType: 'COLLAPSE',
      priority: 'HIGH',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.inspectionId).toBe(inspectionId);
    expect(res.body.data.code).toMatch(/^RISK-/);
  });

  test('refuse une pièce jointe sans parent unique', async () => {
    const res = await request(app).post('/api/v1/attachments').send({
      fileName: 'photo.jpg',
      fileUrl: '/uploads/photo.jpg',
      mimeType: 'image/jpeg',
    });
    expect(res.status).toBe(400);
  });

  test('crée un signalement', async () => {
    const res = await request(app).post('/api/v1/reports').send({
      siteId,
      reporterName: 'Inspecteur terrain',
      type: 'COLLAPSE',
      title: 'Éboulement dans la galerie',
      description: 'Présence de fissures importantes et chute de matériaux dans la galerie nord.',
      peopleAffected: 3,
      immediateMeasures: 'Accès interdit à la galerie',
      locationDescription: 'Galerie nord',
    });
    expect(res.status).toBe(201);
    reportId = res.body.data.id;
    expect(res.body.data.code).toMatch(/^REP-/);
  });

  test('convertit le signalement en risque critique', async () => {
    const res = await request(app)
      .post(`/api/v1/reports/${reportId}/convert-to-risk`)
      .send({ priority: 'CRITICAL' });
    expect(res.status).toBe(201);
    riskId = res.body.data.id;
    expect(res.body.data.code).toMatch(/^RISK-/);
    expect(res.body.data.priority).toBe('CRITICAL');
    expect(res.body.data.alerts.length).toBeGreaterThan(0);
  });

  test('crée et démarre une action corrective', async () => {
    const created = await request(app).post(`/api/v1/risks/${riskId}/actions`).send({
      title: 'Interdire l’accès et sécuriser la galerie',
      description: 'Interdire temporairement l’accès et renforcer la structure.',
      responsibleName: 'Responsable sécurité du site',
    });
    expect(created.status).toBe(201);
    actionId = created.body.data.id;

    const started = await request(app).post(`/api/v1/actions/${actionId}/start`);
    expect(started.status).toBe(200);
    expect(started.body.data.status).toBe('IN_PROGRESS');
  });

  test('termine, vérifie, résout et clôture', async () => {
    const completed = await request(app).post(`/api/v1/actions/${actionId}/complete`);
    expect(completed.status).toBe(200);

    const verified = await request(app)
      .post(`/api/v1/actions/${actionId}/verify`)
      .send({ verificationNotes: 'Galerie sécurisée' });
    expect(verified.status).toBe(200);
    expect(verified.body.data.status).toBe('VERIFIED');
    expect(verified.body.data.verifiedAt).toBeTruthy();

    const resolved = await request(app).post(`/api/v1/risks/${riskId}/resolve`);
    expect(resolved.status).toBe(200);
    expect(resolved.body.data.status).toBe('RESOLVED');

    const closed = await request(app).post(`/api/v1/risks/${riskId}/close`);
    expect(closed.status).toBe(200);
    expect(closed.body.data.status).toBe('CLOSED');
  });

  test('dashboard summary', async () => {
    const res = await request(app).get('/api/v1/dashboard/summary');
    expect(res.status).toBe(200);
    expect(res.body.data.sites).toBeGreaterThanOrEqual(1);
    expect(res.body.data.closedRisks).toBeGreaterThanOrEqual(1);
  });
});
