const { z } = require('zod');
const {
  USER_ROLES,
  SITE_STATUSES,
  RISK_TYPES,
  RISK_PRIORITIES,
  RISK_STATUSES,
  REPORT_TYPES,
  REPORT_STATUSES,
  ACTION_STATUSES,
  ALERT_TYPES,
  ALERT_PRIORITIES,
  ALERT_CHANNELS,
  normalizeType,
} = require('../constants/enums');

const uuid = z.string().uuid();
const reportType = z.preprocess(normalizeType, z.enum(REPORT_TYPES));
const riskType = z.preprocess(normalizeType, z.enum(RISK_TYPES));
const alertType = z.preprocess(normalizeType, z.enum(ALERT_TYPES));

const siteCreate = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  responsibleName: z.string().optional().nullable(),
  responsiblePhone: z.string().optional().nullable(),
  status: z.enum(SITE_STATUSES).optional(),
});

const siteUpdate = siteCreate.partial();

const reportCreate = z.object({
  siteId: uuid,
  reporterId: uuid.optional().nullable(),
  reporterName: z.string().optional().nullable(),
  reporterPhone: z.string().optional().nullable(),
  reportDate: z.string().optional(),
  type: reportType,
  title: z.string().min(1),
  description: z.string().min(1),
  peopleAffected: z.number().int().optional().nullable(),
  immediateMeasures: z.string().optional().nullable(),
  locationDescription: z.string().optional().nullable(),
});

const reportStatus = z.object({
  status: z.enum(REPORT_STATUSES),
});

const inspectionRisk = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  riskType: riskType,
  priority: z.enum(RISK_PRIORITIES),
  exposedPersons: z.number().int().optional().nullable(),
  immediateMeasures: z.string().optional().nullable(),
});

const inspectionCreate = z.object({
  siteId: uuid,
  inspectorId: uuid.optional().nullable(),
  inspectionDate: z.string().optional(),
  generalCondition: z.string().optional().nullable(),
  ppeAvailable: z.boolean().optional().nullable(),
  ppeUsed: z.boolean().optional().nullable(),
  specialRiskZones: z.string().optional().nullable(),
  observations: z.string().optional().nullable(),
  immediateMeasures: z.string().optional().nullable(),
  recommendedActions: z.string().optional().nullable(),
  risks: z.array(inspectionRisk).optional(),
});

const inspectionUpdate = inspectionCreate.omit({ siteId: true, risks: true }).partial();

const riskCreate = z.object({
  siteId: uuid,
  inspectionId: uuid.optional().nullable(),
  reportId: uuid.optional().nullable(),
  title: z.string().min(1),
  description: z.string().min(1),
  riskType: riskType,
  priority: z.enum(RISK_PRIORITIES),
  exposedPersons: z.number().int().optional().nullable(),
  immediateMeasures: z.string().optional().nullable(),
});

const riskUpdate = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  riskType: riskType.optional(),
  priority: z.enum(RISK_PRIORITIES).optional(),
  exposedPersons: z.number().int().optional().nullable(),
  immediateMeasures: z.string().optional().nullable(),
  status: z.enum(RISK_STATUSES).optional(),
});

const convertToRisk = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  riskType: riskType.optional(),
  priority: z.enum(RISK_PRIORITIES).optional(),
  exposedPersons: z.number().int().optional().nullable(),
  immediateMeasures: z.string().optional().nullable(),
});

const actionCreate = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  responsibleName: z.string().min(1),
  responsiblePhone: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

const actionUpdate = actionCreate.partial().extend({
  status: z.enum(ACTION_STATUSES).optional(),
  verificationNotes: z.string().optional().nullable(),
});

const alertCreate = z.object({
  siteId: uuid,
  reportId: uuid.optional().nullable(),
  riskId: uuid.optional().nullable(),
  type: alertType,
  priority: z.enum(ALERT_PRIORITIES),
  message: z.string().min(1),
  channel: z.enum(ALERT_CHANNELS).optional(),
});

const attachmentCreate = z.object({
  reportId: uuid.optional().nullable(),
  riskId: uuid.optional().nullable(),
  inspectionId: uuid.optional().nullable(),
  fileName: z.string().min(1),
  fileUrl: z.string().min(1),
  mimeType: z.string().min(1),
  fileSize: z.number().int().optional().nullable(),
}).refine((data) => {
  const linked = [data.reportId, data.riskId, data.inspectionId].filter(Boolean);
  return linked.length === 1;
}, {
  message: 'Le fichier doit être lié à exactement un objet : report, risk ou inspection',
});

const userCreate = z.object({
  name: z.string().min(1),
  phone: z.string().optional().nullable(),
  role: z.enum(USER_ROLES).optional(),
});

module.exports = {
  siteCreate,
  siteUpdate,
  reportCreate,
  reportStatus,
  inspectionCreate,
  inspectionUpdate,
  inspectionRisk,
  riskCreate,
  riskUpdate,
  convertToRisk,
  actionCreate,
  actionUpdate,
  alertCreate,
  attachmentCreate,
  userCreate,
};
