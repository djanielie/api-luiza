function formatWhatsAppAlert({ site, alert, risk, report }) {
  const type = alert?.type || report?.type || risk?.riskType || 'OTHER';
  const priority = alert?.priority || risk?.priority || 'CRITICAL';
  const situation = alert?.message || report?.description || risk?.description || '';
  const people = report?.peopleAffected ?? risk?.exposedPersons;
  const measures = report?.immediateMeasures || risk?.immediateMeasures || 'Non renseigné';
  const reference = risk?.code || alert?.code || report?.code || '';

  return [
    '🚨 LUIZA MINING SAFE ALERT',
    '',
    `Site : ${site?.name || 'Inconnu'}`,
    `Type : ${type}`,
    `Priorité : ${priority}`,
    '',
    'Situation :',
    situation,
    '',
    `Personnes exposées : ${people == null ? 'Non renseigné' : people}`,
    '',
    'Mesure immédiate :',
    measures,
    '',
    `Référence : ${reference}`,
  ].join('\n');
}

module.exports = { formatWhatsAppAlert };
