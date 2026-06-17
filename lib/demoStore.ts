export type StudyStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED'

export type ParticipantStatus =
  | 'REGISTERED'
  | 'SCREENING'
  | 'ENROLLED'
  | 'KIT_SENT'
  | 'KIT_ACTIVATED'
  | 'SAMPLE_RECEIVED'
  | 'COMPLETED'
  | 'WITHDRAWN'

export type Study = {
  id: string
  name: string
  code: string
  description: string
  status: StudyStatus
  createdAt: string
}

export type Participant = {
  id: string
  studyId: string
  participantCode: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  status: ParticipantStatus
  dateOfBirth: string | null
  address: string | null
  createdAt: string
}

export type Kit = {
  id: string
  participantId: string
  kitCode: string
  status: 'SHIPPED' | 'ACTIVATED'
  shippedAt: string | null
  activatedAt: string | null
}

export type AuditLog = {
  id: string
  action: string
  actorName: string
  actorRole: string
  targetType: string
  targetId: string
  studyId: string
  studyCode: string
  metadata: Record<string, string>
  createdAt: string
}

export type DemoData = {
  studies: Study[]
  participants: Participant[]
  kits: Kit[]
  auditLogs: AuditLog[]
}

export type DashboardStats = {
  totalStudies: number
  totalParticipants: number
  screening: number
  enrolled: number
  kitSent: number
  sampleReceived: number
  completed: number
  withdrawn: number
}

export const DEMO_PARTICIPANT_EMAIL = 'participant@example.com'
export const DEMO_KIT_CODE = 'KIT-SKIN-DEMO'

const STORAGE_KEY = 'mini-ctms-demo-data-v2'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function createSeedData(): DemoData {
  const studies: Study[] = [
    {
      id: 'study-1',
      name: 'Aurora Skin Study',
      code: 'SKIN-2024',
      description: 'Phase II topical treatment for mild atopic dermatitis.',
      status: 'ACTIVE',
      createdAt: '2025-09-12T10:00:00.000Z',
    },
    {
      id: 'study-2',
      name: 'Vertex Dermatology Trial',
      code: 'DERM-2025',
      description: 'Randomized study evaluating a novel biologic for psoriasis.',
      status: 'ACTIVE',
      createdAt: '2025-11-03T10:00:00.000Z',
    },
    {
      id: 'study-3',
      name: 'Chronic Pain Observational',
      code: 'PAIN-2026',
      description: 'Observational registry tracking home sample collection workflows.',
      status: 'PAUSED',
      createdAt: '2026-01-18T10:00:00.000Z',
    },
  ]

  const statusPlan: Array<{ studyId: string; status: ParticipantStatus; code: string; first: string; last: string; email?: string }> = [
    { studyId: 'study-1', status: 'SCREENING', code: 'SKIN-001', first: 'Emma', last: 'Johnson' },
    { studyId: 'study-1', status: 'SCREENING', code: 'SKIN-002', first: 'Liam', last: 'Carter' },
    { studyId: 'study-1', status: 'SCREENING', code: 'SKIN-003', first: 'Olivia', last: 'Nguyen' },
    { studyId: 'study-2', status: 'SCREENING', code: 'DERM-001', first: 'Noah', last: 'Patel' },
    { studyId: 'study-2', status: 'SCREENING', code: 'DERM-002', first: 'Ava', last: 'Brooks' },
    { studyId: 'study-2', status: 'SCREENING', code: 'DERM-003', first: 'Ethan', last: 'Lopez' },
    { studyId: 'study-3', status: 'SCREENING', code: 'PAIN-001', first: 'Mia', last: 'Reed' },
    { studyId: 'study-3', status: 'SCREENING', code: 'PAIN-002', first: 'Lucas', last: 'Kim' },

    { studyId: 'study-1', status: 'ENROLLED', code: 'SKIN-004', first: 'Sophia', last: 'Martin', email: DEMO_PARTICIPANT_EMAIL },
    { studyId: 'study-1', status: 'ENROLLED', code: 'SKIN-005', first: 'Jackson', last: 'Lee' },
    { studyId: 'study-1', status: 'ENROLLED', code: 'SKIN-006', first: 'Isabella', last: 'Clark' },
    { studyId: 'study-1', status: 'ENROLLED', code: 'SKIN-007', first: 'Aiden', last: 'Walker' },
    { studyId: 'study-2', status: 'ENROLLED', code: 'DERM-004', first: 'Charlotte', last: 'Hall' },
    { studyId: 'study-2', status: 'ENROLLED', code: 'DERM-005', first: 'Mason', last: 'Young' },
    { studyId: 'study-2', status: 'ENROLLED', code: 'DERM-006', first: 'Amelia', last: 'Allen' },
    { studyId: 'study-2', status: 'ENROLLED', code: 'DERM-007', first: 'Logan', last: 'King' },
    { studyId: 'study-3', status: 'ENROLLED', code: 'PAIN-003', first: 'Harper', last: 'Wright' },
    { studyId: 'study-3', status: 'ENROLLED', code: 'PAIN-004', first: 'Elijah', last: 'Scott' },
    { studyId: 'study-3', status: 'ENROLLED', code: 'PAIN-005', first: 'Evelyn', last: 'Green' },
    { studyId: 'study-3', status: 'ENROLLED', code: 'PAIN-006', first: 'James', last: 'Baker' },

    { studyId: 'study-1', status: 'KIT_SENT', code: 'SKIN-008', first: 'Benjamin', last: 'Adams' },
    { studyId: 'study-2', status: 'KIT_SENT', code: 'DERM-008', first: 'Abigail', last: 'Nelson' },
    { studyId: 'study-3', status: 'KIT_SENT', code: 'PAIN-007', first: 'Henry', last: 'Hill' },

    { studyId: 'study-2', status: 'SAMPLE_RECEIVED', code: 'DERM-009', first: 'Emily', last: 'Ramirez' },
    { studyId: 'study-3', status: 'SAMPLE_RECEIVED', code: 'PAIN-008', first: 'Daniel', last: 'Campbell' },

    { studyId: 'study-1', status: 'COMPLETED', code: 'SKIN-009', first: 'Grace', last: 'Mitchell' },

    { studyId: 'study-3', status: 'WITHDRAWN', code: 'PAIN-009', first: 'Michael', last: 'Roberts' },
  ]

  const participants: Participant[] = statusPlan.map((entry, index) => ({
    id: `participant-${index + 1}`,
    studyId: entry.studyId,
    participantCode: entry.code,
    firstName: entry.first,
    lastName: entry.last,
    email: entry.email ?? `${entry.code.toLowerCase()}@demo.ctms`,
    phone: index % 3 === 0 ? null : `+1-555-01${String(index).padStart(2, '0')}`,
    status: entry.status,
    dateOfBirth: index % 4 === 0 ? null : `198${index % 10}-0${(index % 8) + 1}-15`,
    address: index % 5 === 0 ? null : `${100 + index} Demo Street`,
    createdAt: `2026-0${(index % 6) + 1}-10T12:00:00.000Z`,
  }))

  const kits: Kit[] = [
    {
      id: 'kit-1',
      participantId: 'participant-9',
      kitCode: DEMO_KIT_CODE,
      status: 'SHIPPED',
      shippedAt: '2026-02-01T10:00:00.000Z',
      activatedAt: null,
    },
    {
      id: 'kit-2',
      participantId: 'participant-20',
      kitCode: 'KIT-SKIN-008',
      status: 'SHIPPED',
      shippedAt: '2026-02-05T10:00:00.000Z',
      activatedAt: null,
    },
  ]

  const auditLogs: AuditLog[] = [
    {
      id: 'log-1',
      action: 'CREATE_PARTICIPANT',
      actorName: 'Coordinator User',
      actorRole: 'COORDINATOR',
      targetType: 'PARTICIPANT',
      targetId: 'participant-1',
      studyId: 'study-1',
      studyCode: 'SKIN-2024',
      metadata: { participantCode: 'SKIN-001' },
      createdAt: '2026-01-10T09:00:00.000Z',
    },
    {
      id: 'log-2',
      action: 'UPDATE_PARTICIPANT_STATUS',
      actorName: 'Coordinator User',
      actorRole: 'COORDINATOR',
      targetType: 'PARTICIPANT',
      targetId: 'participant-9',
      studyId: 'study-1',
      studyCode: 'SKIN-2024',
      metadata: { from: 'SCREENING', to: 'ENROLLED' },
      createdAt: '2026-01-15T11:30:00.000Z',
    },
    {
      id: 'log-3',
      action: 'CREATE_KIT',
      actorName: 'Coordinator User',
      actorRole: 'COORDINATOR',
      targetType: 'KIT',
      targetId: 'kit-2',
      studyId: 'study-1',
      studyCode: 'SKIN-2024',
      metadata: { kitCode: 'KIT-SKIN-008' },
      createdAt: '2026-02-05T14:00:00.000Z',
    },
    {
      id: 'log-4',
      action: 'UPDATE_PARTICIPANT_STATUS',
      actorName: 'Coordinator User',
      actorRole: 'COORDINATOR',
      targetType: 'PARTICIPANT',
      targetId: 'participant-24',
      studyId: 'study-2',
      studyCode: 'DERM-2025',
      metadata: { from: 'KIT_SENT', to: 'SAMPLE_RECEIVED' },
      createdAt: '2026-02-12T16:45:00.000Z',
    },
    {
      id: 'log-5',
      action: 'UPDATE_PARTICIPANT_STATUS',
      actorName: 'Admin User',
      actorRole: 'ADMIN',
      targetType: 'PARTICIPANT',
      targetId: 'participant-27',
      studyId: 'study-3',
      studyCode: 'PAIN-2026',
      metadata: { from: 'ENROLLED', to: 'WITHDRAWN' },
      createdAt: '2026-02-18T08:20:00.000Z',
    },
  ]

  return { studies, participants, kits, auditLogs }
}

function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('demo-data-changed'))
  }
}

function normalizeDemoData(data: DemoData): DemoData {
  return {
    studies: data.studies ?? [],
    participants: data.participants ?? [],
    kits: data.kits ?? [],
    auditLogs: data.auditLogs ?? [],
  }
}

export function getDemoData(): DemoData {
  if (typeof window === 'undefined') {
    return createSeedData()
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    const seed = createSeedData()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }

  try {
    return normalizeDemoData(JSON.parse(stored) as DemoData)
  } catch {
    const seed = createSeedData()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
    return seed
  }
}

export function saveDemoData(data: DemoData): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeDemoData(data)))
  notifyChange()
}

export function getDashboardStats(data: DemoData): DashboardStats {
  const participants = data.participants
  return {
    totalStudies: data.studies.length,
    totalParticipants: participants.length,
    screening: participants.filter((p) => p.status === 'SCREENING').length,
    enrolled: participants.filter((p) => p.status === 'ENROLLED').length,
    kitSent: participants.filter((p) => p.status === 'KIT_SENT').length,
    sampleReceived: participants.filter((p) => p.status === 'SAMPLE_RECEIVED').length,
    completed: participants.filter((p) => p.status === 'COMPLETED').length,
    withdrawn: participants.filter((p) => p.status === 'WITHDRAWN').length,
  }
}

export function getStudyById(data: DemoData, id: string): Study | undefined {
  return data.studies.find((study) => study.id === id)
}

export function getParticipantsByStudyId(data: DemoData, studyId: string): Participant[] {
  return data.participants.filter((participant) => participant.studyId === studyId)
}

export function getParticipantById(data: DemoData, id: string): Participant | undefined {
  return data.participants.find((participant) => participant.id === id)
}

export function getParticipantByCode(data: DemoData, code: string): Participant | undefined {
  return data.participants.find((participant) => participant.participantCode === code)
}

export function getParticipantByEmail(data: DemoData, email: string): Participant | undefined {
  return data.participants.find((participant) => participant.email === email)
}

export function getStudyForParticipant(data: DemoData, participant: Participant): Study | undefined {
  return getStudyById(data, participant.studyId)
}

export function getKitsForParticipant(data: DemoData, participantId: string): Kit[] {
  return data.kits.filter((kit) => kit.participantId === participantId)
}

export function getAuditLogs(data: DemoData, studyId?: string | null): AuditLog[] {
  const logs = [...data.auditLogs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  if (!studyId) return logs
  return logs.filter((log) => log.studyId === studyId)
}

function appendAuditLog(
  data: DemoData,
  entry: Omit<AuditLog, 'id' | 'createdAt'> & { createdAt?: string }
): DemoData {
  const log: AuditLog = {
    ...entry,
    id: generateId(),
    createdAt: entry.createdAt ?? new Date().toISOString(),
  }
  return { ...data, auditLogs: [log, ...data.auditLogs] }
}

export function createStudy(input: {
  name: string
  code: string
  description: string
  status: StudyStatus
}): Study {
  const data = getDemoData()
  const study: Study = {
    id: generateId(),
    name: input.name.trim(),
    code: input.code.trim().toUpperCase(),
    description: input.description.trim(),
    status: input.status,
    createdAt: new Date().toISOString(),
  }

  const nextData = appendAuditLog(
    { ...data, studies: [study, ...data.studies] },
    {
      action: 'CREATE_STUDY',
      actorName: 'Admin User',
      actorRole: 'ADMIN',
      targetType: 'STUDY',
      targetId: study.id,
      studyId: study.id,
      studyCode: study.code,
      metadata: { name: study.name, code: study.code },
    }
  )

  saveDemoData(nextData)
  return study
}

export function activateKit(participantId: string, kitCode: string): { success: true; kit: Kit } | { success: false; error: string } {
  const data = getDemoData()
  const kit = data.kits.find((item) => item.kitCode === kitCode.trim())

  if (!kit) {
    return { success: false, error: 'Invalid kit code' }
  }

  if (kit.participantId !== participantId) {
    return { success: false, error: 'This kit does not belong to you' }
  }

  if (kit.status === 'ACTIVATED') {
    return { success: false, error: 'Kit is already activated' }
  }

  const participant = getParticipantById(data, participantId)
  if (!participant) {
    return { success: false, error: 'Participant not found' }
  }

  const study = getStudyForParticipant(data, participant)
  const activatedAt = new Date().toISOString()
  const updatedKit: Kit = { ...kit, status: 'ACTIVATED', activatedAt }
  const updatedParticipants = data.participants.map((item) =>
    item.id === participantId ? { ...item, status: 'KIT_ACTIVATED' as ParticipantStatus } : item
  )
  const updatedKits = data.kits.map((item) => (item.id === kit.id ? updatedKit : item))

  let nextData: DemoData = {
    ...data,
    participants: updatedParticipants,
    kits: updatedKits,
  }

  nextData = appendAuditLog(nextData, {
    action: 'ACTIVATE_KIT',
    actorName: `${participant.firstName} ${participant.lastName}`,
    actorRole: 'PARTICIPANT',
    targetType: 'KIT',
    targetId: kit.id,
    studyId: participant.studyId,
    studyCode: study?.code ?? 'UNKNOWN',
    metadata: { kitCode: kit.kitCode, activatedBy: participant.email },
  })

  saveDemoData(nextData)
  return { success: true, kit: updatedKit }
}

export function isStudyCodeTaken(code: string, excludeId?: string): boolean {
  const normalized = code.trim().toUpperCase()
  return getDemoData().studies.some(
    (study) => study.code.toUpperCase() === normalized && study.id !== excludeId
  )
}

export { createSeedData }
