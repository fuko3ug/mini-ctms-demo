'use server';

import { prisma } from '@/lib/prisma';

export async function getStudies() {
  return await prisma.study.findMany({
    select: { id: true, name: true, code: true },
    orderBy: { name: 'asc' },
  });
}

export async function getAuditLogs(studyId: string | null) {
  if (studyId) {
    return await prisma.auditLog.findMany({
      where: { studyId },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        study: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } else {
    return await prisma.auditLog.findMany({
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        study: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}