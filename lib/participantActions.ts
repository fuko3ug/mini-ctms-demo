'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function activateKit(formData: FormData) {
  const kitCode = formData.get('kitCode') as string;
  const participantId = formData.get('participantId') as string;

  if (!kitCode || !participantId) {
    throw new Error('Missing kit code or participant ID');
  }

  try {
    // Find the kit by code
    const kitData = await prisma.kit.findUnique({
      where: { kitCode: kitCode.trim() },
    });

    if (!kitData) {
      throw new Error('Invalid kit code');
    }

    // Check if the kit belongs to this participant
    if (kitData.participantId !== participantId) {
      throw new Error('This kit does not belong to you');
    }

    // Check if the kit is already activated
    if (kitData.status === 'ACTIVATED') {
      throw new Error('Kit is already activated');
    }

    // Activate the kit
    const updatedKit = await prisma.kit.update({
      where: { id: kitData.id },
      data: {
        status: 'ACTIVATED',
        activatedAt: new Date(),
      },
    });

    // We need to get the participant to get the studyId and actor info
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: { study: true },
    });

    if (!participant) {
      throw new Error('Participant not found');
    }

    // In a real app, we would get the actor from the session
    // For demo, we'll use a placeholder actor ID and role
    // We'll use the participant's ID as actorId for simplicity
    const actorId = participant.id;
    const actorRole = 'PARTICIPANT'; // This should come from the user's role

    // Create an audit log
    await prisma.auditLog.create({
      data: {
        actorId,
        actorRole,
        action: 'ACTIVATE_KIT',
        targetType: 'KIT',
        targetId: kitData.id,
        studyId: participant.studyId,
        metadata: {
          activatedBy: participant.email,
          kitCode: kitData.kitCode,
        },
      },
    });

    // Revalidate the participant page
    revalidatePath('/participant');

    return { success: true, kit: updatedKit };
  } catch (error) {
    console.error('Failed to activate kit:', error);
    return { success: false, error: (error as Error).message };
  }
}