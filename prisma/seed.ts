import 'dotenv/config';
import path from 'node:path';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
  if (!databaseUrl.startsWith('file:')) {
    return databaseUrl;
  }

  const dbPath = databaseUrl.slice('file:'.length);
  const resolvedPath = path.isAbsolute(dbPath)
    ? dbPath
    : path.join(process.cwd(), dbPath);

  return `file:${resolvedPath}`;
}

const adapter = new PrismaBetterSqlite3({ url: getDatabaseUrl() });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // Create mock users for audit logs
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
      password: 'admin123', // In real app, hash this
    },
  });

  const coordinatorUser = await prisma.user.upsert({
    where: { email: 'coordinator@example.com' },
    update: {},
    create: {
      email: 'coordinator@example.com',
      name: 'Coordinator User',
      role: 'COORDINATOR',
      password: 'coord123',
    },
  });

  const piUser = await prisma.user.upsert({
    where: { email: 'pi@example.com' },
    update: {},
    create: {
      email: 'pi@example.com',
      name: 'PI User',
      role: 'PI',
      password: 'pi123',
    },
  });

  // Create studies
  const skinStudy = await prisma.study.upsert({
    where: { code: 'SKIN2026' },
    update: {},
    create: {
      name: 'Skin Microbiome Study',
      code: 'SKIN2026',
      description: 'A study investigating the skin microbiome in patients with dermatological conditions.',
      status: 'ACTIVE',
    },
  });

  const dermStudy = await prisma.study.upsert({
    where: { code: 'DERM2026' },
    update: {},
    create: {
      name: 'Remote Dermatology Follow-up Study',
      code: 'DERM2026',
      description: 'A remote follow-up study for patients with chronic skin conditions using teledermatology.',
      status: 'ACTIVE',
    },
  });

  // Create participants
  const participantsData = [
    {
      studyId: skinStudy.id,
      participantCode: 'SKIN001',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '555-123-4567',
      status: 'REGISTERED',
      dateOfBirth: new Date('1990-05-15'),
      address: '123 Main St, Anytown, USA',
    },
    {
      studyId: skinStudy.id,
      participantCode: 'SKIN002',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '555-987-6543',
      status: 'SCREENING',
      dateOfBirth: new Date('1985-08-22'),
      address: '456 Oak Ave, Somewhere, USA',
    },
    {
      studyId: skinStudy.id,
      participantCode: 'SKIN003',
      firstName: 'Emily',
      lastName: 'Johnson',
      email: 'emily.johnson@example.com',
      phone: '555-456-7890',
      status: 'ENROLLED',
      dateOfBirth: new Date('1992-12-03'),
      address: '789 Pine Rd, Elsewhere, USA',
    },
    {
      studyId: skinStudy.id,
      participantCode: 'SKIN004',
      firstName: 'Michael',
      lastName: 'Williams',
      email: 'michael.williams@example.com',
      phone: '555-321-6549',
      status: 'KIT_SENT',
      dateOfBirth: new Date('1988-03-10'),
      address: '321 Elm Blvd, Nowhere, USA',
    },
    {
      studyId: skinStudy.id,
      participantCode: 'SKIN005',
      firstName: 'Sarah',
      lastName: 'Brown',
      email: 'sarah.brown@example.com',
      phone: '555-654-3210',
      status: 'KIT_ACTIVATED',
      dateOfBirth: new Date('1995-07-19'),
      address: '654 Maple Ln, Anywhere, USA',
    },
    {
      studyId: dermStudy.id,
      participantCode: 'DERM001',
      firstName: 'David',
      lastName: 'Miller',
      email: 'david.miller@example.com',
      phone: '555-111-2222',
      status: 'SAMPLE_RECEIVED',
      dateOfBirth: new Date('1980-11-30'),
      address: '111 Cedar St, Somewhere, USA',
    },
    {
      studyId: dermStudy.id,
      participantCode: 'DERM002',
      firstName: 'Lisa',
      lastName: 'Davis',
      email: 'lisa.davis@example.com',
      phone: '555-333-4444',
      status: 'COMPLETED',
      dateOfBirth: new Date('1993-09-14'),
      address: '333 Oak Dr, Elsewhere, USA',
    },
    {
      studyId: dermStudy.id,
      participantCode: 'DERM003',
      firstName: 'Robert',
      lastName: 'Garcia',
      email: 'robert.garcia@example.com',
      phone: '555-555-6666',
      status: 'WITHDRAWN',
      dateOfBirth: new Date('1987-02-28'),
      address: '555 Pine Ave, Nowhere, USA',
    },
    {
      studyId: dermStudy.id,
      participantCode: 'DERM004',
      firstName: 'Amanda',
      lastName: 'Wilson',
      email: 'amanda.wilson@example.com',
      phone: '555-777-8888',
      status: 'REGISTERED',
      dateOfBirth: new Date('1991-05-05'),
      address: '777 Elm Rd, Anywhere, USA',
    },
    {
      studyId: dermStudy.id,
      participantCode: 'DERM005',
      firstName: 'Kevin',
      lastName: 'Taylor',
      email: 'kevin.taylor@example.com',
      phone: '555-999-0000',
      status: 'SCREENING',
      dateOfBirth: new Date('1986-12-25'),
      address: '999 Maple Ln, Somewhere, USA',
    },
  ];

  const participants = [];
  for (const pData of participantsData) {
    const participant = await prisma.participant.upsert({
      where: { participantCode: pData.participantCode },
      update: {},
      create: pData,
    });
    participants.push(participant);
    console.log(`Created participant: ${participant.participantCode}`);

    // Create audit log for participant creation
    await prisma.auditLog.create({
      data: {
        actorId: adminUser.id,
        actorRole: adminUser.role,
        action: 'CREATE_PARTICIPANT',
        targetType: 'PARTICIPANT',
        targetId: participant.id,
        studyId: participant.studyId,
        metadata: {
          createdBy: adminUser.email,
          participantCode: participant.participantCode,
        },
      },
    });
  }

  // Create kits for some participants
  const kitsData = [
    {
      participantId: participants[3].id, // SKIN004
      kitCode: 'KIT-SKIN001',
      status: 'SHIPPED',
    },
    {
      participantId: participants[4].id, // SKIN005
      kitCode: 'KIT-SKIN002',
      status: 'SHIPPED',
    },
    {
      participantId: participants[5].id, // DERM001
      kitCode: 'KIT-DERM001',
      status: 'SHIPPED',
    },
    {
      participantId: participants[6].id, // DERM002
      kitCode: 'KIT-DERM002',
      status: 'SHIPPED',
    },
  ];

  const kits = [];
  for (const kData of kitsData) {
    const participant = participants.find((p) => p.id === kData.participantId)!;
    const kit = await prisma.kit.upsert({
      where: { kitCode: kData.kitCode },
      update: {},
      create: kData,
    });
    kits.push(kit);
    console.log(`Created kit: ${kit.kitCode}`);

    // Create audit log for kit creation
    await prisma.auditLog.create({
      data: {
        actorId: coordinatorUser.id,
        actorRole: coordinatorUser.role,
        action: 'CREATE_KIT',
        targetType: 'KIT',
        targetId: kit.id,
        studyId: participant.studyId,
        metadata: {
          createdBy: coordinatorUser.email,
          kitCode: kit.kitCode,
          participantId: kit.participantId,
        },
      },
    });
  }

  // Update some kits to change status and create audit logs
  // Activate the kit for SKIN005
  await prisma.kit.update({
    where: { id: kits[1].id },
    data: {
      status: 'ACTIVATED',
      activatedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: coordinatorUser.id,
      actorRole: coordinatorUser.role,
      action: 'ACTIVATE_KIT',
      targetType: 'KIT',
      targetId: kits[1].id,
      studyId: participants[4].studyId,
      metadata: {
        activatedBy: coordinatorUser.email,
        kitCode: kits[1].kitCode,
      },
    },
  });

  // Receive the kit for DERM001
  await prisma.kit.update({
    where: { id: kits[2].id },
    data: {
      status: 'RECEIVED',
      receivedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: coordinatorUser.id,
      actorRole: coordinatorUser.role,
      action: 'RECEIVE_KIT',
      targetType: 'KIT',
      targetId: kits[2].id,
      studyId: participants[5].studyId,
      metadata: {
        receivedBy: coordinatorUser.email,
        kitCode: kits[2].kitCode,
      },
    },
  });

  // Update some participant statuses and create audit logs
  // Change SKIN002 from SCREENING to ENROLLED
  await prisma.participant.update({
    where: { id: participants[1].id },
    data: {
      status: 'ENROLLED',
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: piUser.id,
      actorRole: piUser.role,
      action: 'UPDATE_PARTICIPANT_STATUS',
      targetType: 'PARTICIPANT',
      targetId: participants[1].id,
      studyId: participants[1].studyId,
      metadata: {
        changedBy: piUser.email,
        previousStatus: 'SCREENING',
        newStatus: 'ENROLLED',
      },
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    async () => {
      await prisma.$disconnect();
    }
  });