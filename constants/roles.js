const ROLES = {
  ADMIN: 'ADMIN',
  INSPECTOR: 'INSPECTOR',
  RESPONSIBLE: 'RESPONSIBLE',
  REPORTER: 'REPORTER',
};

const ALL_ROLES = Object.values(ROLES);

/** Gestion des comptes. */
const USER_MANAGERS = [ROLES.ADMIN];

/** Création / modification de sites. */
const SITE_WRITERS = [ROLES.ADMIN, ROLES.RESPONSIBLE];

/** Voir risques, inspections, alertes, tableau de bord complet. */
const STAFF = [ROLES.ADMIN, ROLES.INSPECTOR, ROLES.RESPONSIBLE];

/** Convertir un signalement, actions, clôture. */
const RISK_MANAGERS = [ROLES.ADMIN, ROLES.RESPONSIBLE];

/** Fiches d’inspection. */
const INSPECTORS = [ROLES.ADMIN, ROLES.INSPECTOR];

/** Vérifier une action sur le terrain. */
const VERIFIERS = [ROLES.ADMIN, ROLES.INSPECTOR];

/** Peut créer un signalement. */
const REPORTERS = [ROLES.ADMIN, ROLES.INSPECTOR, ROLES.RESPONSIBLE, ROLES.REPORTER];

function isReporterOnly(user) {
  return user?.role === ROLES.REPORTER;
}

module.exports = {
  ROLES,
  ALL_ROLES,
  USER_MANAGERS,
  SITE_WRITERS,
  STAFF,
  RISK_MANAGERS,
  INSPECTORS,
  VERIFIERS,
  REPORTERS,
  isReporterOnly,
};
